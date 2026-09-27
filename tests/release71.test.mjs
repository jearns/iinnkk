import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import QRCode from 'qrcode';

const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
test('every published literary author has an explicit country and a matching flag palette',()=>{
 const context={window:{}};
 vm.runInNewContext(read('quotes-refresh.js'),context);
 const authors=[...new Set(context.window.RefreshedQuotes.filter(r=>r.cat==='literature').map(r=>r.author))];
 const countries=read('revision61.js').match(/const countries=(\{[\s\S]*?\});\s*window\.LiteraryCountries61/);
 assert.ok(countries,'curated author-country catalog is present');
 const map=vm.runInNewContext('('+countries[1]+')');
 const missing=authors.filter(author=>!map[author]);
 assert.deepEqual(missing,[]);
 const palette=read('revision62.js').match(/const colorSets=(\{[^;]*?\});\s*const luminance/);
 assert.ok(palette,'country palette catalog is present');
 const colors=vm.runInNewContext('('+palette[1]+')');
 assert.deepEqual([...new Set(authors.map(a=>map[a]).filter(c=>!colors[c]))],[]);
});
test('expanded big-character grid stays square including its sheet margins',()=>{
 for(const [rows,cols] of [[1,1],[7,1],[1,7],[4,2],[3,5]]){
  const ratio=4/(.36+3.52*rows/cols);
  assert.ok(Math.abs(3.52/cols-(4/ratio-.36)/rows)<1e-12);
 }
});
test('the artwork footer can encode the exact public URL in a real QR symbol',()=>{
 const code=QRCode.create('https://iinnkk.me',{errorCorrectionLevel:'M',margin:0});
 assert.ok(code.modules.size>=21);
 assert.equal(code.modules.data.length,code.modules.size**2);
});
