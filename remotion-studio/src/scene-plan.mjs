// Zoom-in kernel restored from release 300 (b602c664). Camera never samples the live pen.
export const TRANSITIONS=[{id:'push',label:'平稳推近 · Zoom in'}];
export const CLOSEUP309=2.05;
export const clamp=n=>Math.max(0,Math.min(1,n));
export const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
function region(chapters,start,end){const list=chapters.filter(c=>c.end>start&&c.start<end);if(!list.length)return{x:.5,y:.5,w:1,h:1};let x=1,y=1,r=0,b=0;for(const c of list){x=Math.min(x,c.x-c.w/2);y=Math.min(y,c.y-c.h/2);r=Math.max(r,c.x+c.w/2);b=Math.max(b,c.y+c.h/2)}return{x:clamp((x+r)/2),y:clamp((y+b)/2),w:Math.max(.03,r-x),h:Math.max(.03,b-y)}}

const full=()=>({x:.5,y:.5,w:1,h:1});
export function scenePlan(duration,fps,chapters=[],timing=null){
 const intro=1+2*fps,outro=duration-2*fps,body=outro-intro;
 const hero=Math.min(Math.round(2.8*fps),Math.floor(body*.28)),hold=Math.min(Math.round(2.2*fps),Math.floor(body*.17));
 const writingStart=intro+hero,writingEnd=outro-hold,writing=writingEnd-writingStart;
 // Merge pairs of 300's 3.6-second shots, halving internal black transitions.
 const legacyCount=Math.max(1,Math.min(32,Math.ceil(writing/(3.6*fps)))),count=Math.ceil(legacyCount/2);
 const cuts=Array.from({length:count+1},(_,i)=>i/count),pages=timing?.pages||[];
 for(const p of pages)if(p.start>0&&p.start<1)cuts.push(p.start);
 const boundaries=cuts.sort((a,b)=>a-b).filter((p,i,a)=>!i||p-a[i-1]>1e-9),frames=boundaries.map(p=>writingStart+Math.ceil(p*(writing-1)));
 frames[frames.length-1]=writingEnd;
 const scenes=[{id:0,kind:'hero',from:intro,to:writingStart,start:1,end:1,region:full(),scale:1,fadeOut309:true}];
 for(let i=0;i<boundaries.length-1;i++){
  if(frames[i+1]<=frames[i])continue;
  const start=boundaries[i],end=boundaries[i+1],atPageStart=pages.some(p=>Math.abs(p.start-start)<1e-9&&p.index>0),atPageEnd=pages.some(p=>Math.abs(p.start-end)<1e-9&&p.index>0);
  const page=pages.find(p=>start>=p.start-1e-9&&start<p.end-1e-9),own=page?chapters.filter(c=>c.page309===undefined||c.page309===page.index):chapters;
  const box=region(own,start,end),scale=CLOSEUP309/1.06;
  scenes.push({id:scenes.length,kind:'writing',from:frames[i],to:frames[i+1],start,end,region:box,scale,fadeIn309:!atPageStart,fadeOut309:!atPageEnd});
 }
 scenes.push({id:scenes.length,kind:'full',from:writingEnd,to:outro,start:1,end:1,region:full(),scale:1,fadeIn309:true});
 return{scenes,intro,outro,writingStart,writingEnd,legacyCount,shotCount309:count};
}
export function sceneFrame(frame,plan,fps){
 const scene=plan.scenes.find(s=>frame>=s.from&&frame<s.to)||plan.scenes.at(-1);
 const t=clamp((frame-scene.from)/Math.max(1,scene.to-scene.from-1));
 // 300's fixed shot region and six-percent eased push. No live tracking or zoom corrections.
 const factor=scene.kind==='writing'?1+.06*ease(t):1;
 const blend=Math.min(.4*fps,(scene.to-scene.from)*.18);
 const shadeIn=scene.fadeIn309?1-ease((frame-scene.from)/Math.max(1,blend)):0;
 const shadeOut=scene.fadeOut309?1-ease((scene.to-frame)/Math.max(1,blend)):0;
 const progress=scene.kind==='writing'?clamp((frame-plan.writingStart)/Math.max(1,plan.writingEnd-plan.writingStart-1)):1;
 return{scene,previous:null,progress,t,mode:'push',factor,shade:Math.max(shadeIn,shadeOut),blend:0};
}
