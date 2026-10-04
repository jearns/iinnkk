import test from 'node:test';import assert from 'node:assert/strict';
import {expandPaper} from '../experiments/paper119.mjs';import {InkViewportIndex} from '../experiments/ink-index119.mjs';
test('four directions preserve ink samples, pen size, scale and locked dimension',()=>{
 const original={values:{ratio:1,paperExtent:'fixed'},flow:{strokes:[{points:[{x:1,y:2}],settings:{size:35},geometry:{x:.2,y:.3,k:.7,r:0}}]},signatureStrokes:[],sealPositions:{tail:{x:.7,y:.8}},extraSeals:[],photos:[],camera:{x:1,y:1}};
 for(const edge of ['left','right','top','bottom']){const result=expandPaper(original,edge,2),stroke=result.flow.strokes[0];assert.equal(result.infiniteExtent.w,edge==='left'||edge==='right'?6:4);assert.equal(result.infiniteExtent.h,edge==='top'||edge==='bottom'?6:4);assert.equal(stroke.geometry.k,.7);assert.equal(stroke.settings.size,35);assert.strictEqual(stroke.points,original.flow.strokes[0].points);assert.equal(stroke.geometry.x,.2+(edge==='left'?2:0));assert.equal(stroke.geometry.y,.3+(edge==='top'?2:0));assert.equal(result.sealPositions.tail.x*result.infiniteExtent.w,2.8+(edge==='left'?2:0));assert.equal(original.values.paperExtent,'fixed')}
});
test('ten thousand strokes: viewport selection matches a full scan after an edit',()=>{
 const strokes=Array.from({length:10000},(_,i)=>({box:{x:(i%40)*.12,y:Math.floor(i/40)*.3,w:.08,h:.16}})),index=new InkViewportIndex(st=>st.box);
 index.setStrokes(strokes);
 for(const rect of [{x:0,y:0,w:1,h:1},{x:1,y:24,w:2,h:3},{x:2,y:69,w:1,h:2}]){
  const expected=strokes.filter(st=>{const b=st.box;return b.x+b.w>=rect.x&&b.x<=rect.x+rect.w&&b.y+b.h>=rect.y&&b.y<=rect.y+rect.h});assert.deepEqual(index.visible(rect),expected);
 }
 const revised=strokes.slice();revised[5000]={box:{x:1,y:24,w:.1,h:.1}};index.setStrokes(revised);assert(index.visible({x:1,y:24,w:.5,h:.5}).includes(revised[5000]));
});
