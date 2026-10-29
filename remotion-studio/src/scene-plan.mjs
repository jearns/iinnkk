export const TRANSITIONS=[{id:'shadow',label:'阴影渐变'},{id:'push',label:'平稳推近 · Zoom in'},{id:'pull',label:'平稳拉远 · Zoom out'},{id:'dolly',label:'希区柯克式变焦'},{id:'dissolve',label:'柔和叠化'},{id:'fade',label:'黑场淡入淡出'},{id:'match',label:'匹配剪辑'},{id:'mixed',label:'随机混编'}];
export const clamp=n=>Math.max(0,Math.min(1,n));
export const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
function region(chapters,start,end){const list=chapters.filter(c=>c.end>start&&c.start<end);if(!list.length)return{x:.5,y:.5,w:1,h:1};let x=1,y=1,r=0,b=0;for(const c of list){x=Math.min(x,c.x-c.w/2);y=Math.min(y,c.y-c.h/2);r=Math.max(r,c.x+c.w/2);b=Math.max(b,c.y+c.h/2)}return{x:clamp((x+r)/2),y:clamp((y+b)/2),w:Math.max(.03,r-x),h:Math.max(.03,b-y)}}
export function scenePlan(duration,fps,chapters=[]){
 const intro=1+2*fps,outro=duration-2*fps,body=outro-intro;
 const hero=Math.min(Math.round(2.8*fps),Math.floor(body*.28)),hold=Math.min(Math.round(2.2*fps),Math.floor(body*.17));
 const writing=body-hero-hold,count=Math.max(1,Math.min(32,Math.ceil(writing/(3.6*fps)))),scenes=[];
 scenes.push({id:0,kind:'hero',from:intro,to:intro+hero,start:1,end:1,region:{x:.5,y:.5,w:1,h:1},scale:1});
 for(let i=0;i<count;i++){const start=i/count,end=(i+1)/count,box=region(chapters,start,end);scenes.push({id:i+1,kind:'writing',from:intro+hero+Math.round(i*writing/count),to:intro+hero+Math.round((i+1)*writing/count),start,end,region:box,scale:i%5===0?1:Math.min(2.05,Math.max(1.05,.8/Math.max(box.w,box.h)))});}
 scenes.push({id:count+1,kind:'full',from:outro-hold,to:outro,start:1,end:1,region:{x:.5,y:.5,w:1,h:1},scale:1});return{scenes,intro,outro};
}
export function sceneFrame(frame,plan,fps,mode='shadow'){
 const scene=plan.scenes.find(s=>frame>=s.from&&frame<s.to)||plan.scenes.at(-1),index=scene.id;
 const t=clamp((frame-scene.from)/Math.max(1,scene.to-scene.from-1));
 const kinds=['shadow','push','pull','dolly','dissolve','fade','match'];const selected=mode==='mixed'?kinds[(Math.imul(index+17,2654435761)>>>0)%kinds.length]:mode;
 const blend=Math.min(.4*fps,(scene.to-scene.from)*.18),enter=clamp((frame-scene.from)/Math.max(1,blend));
 let factor=1;if(scene.kind==='writing'&&(selected==='push'||selected==='dolly'))factor=1+.06*ease(t);if(scene.kind==='writing'&&selected==='pull')factor=1.06-.06*ease(t);
 const distance=Math.min(frame-scene.from,scene.to-frame),shade=(selected==='dissolve'||selected==='match')?0:index===0?1-ease((scene.to-frame)/blend):1-ease(distance/blend);
 return{scene,previous:plan.scenes[index-1],progress:scene.start+(scene.end-scene.start)*t,t,mode:selected,factor,shade:clamp(shade),blend:1-ease(enter)};
}
