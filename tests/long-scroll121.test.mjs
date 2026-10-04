import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const index=source.slice(source.indexOf('let indexedStrokes='),source.indexOf('function cacheTransform('));
const recolor=source.slice(source.indexOf('function recolorWork('),source.indexOf('const photoTouches=',source.indexOf('function recolorWork(')));

test('a thousand glyphs: viewport index matches full scan across zoom, edits and appended strokes',()=>{
 const strokes=Array.from({length:1000},(_,i)=>({done:true,settings:{color:'#050505'},box:{x:(i%10)*.38,y:Math.floor(i/10)*.7,w:.12,h:.23}}));
 const context=vm.createContext({flow:{strokes},inkBounds:items=>items[0]?.box||null,Map,Set,Math});
 vm.runInContext(index,context);
 const scan=rect=>context.flow.strokes.filter(st=>st.box.x+st.box.w>=rect.x&&st.box.x<=rect.x+rect.w&&st.box.y+st.box.h>=rect.y&&st.box.y<=rect.y+rect.h);
 for(const rect of [{x:0,y:0,w:1,h:2},{x:1,y:34,w:2,h:3},{x:0,y:69,w:4,h:3}]){
  const actual=context.visibleStrokes(rect).filter(st=>scan(rect).includes(st));
  assert.deepEqual(Array.from(actual),scan(rect));
 }
 const edited=strokes.slice();edited[510]={...edited[510],box:{x:1,y:34,w:.1,h:.1}};context.flow.strokes=edited;
 assert(context.visibleStrokes({x:1,y:34,w:1,h:1}).includes(edited[510]));
 edited.push({box:{x:1,y:75,w:.1,h:.1}});
 assert(context.visibleStrokes({x:1,y:75,w:1,h:1}).includes(edited.at(-1)));
});

test('whole work recolor changes all thousand strokes, preserves geometry and skips unchanged colors',()=>{
 const strokes=Array.from({length:1000},(_,i)=>({done:true,settings:{color:i%2?'#050505':'#2867b1'},points:[{x:.2,y:i*.1}]}));
 const origin=new WeakMap(),context=vm.createContext({flow:{strokes},brush:{color:'#2867b1'},recolorOrigins:origin,$:()=>({value:'all'}),finish(){},commitHistory(){},fullInkRefs:[],inkTiles:new Map(),tileRefs:[],redraw(){},saveSoon(){},toast(){}});
 vm.runInContext(recolor,context);context.recolorWork(true);
 assert.equal(context.flow.strokes.length,1000);
 assert(context.flow.strokes.every(st=>st.settings.color==='#2867b1'));
 assert.strictEqual(context.flow.strokes[0],strokes[0]);
 assert.strictEqual(context.flow.strokes[1].points,strokes[1].points);
 assert.strictEqual(origin.get(context.flow.strokes[1]),strokes[1]);
});

test('long-scroll zoom drag coalesces redraws and applies the released value',()=>{
 const start=source.indexOf('let zoomRenderTimer=0;'),end=source.indexOf("$('followDirection').onchange",start);
 const timers=new Map(),zoom={value:'200',addEventListener(type,fn){this[type]=fn}},calls=[];
 let next=0;
 const context=vm.createContext({flow:{strokes:Array(1000)},camera:{x:1,y:2},W:400,H:800,S:200,focused:false,overview:true,
  $:()=>zoom,clearTimeout:id=>timers.delete(id),setTimeout:(fn)=>{timers.set(++next,fn);return next},finish(){},resize:center=>calls.push({value:zoom.value,center}),saveSoon(){}});
 vm.runInContext(source.slice(start,end),context);
 for(let i=201;i<=300;i++){zoom.value=String(i);zoom.oninput()}
 assert.equal(calls.length,0);
 assert.equal(timers.size,1);
 zoom.change();
 assert.equal(calls.length,1);
 assert.equal(calls[0].value,'300');
 assert.equal(timers.size,0);
});
