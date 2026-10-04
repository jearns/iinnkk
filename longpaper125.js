/* Right-anchored width extension: keep written glyphs at the same scale and
   expose an empty column at the left, in natural vertical writing order. */
(function(root){
 function extend({strokes,width,height,columns,extraColumns=1}){
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)throw Error('纸张尺寸无效');
  const count=Math.max(1,Math.min(100,Math.floor(extraColumns))),cols=Math.max(1,Math.floor(columns));
  const delta=(width-.48)/cols*count;
  const shifted=strokes.map(st=>{const g=st.geometry||{x:0,y:0,k:1,r:0};return {...st,geometry:{...g,x:g.x+delta}}});
  return {strokes:shifted,width:width+delta,height,columns:cols+count,delta};
 }
 root.LongPaper125={extend};
})(typeof globalThis!=='undefined'?globalThis:this);
