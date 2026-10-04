import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');

test('add width to the left without changing height, glyph scale or source samples',()=>{
 const context=vm.createContext({});vm.runInContext(read('longpaper125.js'),context);
 const strokes=[{points:[{x:1,y:2}],settings:{size:30}},{points:[{x:.5,y:3}],geometry:{x:.3,y:.2,k:.6,r:.4}}];
 const result=context.LongPaper125.extend({strokes,width:4,height:20,columns:4,extraColumns:2});
 assert.equal(result.height,20);assert.equal(result.columns,6);assert.equal(result.width,5.76);
 assert(Math.abs(result.strokes[0].geometry.x-1.76)<1e-9);assert(Math.abs(result.strokes[1].geometry.x-2.06)<1e-9);
 assert.equal(result.strokes[1].geometry.k,.6);assert.strictEqual(result.strokes[0].points,strokes[0].points);assert.equal(strokes[0].geometry,undefined);
});


test('one thousand strokes index only covers nearby writing and survives edits',()=>{
 const source=read('app.js'),code=source.slice(source.indexOf('let indexedStrokes='),source.indexOf('function extendWidth125('));
 const strokes=Array.from({length:1000},(_,i)=>({box:{x:(i%10)*.38,y:Math.floor(i/10)*.7,w:.12,h:.23}}));
 const context=vm.createContext({flow:{strokes},inkBounds:items=>items[0]?.box||null,Map,Set,Math});vm.runInContext(code,context);
 const scan=rect=>context.flow.strokes.filter(st=>st.box.x+st.box.w>=rect.x&&st.box.x<=rect.x+rect.w&&st.box.y+st.box.h>=rect.y&&st.box.y<=rect.y+rect.h);
 for(const rect of [{x:0,y:0,w:1,h:2},{x:1,y:34,w:2,h:3},{x:0,y:69,w:4,h:3}])assert.deepEqual(Array.from(context.visibleStrokes(rect)).filter(st=>scan(rect).includes(st)),scan(rect));
 const edited=strokes.slice();edited[510]={box:{x:1,y:34,w:.1,h:.1}};context.flow.strokes=edited;assert(context.visibleStrokes({x:1,y:34,w:1,h:1}).includes(edited[510]));
});

test('SVG exports closed colored ink outlines in physical dimensions without mutating writing data',()=>{
 const context=vm.createContext({});vm.runInContext(read('brush.js'),context);vm.runInContext(read('vector125.js'),context);
 const stroke={seed:8,done:true,settings:{size:30,color:'#123456',dry:.8},points:[{x:1,y:1,t:0},{x:1.2,y:1.5,t:20},{x:1.5,y:2,t:40}]},before=JSON.stringify(stroke);
 const svg=context.InkVector125.exportInk([stroke],{width:4,height:8});
 assert.match(svg,/viewBox="0 0 1560 3120"/);assert.match(svg,/width="100mm"/);assert.match(svg,/<path/);assert.match(svg,/#123456/);assert.doesNotMatch(svg,/<image|data:image|NaN|Infinity/);assert.equal(JSON.stringify(stroke),before);
});

test('one thousand characters with ten strokes each: narrow viewport work stays bounded',()=>{
 const source=read('app.js'),code=source.slice(source.indexOf('let indexedStrokes='),source.indexOf('function extendWidth125('));
 const strokes=Array.from({length:10000},(_,i)=>({box:{x:(i%40)*.1,y:Math.floor(i/40)*.2,w:.06,h:.12}}));
 const context=vm.createContext({flow:{strokes},inkBounds:items=>items[0]?.box||null,Map,Set,Math});vm.runInContext(code,context);
 const start=performance.now();let max=0;
 for(let i=0;i<100;i++)max=Math.max(max,context.visibleStrokes({x:i%4,y:i%40*.2,w:.8,h:1}).length);
 assert(max<300,`viewport selected ${max} of ${strokes.length} strokes`);
 console.log(`10,000 strokes / 100 view queries: ${Math.round(performance.now()-start)} ms; maximum visible: ${max}`);
});

test('whole-work color changes ten thousand strokes while retaining source ink geometry and undo',()=>{
 const source=read('app.js'),code=source.slice(source.indexOf('function recolorWork('),source.indexOf('const photoTouches=',source.indexOf('function recolorWork(')));
 const strokes=Array.from({length:10000},(_,i)=>({done:true,settings:{color:i%2?'#050505':'#2867b1'},points:[{x:i%40*.1,y:Math.floor(i/40)*.2}]}));
 const origin=new WeakMap(),context=vm.createContext({flow:{strokes},brush:{color:'#2867b1'},recolorOrigins:origin,$:()=>({value:'all'}),finish(){},commitHistory(){},fullInkRefs:[],inkTiles:new Map(),tileRefs:[],redraw(){},saveSoon(){},toast(){}});
 vm.runInContext(code,context);context.recolorWork(true);
 assert.equal(context.flow.strokes.length,10000);assert(context.flow.strokes.every(st=>st.settings.color==='#2867b1'));
 assert.strictEqual(context.flow.strokes[0],strokes[0]);assert.strictEqual(context.flow.strokes[1].points,strokes[1].points);assert.strictEqual(origin.get(context.flow.strokes[1]),strokes[1]);
});
