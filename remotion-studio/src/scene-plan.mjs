import {blendPose311,travel311} from './camera311.mjs';
import {buildCamera313} from './camera313.mjs';
export const TRANSITIONS=[{id:'push',label:'平稳推近 · Zoom in'}];
export const clamp=n=>Math.max(0,Math.min(1,n));
export const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
const full=()=>({x:.5,y:.5,w:1,h:1});
export function scenePlan(duration,fps,chapters=[],track=null,outAspect=9/16,cameraMode311='combo'){
 const intro=1+2*fps,outro=duration-2*fps,body=outro-intro,hero=Math.min(Math.round(2.8*fps),Math.floor(body*.28)),hold=Math.min(Math.round(2.2*fps),Math.floor(body*.17));
 const writingStart=intro+hero,writingEnd=outro-hold,camera310=track?.sample?buildCamera313(track,writingEnd-writingStart,fps,outAspect,cameraMode311):null;
 const scenes=[{id:0,kind:'hero',from:intro,to:writingStart,start:1,end:1,region:full(),scale:1},{id:1,kind:'writing',from:writingStart,to:writingEnd,start:0,end:1,region:full(),scale:1},{id:2,kind:'full',from:writingEnd,to:outro,start:1,end:1,region:full(),scale:1}];
 return{scenes,intro,outro,writingStart,writingEnd,camera310};
}
export function sceneFrame(frame,plan,fps){
 const scene=plan.scenes.find(s=>frame>=s.from&&frame<s.to)||plan.scenes.at(-1),progress=clamp((frame-plan.writingStart)/Math.max(1,plan.writingEnd-plan.writingStart-1));
 const pose=plan.camera310?.at(frame-plan.writingStart);
 if(scene.kind==='hero'&&pose){const first=plan.camera310.at(0),t=travel311((frame-scene.from-(scene.to-scene.from)*.3)/Math.max(1,(scene.to-scene.from)*.7-1)),p=blendPose311({scale:1,focus:{x:.5,y:.5}},first,t,first.point.aspect);return{scene:{...scene,scale:p.scale,region:{...full(),...p.focus}},previous:null,progress:1,t,mode:'push',factor:1,shade:1-ease((scene.to-frame)/Math.max(1,fps*.25)),blend:0}}
 if(scene.kind==='full'&&pose){const t=travel311((frame-plan.writingEnd)/Math.max(1,plan.outro-plan.writingEnd-1)),p=blendPose311(pose,{scale:1,focus:{x:.5,y:.5}},t,pose.point.aspect);return{scene:{...scene,scale:p.scale,region:{...full(),...p.focus}},previous:null,progress:1,t,mode:'push',factor:1,shade:0,blend:0}}
 if(scene.kind!=='writing'||!pose)return{scene,previous:null,progress:scene.kind==='writing'?progress:1,t:progress,mode:'push',factor:1,shade:0,blend:0};
 return{scene:{...scene,region:{...full(),...pose.focus},scale:pose.scale},previous:null,progress:pose.progress311,t:progress,mode:'push',factor:1,shade:Math.max(pose.shade,1-ease((frame-plan.writingStart)/Math.max(1,fps*.25))),blend:0,point310:pose.point,cut310:pose.cut,completePage311:pose.completePage311,drawing311:pose.drawing311,region311:pose.region311,phase311:pose.phase311,shot312:pose.shot312,column312:pose.column312,showSeals313:pose.showSeals313,overviewHold313:pose.overviewHold313};
}
