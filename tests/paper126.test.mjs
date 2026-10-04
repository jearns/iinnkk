import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const code=source.slice(source.indexOf('function expandPaper126('),source.indexOf('function cacheTransform(',source.indexOf('function expandPaper126(')));

test('pulling each edge keeps the other dimension and original ink scale',()=>{
 for(const edge of ['left','right','top','bottom']){
  const values={paperExtent:{value:'fixed'},letterLayout:{value:'normal'},columns:{value:'4'},rows:{value:'8'}};
  const flow={strokes:[{points:[{x:1,y:2}],geometry:{x:.3,y:.4,k:.8,r:0}}]};
  const context={flow,photos:[],signatureStrokes:[],sealPositions:{},extraSeals:[],infiniteExtent:{w:4,h:8},overview:false,camera:{x:0,y:0},paperCacheKey:'',fullInk:{width:0},fullInkRefs:[],inkTiles:new Map(),tileRefs:[],cacheArea:null,overviewKey:'',sealHandleKey:'',sealOverlayKey:'',Math,Number,
   $:id=>values[id],sheetBounds:()=>({w:4,h:8}),finish(){},cancelAutoMove(){},commitHistory(){},resize(){},saveSoon(){},toast(){}};
  vm.createContext(context);vm.runInContext(code,context);const result=context.expandPaper126(edge,2);
  assert.equal(result.width,edge==='left'||edge==='right'?6:4);
  assert.equal(result.height,edge==='top'||edge==='bottom'?10:8);
  assert.equal(flow.strokes[0].geometry.k,.8);
  assert.equal(flow.strokes[0].geometry.x,.3+(edge==='left'?2:0));
  assert.equal(flow.strokes[0].geometry.y,.4+(edge==='top'?2:0));
  assert.equal(flow.strokes[0].points[0].x,1);
  assert.equal(values.paperExtent.value,'infinite');
 }
});

test('save panel finds a container in the deployed markup',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(html,/<dialog id="downloadDialog"/);
 const script=readFileSync(new URL('../revision119.js',import.meta.url),'utf8');
 assert.match(script,/querySelector\('\.dialogBody'\)\|\|dialog/);
});
