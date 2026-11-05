// Column-level editorial camera. The 311 line tracker remains unchanged.
import {buildCamera311,blendPose311,travel311} from './camera311.mjs';
const clamp=n=>Math.max(0,Math.min(1,n));
const wide={scale:1,focus:{x:.5,y:.5}};
function pageZoom312(track,index,maximum=1.06){const rows=(track.regions311||[]).filter(r=>r.page===index&&r.ink!==false);let distance=.001;for(const r of rows)for(const v of[r.box.x,r.box.r,r.box.y,r.box.b])distance=Math.max(distance,Math.abs(v-.5));return Math.max(1,Math.min(maximum,.49/distance))}
export function buildCamera312(track,count,fps,outAspect,mode='combo',options313={}){
 if(mode==='track')return buildCamera311(track,count,fps,outAspect,'track',options313);
 const base=buildCamera311(track,count,fps,outAspect,mode==='fixed'?'fixed':'track',options313),limits=track.pages.map((p,i)=>options313.freeZoom314?(options313.wide313||1.12):pageZoom312(track,i,options313.wide313||1.06));
 if(mode==='fixed')return{...base,at(index){const v=base.at(index),p=track.pages[v.point.page],t=clamp((v.progress311-p.start)/(p.end-p.start||1));return{...v,scale:1+(limits[v.point.page]-1)*travel311(t),focus:{x:.5,y:.5},shot312:'single',column312:0}}};
 const columns=[],regionColumns=new Map();let current=null,boundary=null;
 for(const s of base.segments){if(s.kind!=='draw'){boundary=s.kind;continue}if(!current||current.page!==s.r.page||boundary==='column'){const ordinal=current?.page===s.r.page?current.ordinal+1:0;current={id:columns.length,page:s.r.page,ordinal,from:s.from,to:s.to,lastFrom:s.from,close:(options313.alternatePages313?columns.length:ordinal)%2===0&&s.r.ink!==false};columns.push(current)}current.to=s.to;current.lastFrom=s.from;regionColumns.set(s.index,current);boundary=null}
 const timeline=base.segments.at(-1)?.to||base.count;
 const frameAt=index=>base.count>1?Math.max(0,Math.min(base.count-1,Math.round(index)))*(timeline-1)/(base.count-1):0;
 function at(index){const v=base.at(index),c=regionColumns.get(v.region311);if(!c)return v;const f=frameAt(index),length=Math.max(1,c.to-c.from-1),outStart=Math.max(c.lastFrom,c.from+length*.65),out=1-travel311((f-outStart)/Math.max(1,c.to-1-outStart));
  // Both columns meet at the same full-page pose. There is no physical sweep
  // across a column jump and no shade pulse until the page actually changes.
  if(v.phase311==='column'||v.phase311==='page')return{...v,...wide,shade:v.phase311==='page'?v.shade:0,cut:v.phase311==='page'?'page':null,column312:c.ordinal,shot312:'overview'};
  const aspect=v.point.aspect;
  if(!c.close){const t=clamp((f-c.from)/length),scale=1+(limits[c.page]-1)*travel311(t)*out;return{...v,scale,focus:{x:.5,y:.5},shade:0,cut:null,column312:c.ordinal,shot312:'single'}}
  const ramp=Math.max(1,Math.min(fps*2.5,length*.24,outStart-c.from)),amount=Math.min(travel311((f-c.from)/ramp),options313.pullAfter313?1:out),pose=blendPose311(wide,v,amount,aspect);
  return{...v,...pose,shade:0,cut:null,column312:c.ordinal,shot312:amount===0?'overview':'tracking'};
 }
 return{...base,at,columns312:columns,cuts:base.cuts.filter(c=>c.kind==='page'),bytes:base.bytes+columns.length*80};
}
