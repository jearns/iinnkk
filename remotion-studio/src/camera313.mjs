import{buildCamera312}from'./camera312.mjs';
import{blendPose311,travel311}from'./camera311.mjs';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wide={scale:1,focus:{x:.5,y:.5}},EPS=1e-10;
export function buildCamera313(track,count,fps,outAspect,mode='combo'){
 const n=Math.max(1,count),budget=Math.floor(n*.16),base=buildCamera312(track,Math.max(1,n-budget),fps,outAspect,mode,{steady313:.35,wide313:1.12,alternatePages313:true,pullAfter313:true,freeZoom314:true});
 const columns=base.columns312||[];if(!columns.length){let c=null,boundary=null;for(const s of base.segments){if(s.kind!=='draw'){boundary=s.kind;continue}if(!c||c.page!==s.r.page||boundary==='column'){c={id:columns.length,page:s.r.page,ordinal:c?.page===s.r.page?c.ordinal+1:0,from:s.from,to:s.to,lastFrom:s.from,close:mode==='track'&&s.r.ink!==false};columns.push(c)}c.to=s.to;c.lastFrom=s.from;boundary=null}}
 const timeline=base.segments.at(-1)?.to||base.count,publicFrame=f=>clamp(Math.round(f*(base.count-1)/Math.max(1,timeline-1)),0,base.count-1),regionColumns=new Map;
 for(const s of base.segments)if(s.kind==='draw')regionColumns.set(s.index,columns.find(c=>s.from>=c.from&&s.from<c.to));
 const events=columns.filter((c,i)=>c.close||columns[i+1]?.page!==c.page).map(c=>({...c,after:publicFrame(c.to-1),pageEnd:columns[c.id+1]?.page!==c.page}));
 const pieces=[];let cursor=0,source=0,previous=null;
 for(let i=0;i<events.length;i++){const e=events[i],end=Math.max(source,e.after+1);if(end>source){pieces.push({from:cursor,to:cursor+end-source,source,kind:'draw',previous});cursor+=end-source;source=end}
  const length=Math.round((i+1)*budget/events.length)-Math.round(i*budget/events.length),pull=Math.min(Math.round(fps*.9),Math.floor(length*.4));
  if(pull){pieces.push({from:cursor,to:cursor+pull,kind:'pull',e});cursor+=pull}
  if(length>pull){pieces.push({from:cursor,to:cursor+length-pull,kind:'hold',e});cursor+=length-pull}previous=e;
 }
 if(source<base.count){pieces.push({from:cursor,to:cursor+base.count-source,source,kind:'draw',previous});cursor+=base.count-source}
 const output=f=>n>1?f*(cursor-1)/(n-1):0;
 function originalPose(f){const v=base.at(f);if(mode!=='track')return v;const c=regionColumns.get(v.region311);if(!c)return v;if(v.phase311==='column'||v.phase311==='page')return{...v,...wide,shade:v.phase311==='page'?v.shade:0,cut:v.phase311==='page'?'page':null};const start=publicFrame(c.from),length=Math.max(1,publicFrame(c.to-1)-start),amount=travel311((f-start)/Math.max(1,Math.min(fps*1.6,length*.22)));return{...v,...blendPose311(wide,v,amount,v.point.aspect),column312:c.ordinal,shot312:'tracking'}}
 function at(index){const f=output(clamp(Math.round(index),0,n-1));let lo=0,hi=pieces.length-1;while(lo<hi){const m=(lo+hi)>>1;if(f>=pieces[m].to)lo=m+1;else hi=m}const s=pieces[lo];
  if(s.kind==='draw'){const v=originalPose(s.source+f-s.from);return{...v,showSeals313:false,overviewHold313:false}}
  const e=s.e,prior=originalPose(e.after),progress=e.pageEnd?Math.min(1,track.pages[e.page].end-EPS):prior.progress311,t=travel311((f-s.from)/Math.max(1,s.to-s.from-1)),pose=s.kind==='pull'?blendPose311(prior,wide,t,prior.point.aspect):wide;
  return{...prior,...pose,progress311:progress,point:track.sample(progress),drawing311:false,phase311:s.kind,shot312:'overview',shade:0,cut:null,completePage311:e.pageEnd,overviewHold313:s.kind==='hold',showSeals313:s.kind==='hold'&&e.pageEnd,column312:e.ordinal};
 }
 const mapCut=f=>{for(const s of pieces)if(s.kind==='draw'&&f>=s.source&&f<s.source+s.to-s.from)return Math.round((s.from+f-s.source)*(n-1)/Math.max(1,cursor-1));return 0};
 return{...base,at,count:n,columns312:columns,holds313:pieces.filter(p=>p.kind==='hold'),pieces313:pieces,cuts:base.cuts.map(c=>({...c,frame:mapCut(c.frame)})),bytes:base.bytes+pieces.length*96};
}
