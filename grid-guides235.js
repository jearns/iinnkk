/* Cell guides belong to the paper layout; occupied cells derive from actual strokes. */
(function(root){
function cell(point,a,rows,cols){const col=Math.floor((point.x-a.x)/(a.w/cols)),row=Math.floor((point.y-a.y)/(a.h/rows));return col>=0&&row>=0&&col<cols&&row<rows?row*cols+col:-1}
function occupied(strokes,a,rows,cols){const set=new Set();for(const stroke of strokes||[])for(const p of stroke.points||[]){const g=stroke.geometry||{},k=g.k??1,r=g.r||0,x=p.x*k,y=p.y*k;const n=cell({x:x*Math.cos(r)-y*Math.sin(r)+(g.x||0),y:x*Math.sin(r)+y*Math.cos(r)+(g.y||0)},a,rows,cols);if(n>=0)set.add(n)}return set}
function index(row,col,rows,cols,order){return order==='horizontalReverse'?row*cols+cols-1-col:order==='vertical'?(cols-1-col)*rows+row:row*cols+col}
function draw(ctx,a,layout,strokes){if(!layout?.text235)return;const rows=layout.rows,cols=layout.cols||layout.columns,used=occupied(strokes,a,rows,cols),chars=[...layout.text235],dx=a.w/cols,dy=a.h/rows;ctx.save();ctx.fillStyle='#73523c';ctx.globalAlpha=.14;ctx.font=Math.min(dx,dy)*.96+'px AnnotationHand,ZhenjiKai,"Kaiti SC",serif';ctx.textAlign='center';ctx.textBaseline='middle';for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){if(used.has(r*cols+c))continue;const text=chars[index(r,c,rows,cols,layout.reverseHorizontal?'horizontalReverse':layout.textOrder235||layout.orientation)];if(text)ctx.fillText(text,a.x+(c+.5)*dx,a.y+(r+.52)*dy,dx*.96)}ctx.restore()}
root.GridGuides235={cell,occupied,index,draw};
})(typeof window==='undefined'?globalThis:window);
