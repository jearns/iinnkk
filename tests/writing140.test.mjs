import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const ref=fs.readFileSync(new URL('../revision129.js',import.meta.url),'utf8');
function lineFunction(src,name){return src.split('\n').find(l=>l.trim().startsWith('function '+name+'('))}

test('manual body diameter survives preview entry, signature return and zoom adjustment',()=>{
 const fields=new Map();const $=id=>{if(!fields.has(id))fields.set(id,{value:'',hidden:false});return fields.get(id)};
 $('zoom').value='350';const brush={size:37,manualSize140:true,lineStrength108:65};
 const e={brush,reference:{},overview:true,photoEditing:false,active:null,signatureReturn110:null,localStorage:{getItem:()=> 'copy'},ParticleBrush:{settings:s=>s},window:{Revision97:{setPart(){}}},$: $,mountKey:'frame',paperCacheKey:'x',overviewKey:'x',touches:new Map(),live:{getBoundingClientRect:()=>({left:0,top:0})},paperScreen:()=>({x:0,y:0,scale:100}),sheetBounds:()=>({w:4,h:6}),resetWritingTap96(){},cancelAutoMove(){},resize(){},locate(){},updateGuide(){},document:{body:{classList:{remove(){}}}},requestAnimationFrame:fn=>fn(),CustomEvent:class{},updateBrushControls(){},focused:true};
 e.document.dispatchEvent=()=>{};e.Event=class{};
 const start=app.indexOf('function writeAtPreview96('),end=app.indexOf('\n}',start)+2;
 vm.createContext(e);vm.runInContext(app.slice(start,end)+';this.enter=writeAtPreview96;'+lineFunction(app,'autoBrushForZoom'),e);
 e.enter(100,200);assert.equal(e.brush.size,37);assert.equal(e.brush.lineStrength108,65);assert.equal($('zoom').value,'350');
 e.autoBrushForZoom();assert.equal(e.brush.size,37);
 // Run the production return branch, preserving the stored body size over signature size.
 const branch=app.split('\n').find(l=>l.trim().startsWith('if(signatureReturn110){const old='));
 Object.assign(e,{signatureReturn110:{size:37,zoom:'350',camera:{x:1,y:2},focused:true,locked:false,autoScroll:'on'},brush:{size:8,manualSize140:true},Revision39:{syncLock(){}},clampCamera(){},background(){},ensureCache(){},presentInk(){},update(){},persist(){},toast(){}});
 vm.runInContext('this.returnBody=()=>{'+branch+'}',e);e.returnBody();assert.equal(e.brush.size,37);assert.equal(e.signatureReturn110,null);
});

test('selecting the leftmost of eight source columns is not clamped to a two-column writing grid',()=>{
 const columns=Array.from({length:8},(_,i)=>({x:1-(i+.5)/8,w:1/8,glyphs:[{y:.2,h:.1},{y:.6,h:.1}]}));
 const e={A:{referenceCells128:()=>columns,writingGrid67:()=>({cols:2,rows:1}),getReference:()=>({naturalWidth:800,naturalHeight:1600}),paperBounds133:()=>({w:4,h:8}),focusPoint47:(x,y)=>e.focus={x,y}},current:{row:0,col:0},settings:{rows:2,follow:true,view133:'full'},manuallyMoved140:true,displayCrop137:{x:0,y:0,w:1,h:1},viewport:{clientWidth:800,clientHeight:1600,getBoundingClientRect:()=>({left:0,top:0})},image:{naturalWidth:800,naturalHeight:1600},pan:{x:0,y:0},zoom:1,window:{},document:{dispatchEvent(){}},CustomEvent:class{},transform(){},columnsView(){},sizeFloat(){},persist(){}};
 vm.createContext(e);vm.runInContext(fs.readFileSync(new URL('../reference-geometry133.js',import.meta.url),'utf8'),e);e.ReferenceGeometry133=e.window.ReferenceGeometry133;
 vm.runInContext(lineFunction(ref,'sourceCell137')+'\n'+lineFunction(ref,'setCell')+'\n'+lineFunction(ref,'selectAt'),e);
 e.selectAt(50,960);assert.equal(e.current.col,7);assert.equal(e.current.row,1);assert.ok(Math.abs(e.focus.x-.25)<1e-8);assert.ok(Math.abs(e.focus.y-4.8)<1e-8);
 e.selectAt(750,320);assert.equal(e.current.col,0);assert.equal(e.current.row,0);
 e.manuallyMoved140=false;e.floatSide140='left';e.selectAt(50,960);assert.equal(e.floatSide140,'left','reference selection keeps the window still');e.setCell(1,7,true);assert.equal(e.floatSide140,'right','body writing in left columns moves the window right');e.manuallyMoved140=true;e.setCell(0,0,true);assert.equal(e.floatSide140,'right','manual placement takes precedence');
});

test('double tap enlarges the first selected source cell without reselecting after recentering',()=>{
 let selects=0,enlarges=0;const e={viewport:{},points:new Map([[1,{}]]),gesture:{time:0,multi:false,moved:false},lastTap:null,selectAt:()=>selects++,closeup:()=>enlarges++};
 vm.createContext(e);vm.runInContext(ref.slice(ref.indexOf(' viewport.onpointerup='),ref.indexOf('viewport.onpointercancel=')),e);
 e.viewport.onpointerup({pointerId:1,timeStamp:100,clientX:50,clientY:60});e.points.set(1,{});e.gesture={time:150,multi:false,moved:false};e.viewport.onpointerup({pointerId:1,timeStamp:200,clientX:50,clientY:60});assert.equal(selects,1);assert.equal(enlarges,1);
});

test('column height updates preserve a manually dragged right-side window; automatic placement can switch sides',()=>{
 const e={image:{naturalWidth:800,naturalHeight:1600},floating:{style:{}},manuallySized:false,manuallyMoved140:true,floatSide140:'right',innerWidth:1000,settings:{view133:'columns'},current:{col:0},cell:()=>({x:0,w:.1}),columns137:()=>[],A:{isOverview55:()=>false},$:()=>({getBoundingClientRect:()=>({width:900,height:700,top:50})}),ReferenceIO129:{fitWindow:()=>({width:250,height:400})},ReferenceGeometry133:{threeColumns:()=>({w:.3})},ReferenceWindow134:{aligned:()=>({top:50,height:700})}};
 e.floating.style.left='720px';e.floating.style.top='12px';vm.createContext(e);vm.runInContext(lineFunction(ref,'sizeFloat'),e);
 e.sizeFloat();e.sizeFloat();assert.equal(e.floating.style.left,'720px');assert.equal(e.floating.style.top,'12px');
 e.manuallyMoved140=false;e.sizeFloat();assert.equal(e.floating.style.left,'890px');e.floatSide140='left';e.sizeFloat();assert.equal(e.floating.style.left,'0px');
});

test('paper-and-brush steppers adjust current values precisely and enforce bounds',()=>{
 class Node{constructor(){this.children=[];this.dataset={};this.value='';this.classList={add(){}}}append(...nodes){this.children.push(...nodes)}}
 const controls={sizeNumber:{value:37,dispatchEvent(){}},zoom:{value:500,dispatchEvent(){}}},state={style:65};
 const e={E:()=>new Node(),panel:new Node(),$:key=>controls[key],A:{writingParameters133:()=>state,configure47:({brushPatch})=>state.style=brushPatch.lineStrength108},ParticleBrush:{lineProfile108:()=>({})},syncStatus(){},Event:class{}};
 vm.createContext(e);const s=fs.readFileSync(new URL('../revision133.js',import.meta.url),'utf8');vm.runInContext(s.slice(s.indexOf(' const fields=[];'),s.indexOf(' const icon=')),e);
 const stepper=i=>e.panel.children[i].children[1];stepper(1).children[2].onclick();assert.equal(controls.sizeNumber.value,38);stepper(1).children[0].onclick();assert.equal(controls.sizeNumber.value,37);
 stepper(2).children[2].onclick();assert.equal(controls.zoom.value,525);state.style=100;stepper(0).children[2].onclick();assert.equal(state.style,100);
});

test('copy work title uses the book, never a stale quote; cloud formatting retains it',()=>{
 const e={window:{CopyAlbums38:{active:{title:'赵孟頫·赤壁赋'},paused129:false},currentQuote:{author:'泰戈尔',title:'飞鸟集'}},reference:{},localStorage:{getItem:()=> 'copy'}};
 vm.createContext(e);vm.runInContext(fs.readFileSync(new URL('../work-meta84.js',import.meta.url),'utf8'),e);
 e.WorkMeta84=e.window.WorkMeta84;vm.runInContext(app.slice(app.indexOf('function workSubject140()'),app.indexOf('async function archiveWork(')),e);
 assert.equal(e.workTitle140('敬源','旧标题',0),'敬源 临写 赵孟頫 赤壁赋');assert.equal(e.WorkMeta84.format('敬源','敬源 临写 赵孟頫 赤壁赋',0,'泰戈尔','飞鸟集'),'敬源 临写 赵孟頫 赤壁赋');
});

for(const characters of [30,1000])test(`${characters} characters: incremental autosave does not replay all ink or evict current writing rasters`,()=>{
 const canvas=()=>({width:0,height:0,getContext(){return{canvas:this,translate(){},drawImage(){},save(){},restore(){}}}});
 const surface=canvas(),fullInk=canvas();let interactiveCalls=0,thumbnailCalls=0;
 const e={Map,WeakMap,JSON,Math,performance:{now:()=>0},setTimeout:()=>1,clearTimeout(){},document:{createElement:canvas},paper:surface,ink:canvas(),live:canvas(),historySurface:canvas(),strokeSurface:canvas(),compositionOptions:null,window:{annotationInkOpacity:1},displayStroke:s=>s,inkBounds:()=>({x:0,y:0,w:.2,h:.3}),ParticleBrush:{render:(st,t,scale)=>scale>=1024?interactiveCalls++:thumbnailCalls++},gesturing:false,active:null,fullInk,fullInkRefs:[],fullInkScale:0,sheetBounds:()=>({w:4,h:Math.max(8,characters/5)}),flow:{strokes:[]}};
 vm.createContext(e);vm.runInContext(app.slice(app.indexOf('const strokeRasters=new Map()'),app.indexOf('function toggleInkMode()'))+'\n'+lineFunction(app,'ensureFullInk')+';this.paint=renderInk;this.cachePixels=()=>({writing:rasterPixels,thumbnail:thumbnailPixels140});',e);
 const target={canvas:surface,save(){},restore(){},drawImage(){},globalAlpha:1};
 // Eight completed strokes per character at 500% zoom, with autosave after each group.
 for(let c=0;c<characters;c++){for(let i=0;i<8;i++){const st={done:true,settings:{size:15},points:Array.from({length:80},(_,p)=>({x:p/100,y:c/10,t:p*8}))};e.flow.strokes.push(st);e.paint(st,target,1600,1600)}const recent=e.flow.strokes.slice(-8);e.ensureFullInk();e.ensureFullInk();for(const st of recent)e.paint(st,target,1600,1600)}
 assert.equal(interactiveCalls,characters*8,'autosave must not force the visible handwriting to rebuild');assert.equal(thumbnailCalls,characters*8,'each appended stroke is painted into the full-sheet bitmap exactly once');assert.ok(e.cachePixels().writing<=32000000);assert.ok(e.cachePixels().thumbnail<=8000000);
});
