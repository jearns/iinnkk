import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {writingPreset262} from '../copy-download218.js';

test('a copy QR carries the exact catalogue entry and bounded saved brush settings',()=>{
 const preset=writingPreset262({id:'timeline73:su-shi-chibi'},{values:{zoom:'350'},brush:{lineStrength108:62,size:30}});
 assert.deepEqual([preset.zoom,preset.style,preset.size],[350,62,30]);
 const url=new URL(preset.url);assert.equal(url.origin,'https://iinnkk.me');
 assert.equal(url.searchParams.get('post'),'su-shi-chibi');
 assert.equal(url.searchParams.get('zoom'),'350');assert.equal(url.searchParams.get('style'),'62');assert.equal(url.searchParams.get('size'),'30');
 assert.equal(writingPreset262({id:'unrelated-local-book'},{values:{zoom:'350'}}),null);
});

test('only the one-cell rice grid is admitted to the Ark, while other modes retain separate statistics',()=>{
 const s=fs.readFileSync('handwriting-ledger254.js','utf8'),part=s.slice(s.indexOf('function source(){'),s.indexOf('function groupStrokes('));
 const c={localStorage:{getItem:()=>c.mode},root:{bigPaperLayout63:{active:true,rows:1,cols:1}},document:{getElementById:()=>({value:c.ruling})}};
 vm.runInNewContext(part,c);
 c.mode='single';c.ruling='mi';assert.equal(c.source(),'large');
 c.ruling='tian';assert.equal(c.source(),'creation');
 c.ruling='mi';c.root.bigPaperLayout63.cols=2;assert.equal(c.source(),'creation');
 c.mode='copy';assert.equal(c.source(),'copy');
 assert.match(s,/s\.source==='large'&&\(!old\|\|s\.vectors\.length>=old\.strokes\).*store\.put\(s\)/);
 assert.match(s,/summary\.sources\[s\.source\]/);
});

test('shared link settings apply only to the matching catalogue entry',()=>{
 const s=fs.readFileSync('timeline73.js','utf8'),part=s.slice(s.indexOf('function sharedPreset262('),s.indexOf('async function openCopy('));
 const c={location:{search:'?post=su-shi-chibi&zoom=350&style=62&size=30'},URLSearchParams};vm.runInNewContext(part,c);
 assert.deepEqual(JSON.parse(JSON.stringify(c.sharedPreset262({id:'su-shi-chibi'}))),{zoom:350,style:62,size:30});
 assert.equal(c.sharedPreset262({id:'another-post'}),null);
 c.location.search='?post=su-shi-chibi&zoom=99999&style=-1&size=0';
 assert.deepEqual(JSON.parse(JSON.stringify(c.sharedPreset262({id:'su-shi-chibi'}))),{zoom:250,style:75,size:25});
});

test('the exported footer QR uses the specific post URL and prints the optional writing parameters',()=>{
 let linked='',printed=[];const root={SealEngine:{stamp:()=>({})},InkQR47:{create:url=>{linked=url;return{modules:{size:1,data:[1]}}}}};
 vm.runInNewContext(fs.readFileSync('brand-credit182.js','utf8'),{window:root});
 const ctx={save(){},restore(){},measureText:text=>({width:String(text).length*10}),fillText:text=>printed.push(text),fillRect(){},drawImage(){},set font(v){},set fillStyle(v){},set textAlign(v){},set textBaseline(v){}};
 root.BrandCredit182.draw(ctx,{width:1000,height:450,qr:true,credit:false,qrUrl262:'https://iinnkk.me/?post=su-shi-chibi&zoom=350&style=62&size=30',writingParameters262:'书写参数：缩放350%｜书风62｜笔径30'});
 assert.match(linked,/post=su-shi-chibi/);assert.ok(printed.some(s=>s.includes('书写参数：缩放350%')));
});
