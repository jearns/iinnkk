import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const code=source.slice(source.indexOf('function expandPaperEdge('),source.indexOf('\n\nfunction photoLayout()'));
function sheet(){const fields={paperExtent:{value:'fixed'},rows:{value:'4'},columns:{value:'4'}};const stroke={points:[{x:1,y:1}],settings:{size:30}};const scope={active:null,flow:{strokes:[stroke]},signatureStrokes:[],sealPositions:{},extraSeals:[],photos:[],camera:{x:0,y:0},lastWritingView:null,infiniteExtent:{w:4,h:4},paperCacheKey:'',overviewKey:'',fullInkRefs:[],inkTiles:new Map(),tileRefs:[],cacheArea:null,miniRevision:0,$:id=>fields[id],sheetBounds:()=>({w:scope.infiniteExtent.w,h:scope.infiniteExtent.h}),writingArea:()=>({w:scope.infiniteExtent.w,h:scope.infiniteExtent.h}),gridMetrics:a=>({dx:scope.infiniteExtent.manual?scope.infiniteExtent.dx:a.w/4,dy:scope.infiniteExtent.manual?scope.infiniteExtent.dy:a.h/4}),inkBounds:()=>({x:1,y:1,w:.2,h:.2}),finish(){},commitHistory(){},resize(){},saveSoon(){},Math,Object,Number};vm.createContext(scope);vm.runInContext(code+';globalThis.adjust=expandPaperEdge',scope);return{scope,fields,stroke}}
test('paper edges change one dimension while keeping physical ink and pen size',()=>{for(const edge of ['left','right','top','bottom']){const{scope,stroke}=sheet();assert.equal(scope.adjust(edge,1),true);assert.equal(scope.infiniteExtent.w,edge==='left'||edge==='right'?5:4);assert.equal(scope.infiniteExtent.h,edge==='top'||edge==='bottom'?5:4);assert.strictEqual(scope.flow.strokes[0].points,stroke.points);assert.equal(scope.flow.strokes[0].settings.size,30);assert.equal(scope.flow.strokes[0].geometry?.x||0,edge==='left'?1:0)}});
test('inward drag shrinks blank edge but stops before written ink',()=>{const{scope}=sheet();assert.equal(scope.adjust('right',-.5),true);assert.equal(scope.infiniteExtent.w,3.5);assert.equal(scope.adjust('left',-2),false);assert.equal(scope.infiniteExtent.w,3.5)});

test('manual expansion keeps grid pitch and cannot auto-grow the other axis',()=>{
 const {scope}=sheet();
 const grow=source.slice(source.indexOf('function growPaper('),source.indexOf('function expandPaperEdge('));
 scope.infinite=()=>true;vm.runInContext(grow,scope);
 assert.equal(scope.adjust('right',1),true);
 assert.equal(scope.infiniteExtent.dx,1);assert.equal(scope.infiniteExtent.dy,1);
 scope.growPaper({x:20,y:20});assert.equal(scope.infiniteExtent.w,5);assert.equal(scope.infiniteExtent.h,4);
 assert.equal(scope.adjust('bottom',1),true);assert.equal(scope.infiniteExtent.dx,1);assert.equal(scope.infiniteExtent.dy,1);
});

test('production writing area and grid retain margins and pitch across four edges',()=>{
 const {scope,fields,stroke}=sheet();
 scope.infinite=()=>fields.paperExtent.value==='infinite';
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
