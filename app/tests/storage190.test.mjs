import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import fs from 'node:fs';import{IDBFactory}from'fake-indexeddb';
test('quota recovery retries original work and preserves existing artwork and engine cache',async()=>{
 const indexedDB=new IDBFactory(),open=indexedDB.open.bind(indexedDB);let fail=false,removed=[];
 indexedDB.open=(...args)=>{const r=open(...args);r.addEventListener('success',()=>{const d=r.result,transaction=d.transaction.bind(d);d.transaction=(...a)=>{if(fail&&a[1]==='readwrite'){fail=false;throw Object.assign(Error('full'),{name:'QuotaExceededError'})}return transaction(...a)}});return r};
 const c={indexedDB,setTimeout,clearTimeout,URL,localStorage:{removeItem(){}},caches:{keys:async()=>['annotation-assets','annotation-core190'],delete:async n=>removed.push(n),open:async()=>({keys:async()=>[],delete:async()=>{}})}};c.window=c;vm.runInNewContext(fs.readFileSync('storage.js','utf8'),c);
 await c.DraftStore.saveWork({id:'old',title:'old',draft:{flow:{strokes:[1]}},blob:new Blob(['old'])});fail=true;
 await c.DraftStore.saveWork({id:'new',title:'new',draft:{flow:{strokes:[2]}},blob:new Blob(['new'])});assert.equal((await c.DraftStore.get('new')).id,'new');assert.equal((await c.DraftStore.get('old')).draft.flow.strokes[0],1);assert.deepEqual(removed,['annotation-assets']);
});
