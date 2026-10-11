import test from 'node:test';import assert from 'node:assert/strict';import{Window}from'happy-dom';import fs from'node:fs';import{IDBFactory}from'fake-indexeddb';
const wait=async test=>{for(let i=0;i<150;i++){if(test())return;await new Promise(r=>setTimeout(r,30))}throw Error('startup dependency timeout')};
test('actual core initializes and opens writing before extensions; offline account never blocks copy preview and export',async()=>{
const w=new Window({url:'https://iinnkk.me/engine186.html?prepare158=1',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});w.document.body.innerHTML=fs.readFileSync('index-source106.html','utf8').match(/<body[^>]*>([\s\S]*)<\/body>/)[1].replace(/<script[\s\S]*?<\/script>/g,'').replace(/<svg[\s\S]*?<\/svg>/g,'');w.WriterOnly157=true;w.WarmEngine158=true;w.StartupErrors106=[];w.indexedDB=new IDBFactory();w.Path2D=class{addPath(){}};w.Option=function(t,v){let x=w.document.createElement('option');x.textContent=t;x.value=v;return x};w.document.fonts={ready:Promise.resolve(),load:async()=>[],check:()=>true,add(){},addEventListener(){}};w.fetch=async()=>({ok:true,json:async()=>[],text:async()=>'',blob:async()=>new w.Blob()});w.requestAnimationFrame=()=>1;w.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});w.ResizeObserver=class{observe(){}disconnect(){}};w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({canvas:this,measureText:()=>({width:20}),getImageData:()=>({data:new Uint8ClampedArray(40000)}),createImageData:()=>({data:new Uint8ClampedArray(40000)})},{get:(o,k)=>k in o?o[k]:()=>new Proxy({},{get:()=>()=>{}})})};w.HTMLCanvasElement.prototype.toDataURL=()=> 'data:image/png;base64,AA==';w.HTMLCanvasElement.prototype.toBlob=fn=>fn(new w.Blob(['png']));w.console.error=()=>{};

try{
w.StartupErrors106=['optional extension failed'];w.WriterModules173=new Promise(()=>{});
const files=JSON.parse(fs.readFileSync('runtime-sources106.json')).scripts,split=files.indexOf('writer-entry154.js')+1;
const run=file=>{if(file==='cloud75.js')w.IInkSupabaseSDK={createClient(){throw Error('account unavailable')}};w.eval(fs.readFileSync(file,'utf8')+'\n//# sourceURL='+file)};
for(const file of files.slice(0,split))run(file);
await wait(()=>w.WriterEntry154?.ready);
assert.equal(w.Reference129,undefined);assert.equal(w.ExportStudio181,undefined);
await w.WriterEntry154.navigate('?mode=single');assert.equal(w.localStorage.getItem('iinnkk.mode53'),'single');assert.equal(w.writingLocked,false);assert.equal(w.AnnotationApp.isOverview55(),false);
await w.WriterEntry154.navigate('?mode=letter');assert.equal(w.localStorage.getItem('iinnkk.mode53'),'letter');assert.equal(w.writingLocked,false);
for(const file of files.slice(split))run(file);
await wait(()=>w.Reference129?.ready&&w.Revision161?.ready&&w.ExportStudio181?.ready);
assert.equal(w.InkCloud75,undefined);assert.equal(w.WriterEntry154.ready,true);
await w.WriterEntry154.navigate('?mode=copy');assert.ok(w.document.querySelector('dialog[open]'));
}finally{await w.happyDOM.abort()}
});
