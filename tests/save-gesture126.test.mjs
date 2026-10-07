import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('app.js','utf8');
const fn=(name,next)=>source.slice(source.indexOf('function '+name+'('),source.indexOf(next,source.indexOf('function '+name+'(')));
test('five and six taps dispatch only clear and undo after the sequence',()=>{
 for(const [count,expected] of [[2,'preview'],[3,'signature'],[4,'undo'],[5,'clear'],[6,'undo'],[7,undefined]]){
  const calls=[],context={previousTap:{count},resetWritingTap96(){},overview:false,photoEditing:false,touches:new Map(),document:{body:{classList:{contains:()=>false}}},fitPaper:()=>calls.push('preview'),requestAnimationFrame(){},toggleSignature110:()=>calls.push('signature'),$:id=>({click:()=>calls.push(id)})};
  vm.runInNewContext(fn('dispatchWritingTap96','function recordWritingTap96')+';dispatchWritingTap96()',context);assert.deepEqual(calls,expected?[expected]:[]);
 }
});
test('signature scroll advances camera without wrapping the body columns',()=>{
 const context={signatureReturn110:{},signaturePlacement110:{charSize:.1},H:600,S:600,camera:{x:.5,y:1},$:(id)=>({value:id==='autoScroll'?'on':'20'}),boundTarget:p=>p};
 vm.runInNewContext(fn('nextPaperTarget','function boundTarget')+';this.result=nextPaperTarget({x:.6,y:1.95})',context);
 assert.equal(context.result.wrap,false);assert.equal(context.result.camera.x,.5);assert.ok(context.result.camera.y>1);
});
test('saving twice retains the original ID and complete ink draft',async()=>{
 const saved=[],ctx={currentWork109:null,editSession:null,window:{},Date,Math,document:{createElement:()=>({getContext:()=>({drawImage(){}}),toBlob:cb=>cb(new Blob(['thumbnail']))}),dispatchEvent(){}},CustomEvent:class {},DraftStore:{saveWork:async work=>saved.push(work)},snapshot:()=>({flow:{strokes:[{points:[{x:1,y:1}]}]}}),WorkMeta84:{format:(name,title)=>name+' 写 '+title},persist(){},$:()=>({textContent:'',hidden:false}),toast(){},Blob};
 vm.runInNewContext('async '+fn('archiveWork','function clearWorkURLs')+';this.save=archiveWork',ctx);
 await ctx.save({width:3000,height:4000},new Blob(['image-1']));await ctx.save({width:3000,height:4000},new Blob(['image-2']));assert.equal(saved[0].id,saved[1].id);assert.equal(saved[1].draft.flow.strokes.length,1);
});
test('generation opens image save dialog without starting a blank page',()=>{
 const body=source.slice(source.indexOf('async function generateDownload'),source.indexOf('function showDownloadOptions'));
 assert.ok(body.includes("openDialog('imageDialog')"));assert.ok(!body.includes('startSeriesPage119'));
});
test('selection bounds use rendered ink rather than brush padding',()=>assert.ok(source.includes('bounds:visibleInkBounds108,view:paperScreen')));
test('3:4 export renders 3000 by 4000 and long sheets respect the canvas budget',()=>{
 for(const bounds of [{w:3,h:4},{w:4,h:80}]){
  const ctx={sheetBounds:()=>bounds,exportPrefs:{mount:false},gridMetrics:()=>({dx:1,dy:1}),Math};
  vm.runInNewContext(fn('exportMaxSide','let exportBlob')+';this.side=exportMaxSide()',ctx);
  const scale=ctx.side/Math.max(bounds.w,bounds.h);assert.ok(bounds.w*bounds.h*scale*scale<=16000000);assert.ok(ctx.side<=16384);
  if(bounds.h===4)assert.equal(ctx.side,4000);
 }
});
