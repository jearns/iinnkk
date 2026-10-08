import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const code=source.slice(source.indexOf('function expandPaperEdge('),source.indexOf('\n\nfunction photoLayout()'));
function sheet(){const fields={paperExtent:{value:'fixed'},rows:{value:'4'},columns:{value:'4'}};const stroke={points:[{x:1,y:1}],settings:{size:30}};const scope={active:null,flow:{strokes:[stroke]},signatureStrokes:[],sealPositions:{},extraSeals:[],photos:[],camera:{x:0,y:0},lastWritingView:null,infiniteExtent:{w:4,h:4},paperCacheKey:'',overviewKey:'',fullInkRefs:[],inkTiles:new Map(),tileRefs:[],cacheArea:null,miniRevision:0,$:id=>fields[id],sheetBounds:()=>({w:scope.infiniteExtent.w,h:scope.infiniteExtent.h}),writingArea:()=>({w:scope.infiniteExtent.w,h:scope.infiniteExtent.h}),gridMetrics:a=>({dx:scope.infiniteExtent.manual?scope.infiniteExtent.dx:a.w/4,dy:scope.infiniteExtent.manual?scope.infiniteExtent.dy:a.h/4}),inkBounds:()=>({x:1,y:1,w:.2,h:.2}),finish(){},commitHistory(){},resize(){},saveSoon(){},Math,Object,Number};vm.createContext(scope);vm.runInContext(code+';globalThis.adjust=expandPaperEdge',scope);return{scope,fields,stroke}}
test('paper edges change one dimension while keeping physical ink and pen size',()=>{for(const edge of ['left','right','top','bottom']){const{scope,stroke}=sheet();assert.equal(scope.adjust(edge,1),true);assert.equal(scope.infiniteExtent.w,edge==='left'||edge==='right'?5:4);assert.equal(scope.infiniteExtent.h,edge==='top'||edge==='bottom'?5:4);assert.strictEqual(scope.flow.strokes[0].points,stroke.points);assert.equal(scope.flow.strokes[0].settings.size,30);assert.equal(scope.flow.strokes[0].geometry?.x||0,edge==='left'?1:0)}});
test('inward drag shrinks blank edge but stops before written ink',()=>{const{scope}=sheet();assert.equal(scope.adjust('right',-.5),true);assert.equal(scope.infiniteExtent.w,3.5);assert.equal(scope.adjust('left',-2),true);assert.ok(Math.abs(scope.infiniteExtent.w-2.58)<1e-9)});

test('manual expansion keeps grid pitch and cannot auto-grow the other axis',()=>{
 const {scope}=sheet();
 scope.customSizedPaper=()=>true;
 assert.equal(scope.adjust('right',1),true);
 assert.equal(scope.infiniteExtent.dx,1);assert.equal(scope.infiniteExtent.dy,1);
 assert.equal(scope.infiniteExtent.w,5);assert.equal(scope.infiniteExtent.h,4);
 assert.equal(scope.adjust('bottom',1),true);assert.equal(scope.infiniteExtent.dx,1);assert.equal(scope.infiniteExtent.dy,1);
});

test('production writing area and grid retain margins and pitch across four edges',()=>{
 const {scope,fields,stroke}=sheet();
 scope.customSizedPaper=()=>['manual','infinite'].includes(fields.paperExtent.value);
 scope.template=()=>({});scope.reference=null;scope.photoImage=null;scope.basicPapers=new Set(['plain']);
 for(const [k,value] of Object.entries({stationery:'plain',sceneChoice:'none',photoMode:'none'}))fields[k]={value};
 const area=source.slice(source.indexOf('function writingArea('),source.indexOf('function clampCamera('));
 const grid=source.slice(source.indexOf('function gridMetrics('),source.indexOf('function fitPaper('));
 vm.runInContext(area+grid,scope);
 const before=scope.writingArea(),pitch=scope.gridMetrics();
 for(const edge of ['right','bottom','left','top']){
  const horizontal=edge==='left'||edge==='right',step=horizontal?pitch.dx:pitch.dy;
  assert.equal(scope.adjust(edge,step),true);
  const next=scope.gridMetrics();assert.equal(next.dx,pitch.dx);assert.equal(next.dy,pitch.dy);
 }
 assert.equal(scope.writingArea().x,before.x);assert.equal(scope.writingArea().y,before.y);
 assert.equal(scope.flow.strokes[0].geometry.k,1);assert.strictEqual(scope.flow.strokes[0].points,stroke.points);
 assert.ok(Math.abs(scope.flow.strokes[0].geometry.y-pitch.dy)<1e-12);
});

test('shrinking an edge ignores content close to another edge and clamps before ink',()=>{const{scope}=sheet();scope.inkBounds=()=>({x:0,y:0,w:1.2,h:1.2});assert.equal(scope.adjust('right',-10),true);assert.ok(Math.abs(scope.infiniteExtent.w-1.28)<1e-9);assert.equal(scope.infiniteExtent.h,4);assert.equal(scope.adjust('right',-1),false);assert.equal(scope.adjust('left',-.2),false)});

test('auto movement clamps to saved sheet and wraps at its existing bottom in legacy mode',()=>{const{scope,fields}=sheet();scope.signatureReturn110=null;scope.customSizedPaper=()=>true;fields.paperExtent.value='manual';scope.infiniteExtent={w:4,h:12};scope.window={};scope.W=2;scope.H=4;scope.S=1;scope.focused=true;scope.camera={x:20,y:30};scope.vertical=()=>true;scope.writingArea=()=>({x:.24,y:.18,w:3.52,h:11.64});scope.gridMetrics=()=>({rows:12,cols:4,dx:.88,dy:.97});scope.lineCamera39=q=>q;scope.toast=()=>{};fields.autoScroll={value:'on'};fields.edgeDistance={value:'20'};const clamp=source.slice(source.indexOf('function clampCamera('),source.indexOf('function locate('));const auto=source.slice(source.indexOf('function nextPaperTarget('),source.indexOf('function afterLift('));vm.runInContext(clamp+auto,scope);scope.clampCamera();assert.equal(scope.camera.x,2);assert.equal(scope.camera.y,8);const next=scope.nextPaperTarget({x:3.3,y:11.7});assert.equal(next.wrap,true);assert.ok(next.camera.y>=0&&next.camera.y<=8);assert.equal(scope.infiniteExtent.h,12);assert.equal(scope.nextPaperTarget({x:.3,y:11.7}),null)});
test('legacy infinite mode loads as finite manual paper without changing saved size',()=>{const{scope,fields}=sheet();fields.stationery={value:'plain'};const restore=source.slice(source.indexOf('function restoreValue('),source.indexOf('function applySettings('));const sized=source.slice(source.indexOf('function customSizedPaper('),source.indexOf('function expandPaperEdge('));vm.runInContext(restore+sized,scope);scope.infiniteExtent={w:4,h:12};scope.restoreValue('paperExtent','infinite');assert.equal(fields.paperExtent.value,'manual');assert.equal(scope.sheetBounds().h,12);assert.equal(scope.sheetBounds().w,4);scope.restoreValue('stationery','infinite');assert.equal(fields.stationery.value,'plain');assert.equal(fields.paperExtent.value,'manual');assert.equal(scope.sheetBounds().h,12)});
