import {cameraTransform308} from './tracking308.mjs';
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const ease=t=>{t=clamp(t);return t*t*(3-2*t)};
export const MAX_ZOOM310=5;
// Work in the exact fitted image space used by the canvas painter. Each interval
// contains every camera center that keeps the current pen inside the viewport.
function axisRange(point,size,viewport){
 const low=size>viewport?viewport-size:(viewport-size)/2,high=size>viewport?0:low;
 const margin=Math.max(0,Math.min(viewport*.1,point*size*.5,(1-point)*size*.5));
 const a=Math.max(low,margin-point*size),b=Math.min(high,viewport-margin-point*size);
 return[(viewport/2-b)/size,(viewport/2-a)/size];
}
export function safeFocus310(point,scale,outAspect,desired){
 const fit=Math.min(outAspect/point.aspect,1),w=point.aspect*fit*scale,h=fit*scale;
 const x=axisRange(point.x,w,outAspect),y=axisRange(point.y,h,1);
 return{x:clamp(desired.x,x[0],x[1]),y:clamp(desired.y,y[0],y[1])};
}
function smooth(values,start,end,radius){
 const out=new Float64Array(end-start);for(let i=start;i<end;i++){let total=0,sum=0;for(let d=-radius;d<=radius;d++){const w=radius+1-Math.abs(d);sum+=values[clamp(i+d,start,end-1)]*w;total+=w}out[i-start]=sum/total}return out;
}
export function buildCamera310(track,count,fps,outAspect){
 const n=Math.max(1,count),den=Math.max(1,n-1),px=new Float64Array(n),py=new Float64Array(n),aspects=new Float64Array(n),pages=new Int32Array(n),strokes=new Int32Array(n),scale=new Float64Array(n),fx=new Float64Array(n),fy=new Float64Array(n);
 for(let i=0;i<n;i++){const p=track.sample(i/den);px[i]=p.x;py[i]=p.y;aspects[i]=p.aspect;pages[i]=p.page;strokes[i]=p.stroke310||0}
 // A discontinuity is a shot cut, never a high-speed camera sweep. Include page
 // boundaries even when an imported page is blank or has no stroke records.
 const events=new Map();for(let i=1;i<n;i++)if(pages[i]!==pages[i-1])events.set(i,'page');
 for(const e of track.jumps310||track.transitions||[]){if(e.page)continue;const before=e.beforePaper||e.before,after=e.afterPaper||e.after,dx=Math.abs(after.x-before.x),dy=Math.abs(after.y-before.y),reset=before.y-after.y>.28&&dx>.025||dx>.38&&dy>.025||Math.hypot(dx,dy)>.42;if(!reset)continue;let frame=Math.ceil(e.p*den);if(e.pageIndex!==undefined){let lo=0,hi=n;while(lo<hi){const m=(lo+hi)>>1;if(pages[m]<e.pageIndex||pages[m]===e.pageIndex&&strokes[m]<e.strokeIndex)lo=m+1;else hi=m}frame=lo}if(frame>0&&frame<n&&!events.has(frame))events.set(frame,'column')}

 const cuts=[...events].filter(([f])=>f>0&&f<n).sort((a,b)=>a[0]-b[0]).map(([frame,kind])=>({frame,kind}));
 const bounds=[0,...cuts.map(c=>c.frame),n],pageStarts=new Map(),pageEnds=new Map();for(let i=0;i<n;i++){if(!pageStarts.has(pages[i]))pageStarts.set(pages[i],i);pageEnds.set(pages[i],i+1)}
 const radius=Math.max(1,Math.round(fps*.18)),zoomStep=.9/fps;
 for(let s=0;s<bounds.length-1;s++){
  const start=bounds[s],end=bounds[s+1];if(end<=start)continue;
  for(let i=start;i<end;i++){
   let minX=px[i],maxX=px[i],minY=py[i],maxY=py[i];for(let j=Math.max(start,i-radius);j<=Math.min(end-1,i+radius);j++){minX=Math.min(minX,px[j]);maxX=Math.max(maxX,px[j]);minY=Math.min(minY,py[j]);maxY=Math.max(maxY,py[j])}
   const fit=Math.min(outAspect/aspects[i],1),limit=Math.min(5,outAspect/(fit*aspects[i]*(maxX-minX+.035)),1/(fit*(maxY-minY+.035)));
   const pageStart=pageStarts.get(pages[i]),ramp=Math.max(1,Math.min(6*fps,(pageEnds.get(pages[i])-pageStart-1)*.55));
   const ink=track.pages?.[pages[i]]?.strokeCount!==0;
   scale[i]=ink?Math.max(1,Math.min(limit,1+4*ease((i-pageStart)/ramp))):1;
  }
  // Plan slow zoom changes in both time directions so a later fast stroke cannot
  // cause an abrupt emergency zoom-out. Smooth once, never replan during playback.
  for(let i=start+1;i<end;i++)scale[i]=Math.min(scale[i],scale[i-1]+zoomStep);
  for(let i=end-2;i>=start;i--)scale[i]=Math.min(scale[i],scale[i+1]+zoomStep);
  const z=smooth(scale,start,end,Math.max(1,Math.round(fps*.14))),x=smooth(px,start,end,radius),y=smooth(py,start,end,radius);
  for(let i=start;i<end;i++){scale[i]=clamp(z[i-start],1,5);if(i===pageStarts.get(pages[i]))scale[i]=1;const p={x:px[i],y:py[i],aspect:aspects[i]},focus=safeFocus310(p,scale[i],outAspect,{x:x[i-start],y:y[i-start]});fx[i]=focus.x;fy[i]=focus.y}
  // Relax residual point noise with viewport constraints, without crossing cuts.
  for(let pass=0;pass<8;pass++)for(let k=0;k<end-start;k++){const i=pass%2?end-1-k:start+k,left=Math.max(start,i-1),right=Math.min(end-1,i+1),p={x:px[i],y:py[i],aspect:aspects[i]},focus=safeFocus310(p,scale[i],outAspect,{x:(2*x[i-start]+fx[left]+fx[right])/4,y:(2*y[i-start]+fy[left]+fy[right])/4});fx[i]=focus.x;fy[i]=focus.y}
 }
 for(let i=0;i<cuts.length;i++){const c=cuts[i],before=i?cuts[i-1].frame:0,after=i+1<cuts.length?cuts[i+1].frame:n-1;c.fade=Math.max(1,Math.min(Math.round(fps*.3),Math.floor((c.frame-before)*.22),Math.floor((after-c.frame)*.22)))}
 function at(index){const i=clamp(Math.round(index),0,n-1);let lo=0,hi=cuts.length;while(lo<hi){const m=(lo+hi)>>1;if(cuts[m].frame<i)lo=m+1;else hi=m}let shade=0,cut=null;for(const j of[lo-1,lo]){const c=cuts[j];if(!c)continue;const d=Math.abs(i-c.frame);if(d<=c.fade){shade=Math.max(shade,1-ease(d/c.fade));cut=c.kind}}
  return{scale:scale[i],focus:{x:fx[i],y:fy[i]},shade,cut,point:{x:px[i],y:py[i],page:pages[i],aspect:aspects[i]}};
 }
 return{at,cuts,count:n,bytes:px.byteLength+py.byteLength+aspects.byteLength+pages.byteLength+strokes.byteLength+scale.byteLength+fx.byteLength+fy.byteLength};
}
export function screenPoint310(point,scale,focus,outAspect){const m=cameraTransform308(point.aspect,1,outAspect,1,scale,focus);return{x:(m.x+point.x*m.width)/outAspect,y:m.y+point.y*m.height}}
