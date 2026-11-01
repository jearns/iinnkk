import {trackedCamera308} from './tracking308.mjs';
export const TRANSITIONS=[{id:'push',label:'慢速拉近 · Zoom in'}];
export const ZOOM_LEVELS307=[{id:'near',label:'近',scale:1.25},{id:'closer',label:'更近',scale:1.6},{id:'closeup',label:'特写近',scale:2.05}];
export const clamp=n=>Math.max(0,Math.min(1,n));
export const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
const full=()=>({x:.5,y:.5,w:1,h:1});
export function scenePlan(duration,fps,chapters=[],tracking308=null,outAspect=9/16){
 const intro=1+2*fps,outro=duration-2*fps,body=outro-intro,hero=Math.min(Math.round(2.8*fps),Math.floor(body*.28)),hold=Math.min(Math.round(2.2*fps),Math.floor(body*.17));
 const writingStart=intro+hero,writingEnd=outro-hold;
 // Replay and camera share weighted page timing and the same paper geometry.
 const scenes=[{id:0,kind:'hero',from:intro,to:writingStart,start:1,end:1,region:full(),scale:1},{id:1,kind:'writing',from:writingStart,to:writingEnd,start:0,end:1,region:full(),scale:1},{id:2,kind:'full',from:writingEnd,to:outro,start:1,end:1,region:full(),scale:1}];
 return{scenes,intro,outro,writingStart,writingEnd,maxScale:2.05,tracking308,outAspect};
}
export function sceneFrame(frame,plan,fps,mode='push',zoomLevel307='closeup'){
 const scene=plan.scenes.find(s=>frame>=s.from&&frame<s.to)||plan.scenes.at(-1);
 const progress=clamp((frame-plan.writingStart)/Math.max(1,plan.writingEnd-plan.writingStart-1));
 const target=(ZOOM_LEVELS307.find(x=>x.id===zoomLevel307)||ZOOM_LEVELS307[2]).scale;
 // Pure frame calculations give previews, seeking and exports identical camera paths.
 const camera=plan.tracking308?trackedCamera308(plan.tracking308,progress,(plan.writingEnd-plan.writingStart-1)/fps,target,plan.outAspect):{scale:1+(target-1)*ease(progress),focus:full(),shade:0};
 const hold=ease((frame-plan.writingEnd)/Math.max(1,plan.outro-plan.writingEnd-1));
 const scale=scene.kind==='hero'?1:scene.kind==='full'?1+(camera.scale-1)*(1-hold):camera.scale;
 const region=scene.kind==='hero'?full():{...full(),x:camera.focus.x+( .5-camera.focus.x)*hold,y:camera.focus.y+(.5-camera.focus.y)*hold};
 return{scene:{...scene,region,scale},previous:null,progress:scene.kind==='writing'?progress:1,t:progress,mode:'push',factor:1,shade:scene.kind==='writing'?camera.shade:0,blend:0,point308:camera.point};
}
