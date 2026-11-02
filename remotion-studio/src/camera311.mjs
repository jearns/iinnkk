// Deterministic spatial shots. The pen animates independently of the paper;
// no point-by-point correction, accumulated spring, or playback-history state.
import {paperTransform311} from './matte311.mjs';
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
// Almost linear travel, with a small acceleration/deceleration shoulder.
export function travel311(t){t=clamp(t);const a=.12,k=1/(1-a);return t<a?k*t*t/(2*a):t>1-a?1-k*(1-t)*(1-t)/(2*a):k*(t-a/2)}
const union=(a,b)=>({x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),r:Math.max(a.r,b.r),b:Math.max(a.b,b.b)});
const epsilon=1e-10;
export function blendPose311(a,b,t,aspect){const x=paperTransform311(aspect,1,aspect,1,a.scale,a.focus),y=paperTransform311(aspect,1,aspect,1,b.scale,b.focus),scale=a.scale+(b.scale-a.scale)*t,width=x.width+(y.width-x.width)*t,height=x.height+(y.height-x.height)*t,left=x.x+(y.x-x.x)*t,top=x.y+(y.y-x.y)*t;return{scale,focus:{x:(aspect/2-left)/width,y:(.5-top)/height}}}
function regionPose(r,aspect,fixed){if(fixed||r.ink===false)return{scale:1,focus:{x:.5,y:.5}};const b=r.box,focus={x:(b.x+b.r)/2,y:(b.y+b.b)/2};const safe=z=>{const m=paperTransform311(aspect,1,aspect,1,z,focus);return b.x*m.width+m.x>=aspect*.025&&b.r*m.width+m.x<=aspect*.975&&b.y*m.height+m.y>=.025&&b.b*m.height+m.y<=.975};let lo=1,hi=5;for(let i=0;i<24;i++){const m=(lo+hi)/2;if(safe(m))lo=m;else hi=m}return{scale:lo,focus}}
export function buildCamera311(track,count,fps,outAspect,mode='track'){
 const n=Math.max(1,count),fixed=mode==='fixed';let regions=(track.regions311?.length?track.regions311:track.pages.map(p=>({...p,page:p.index,box:{x:0,y:0,r:1,b:1},ink:false}))).map(r=>({...r}));
 if(fixed)regions=track.pages.map(p=>({...p,page:p.index,box:{x:0,y:0,r:1,b:1},ink:false}));
 // A short edit still visits every page. Coalesce local regions rather than
 // spending its entire duration in transitions.
 const maxRegions=Math.max(track.pages.length,Math.floor(n/5));
 while(regions.length>maxRegions){const next=[];let changed=false;for(let i=0;i<regions.length;i++){const a=regions[i],b=regions[i+1];if(b&&a.page===b.page&&regions.length-next.length>maxRegions){next.push({...a,end:b.end,box:union(a.box,b.box),paperBox:union(a.paperBox||a.box,b.paperBox||b.box)});i++;changed=true}else next.push(a)}regions=next;if(!changed)break}
 for(const r of regions){r.pose=regionPose(r,track.pages[r.page].aspect,fixed);r.first=r.pose;r.last=r.pose;if(!fixed&&r.ink!==false){const z=r.pose.scale,b=r.box,p=track.sample(Math.min(r.end,r.start+epsilon)),q=track.sample(Math.max(r.start,r.end-epsilon)),anchor=point=>({scale:z,focus:{x:clamp(point.x,b.r+.025/z-.5/z,b.x-.025/z+.5/z),y:clamp(point.y,b.b+.025/z-.5/z,b.y-.025/z+.5/z)}});r.first=anchor(p);r.last=anchor(q)}}
 const boundary=(a,b)=>{if(a.page!==b.page)return'page';const x=a.paperBox||a.box,y=b.paperBox||b.box,vertical=a.direction!=='horizontal';const major=vertical?(x.y+x.b-y.y-y.b)/2:(x.x+x.r-y.x-y.r)/2,minor=vertical?Math.abs((x.x+x.r-y.x-y.r)/2):Math.abs((x.y+x.b-y.y-y.b)/2);return major>Math.max(x.b-x.y,x.r-x.x)*.5&&minor>Math.max(x.r-x.x,x.b-x.y)*.3?'column':'move'};
 const moveCount=Math.max(0,regions.length-1),moveFrames=moveCount?Math.max(1,Math.min(Math.round(fps*.42),Math.floor(n*.22/moveCount))):0,drawBudget=Math.max(regions.length,n-moveCount*moveFrames),segments=[],cuts=[];let cursor=0,allocated=0;
 for(let i=0;i<regions.length;i++){const r=regions[i],extra=Math.max(0,drawBudget-regions.length),length=1+Math.round(r.end*extra)-Math.round(r.start*extra);allocated+=length;segments.push({from:cursor,to:cursor+length,kind:'draw',r,index:i});cursor+=length;if(i<regions.length-1){const next=regions[i+1],kind=boundary(r,next),s={from:cursor,to:cursor+moveFrames,kind,r,next,index:i};segments.push(s);if(kind!=='move')cuts.push({frame:cursor+Math.floor(moveFrames/2),kind,fade:Math.max(1,Math.ceil(moveFrames/2))});cursor+=moveFrames}}
 // Proportional rounding can add a few frames for extremely dense imports.
 // Map the public frame interval onto the finite shot timeline.
 function at(index){const frame=clamp(Math.round(index),0,n-1),f=n>1?frame*(cursor-1)/(n-1):0;let lo=0,hi=segments.length-1;while(lo<hi){const m=(lo+hi)>>1;if(f>=segments[m].to)lo=m+1;else hi=m}const s=segments[lo],aspect=track.pages[s.r.page].aspect;let pose=s.r.last,progress,shade=0,completePage311=false,cut=null,drawing311=s.kind==='draw';
  if(drawing311){const t=clamp((f-s.from)/Math.max(1,s.to-s.from-1));pose=blendPose311(s.r.first,s.r.last,travel311(t),aspect);progress=s.r.start+(s.r.end-s.r.start)*t;if(s.r.start>0)progress=Math.max(progress,s.r.start+epsilon);if(s.r.end<1)progress=Math.min(progress,s.r.end-epsilon)}else{const t=s.to-s.from<=1?1:clamp((f-s.from)/Math.max(1,s.to-s.from-1));cut=s.kind==='move'?null:s.kind;if(s.kind==='move'){pose=blendPose311(pose,s.next.first,travel311(t),aspect);progress=s.r.end}else{const after=t>=.5;pose=after?s.next.first:pose;progress=after?s.next.start:s.r.end-epsilon;completePage311=s.kind==='page'&&!after;shade=1-Math.abs(2*t-1);if(Math.abs(f-(s.from+Math.floor((s.to-s.from)/2)))<1.01)shade=1}}
  if(frame===n-1)progress=1;const point=track.sample(progress);return{...pose,progress311:clamp(progress),shade,cut,point,drawing311,completePage311,region311:s.index,phase311:s.kind};
 }
 return{at,cuts,count:n,regions,segments,bytes:regions.length*200+segments.length*80};
}
