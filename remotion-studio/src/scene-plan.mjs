export const TRANSITIONS=[{id:'shadow',label:'阴影渐变'},{id:'push',label:'平稳推近 · Zoom in'},{id:'pull',label:'平稳拉远 · Zoom out'},{id:'dolly',label:'希区柯克式变焦'},{id:'dissolve',label:'柔和叠化'},{id:'fade',label:'黑场淡入淡出'},{id:'match',label:'匹配剪辑'},{id:'combo',label:'组合运镜'}];
export const clamp=n=>Math.max(0,Math.min(1,n));
export const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
const full=()=>({x:.5,y:.5,w:1,h:1});
function region(chapters,start,end){const list=chapters.filter(c=>c.end>start&&c.start<end);if(!list.length)return full();let x=1,y=1,r=0,b=0;for(const c of list){x=Math.min(x,c.x-c.w/2);y=Math.min(y,c.y-c.h/2);r=Math.max(r,c.x+c.w/2);b=Math.max(b,c.y+c.h/2)}return{x:clamp((x+r)/2),y:clamp((y+b)/2),w:Math.max(.03,r-x),h:Math.max(.03,b-y)}}
export function scenePlan(duration,fps,chapters=[]){
 const intro=1+2*fps,outro=duration-2*fps,body=outro-intro,hero=Math.min(Math.round(2.8*fps),Math.floor(body*.28)),hold=Math.min(Math.round(2.2*fps),Math.floor(body*.17));
 const writingStart=intro+hero,writingEnd=outro-hold,writing=writingEnd-writingStart,count=Math.max(1,Math.min(32,Math.ceil(writing/(7.5*fps)))),scenes=[];
 scenes.push({id:0,kind:'hero',from:intro,to:writingStart,start:1,end:1,region:full(),scale:1});
 for(let i=0;i<count;i++){const start=i/count,end=(i+1)/count;scenes.push({id:i+1,kind:'writing',from:writingStart+Math.round(i*writing/count),to:writingStart+Math.round((i+1)*writing/count),start,end,region:region(chapters,start,end),scale:1});}
 scenes.push({id:count+1,kind:'full',from:writingEnd,to:outro,start:1,end:1,region:full(),scale:1});
 // Overlapping broad windows keep the pen inside a generous frame; interpolation is pure and deterministic.
 const focus=Array.from({length:65},(_,i)=>({p:i/64,...region(chapters,Math.max(0,i/64-.08),Math.min(1,i/64+.08))}));
 const maxScale=1.85;return{scenes,intro,outro,writingStart,writingEnd,focus,maxScale};
}
export function sceneFrame(frame,plan,fps,mode='push'){
 const scene=plan.scenes.find(s=>frame>=s.from&&frame<s.to)||plan.scenes.at(-1),index=scene.id,t=clamp((frame-scene.from)/Math.max(1,scene.to-scene.from-1));
 const progress=clamp((frame-plan.writingStart)/Math.max(1,plan.writingEnd-plan.writingStart)),selected=mode==='mixed'?'combo':mode;
 const index302=Math.min(63,Math.floor(progress*64)),a=plan.focus[index302],b=plan.focus[index302+1],mix=ease(progress*64-index302),focus={x:a.x+(b.x-a.x)*mix,y:a.y+(b.y-a.y)*mix};
 // Camera path depends only on frame/progress; seeking and export match playback.
 const landing=ease((progress-.90)/.10),lead=ease(progress/.10),envelope=lead*(1-landing);
 let scale=1;
 if(scene.kind==='writing'){
  if(selected==='push')scale=1+.55*ease(progress/.90);
  else if(selected==='pull')scale=1+.55*(1-ease(progress));
  else if(selected==='dolly')scale=1+.45*Math.sin(Math.PI*progress);
  else if(selected==='combo'){
   const keys=[1,1.55,1.35,1.8,1.48,1.08],at=Math.min(4,Math.floor(progress*5));
   scale=keys[at]+(keys[at+1]-keys[at])*ease(progress*5-at);
  }else scale=1+.3*Math.sin(Math.PI*progress);
  // Stable start; final tenth opens gently to the full work.
  scale=1+(scale-1)*(selected==='pull'?1:lead)*(1-landing);
 }
 const follow=selected==='combo'?envelope:envelope*.65;
 const shot={...scene,region:{...full(),x:.5+(focus.x-.5)*follow,y:.5+(focus.y-.5)*follow},scale:Math.min(scale,plan.maxScale)};
 const blend=Math.min(.55*fps,(scene.to-scene.from)*.2),enter=clamp((frame-scene.from)/Math.max(1,blend));
 return{scene:shot,previous:null,progress:scene.kind==='hero'||scene.kind==='full'?1:progress,t,mode:selected,factor:1,shade:0,blend:1-ease(enter)};
}
