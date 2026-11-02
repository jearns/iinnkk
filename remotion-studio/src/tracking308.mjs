import {writingRegions311} from './framing311.mjs';
// Geometry and timing shared by replay, camera planning and export. No DOM or frame history.
export const clamp308=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const mix=(a,b,t)=>a+(b-a)*t;
const ease=t=>{t=clamp308(t);return t*t*(3-2*t)};
const legacyRects=[[170,92,298,247],[550,109,701,247],[966,88,1107,262],[139,513,285,649],[492,449,686,598],[945,511,1119,634],[137,906,279,1042],null,[948,874,1142,1023]];
export function recordPoint308(page,record,point){
 const g=record.st.geometry||{},k=g.k??1,a=g.r||0;
 const x=(point.x*k*Math.cos(a)-point.y*k*Math.sin(a)+(g.x||0))*(record.k??1)+(record.x||0);
 const y=(point.x*k*Math.sin(a)+point.y*k*Math.cos(a)+(g.y||0))*(record.k??1)+(record.y||0);
 return{x:clamp308((page.b.x+(x-page.bounds.x)*page.scale)/page.width),y:clamp308((page.b.y+(y-page.bounds.y)*page.scale)/page.height)};
}
export function sceneProjection308(page,museums=[]){
 const key=page.sceneKey,ratio=page.width/page.height;
 if(!key)return{aspect:ratio,map:p=>p};
 const fit=(p,slot,aspect)=>{const w=slot[2],h=slot[3]/aspect,scale=Math.min(w/page.width,h/page.height),iw=page.width*scale,ih=page.height*scale*aspect;return{x:slot[0]+(w-iw)/2+p.x*iw,y:slot[1]+(slot[3]-ih)/2+p.y*ih}};
 if(String(key).startsWith('museum:')){const slot=museums.find(m=>m.key===key.slice(7))?.slot;if(slot)return{aspect:4/3,map:p=>fit(p,slot,4/3)}}
 const tile=key==='grid',i=tile?0:Number(key),row=Math.floor(i/3),sx=i%3*418,sy=[0,418,816][row],rh=[418,398,438][row];
 let project;
 if(i===7){const quad=[[581,900],[678,868],[682,1045],[581,1059]].map(([x,y])=>({x:(x-sx)/418,y:(y-sy)/rh}));project=p=>{const q=fit(p,[0,0,1,1],1),left={x:mix(quad[0].x,quad[3].x,q.y),y:mix(quad[0].y,quad[3].y,q.y)},right={x:mix(quad[1].x,quad[2].x,q.y),y:mix(quad[1].y,quad[2].y,q.y)};return{x:mix(left.x,right.x,q.x),y:mix(left.y,right.y,q.x)}}}
 else if(legacyRects[i]){const r=legacyRects[i],slot=[(r[0]-sx)/418,(r[1]-sy)/rh,(r[2]-r[0])/418,(r[3]-r[1])/rh];project=p=>fit(p,slot,1)}
 if(project)return{aspect:tile?2:1,map:p=>{const q=project(p);return tile?{x:q.x/4,y:q.y/2}:q}};
 return{aspect:ratio,map:p=>p};
}
function estimatePage(page){let length=0;for(const r of page.records||[]){const pts=r.st.points||[];for(let i=1;i<pts.length;i++){const a=recordPoint308(page,r,pts[i-1]),b=recordPoint308(page,r,pts[i]);length+=Math.hypot(a.x-b.x,a.y-b.y)}}return Math.max(6,(page.records?.length||0)*.48,(page.total||0)/90,length*2.4)}
export function buildTracking308(snapshots,{museums=[]}={}){
 const estimates=snapshots.map(estimatePage),sum=estimates.reduce((a,b)=>a+b,0)||1;let cursor=0;
 const pages=snapshots.map((page,index)=>{const start=cursor;cursor+=estimates[index]/sum;return{...sceneProjection308(page,museums),index,start,end:cursor,span:cursor-start,page,seconds:estimates[index]}});
 if(pages.length)pages.at(-1).end=1;
 const records=[];for(const p of pages)for(const [strokeIndex,r] of(p.page.records||[]).entries())if(r.st.points?.length)records.push({p,r,strokeIndex,start:p.start+p.span*r.start/(p.page.total||1),end:p.start+p.span*r.end/(p.page.total||1)});
 function pageAt(progress){const q=clamp308(progress);let lo=0,hi=pages.length-1;while(lo<hi){const m=(lo+hi)>>1;if(q>=pages[m].end)lo=m+1;else hi=m}const p=pages[lo];return p?{index:p.index,local:clamp308((q-p.start)/p.span),aspect:p.aspect}: {index:0,local:1,aspect:.75}}
 function sample(progress){const q=clamp308(progress),where=pageAt(q),p=pages[where.index];if(!p)return{x:.5,y:.5,aspect:.75,page:0};const amount=where.local*(p.page.total||0),list=p.page.records||[];let lo=0,hi=list.length;while(lo<hi){const m=(lo+hi)>>1;if(list[m].end<=amount)lo=m+1;else hi=m}const r=list[Math.min(lo,list.length-1)];if(!r?.st.points?.length)return{x:.5,y:.5,page:p.index,aspect:p.aspect};const pts=r.st.points,t=clamp308(amount-r.start,0,pts.length-1),at=Math.floor(t),a=pts[at],b=pts[Math.min(at+1,pts.length-1)],tip={x:mix(a.x,b.x,t-at),y:mix(a.y,b.y,t-at)};if((r.st.settings?.seal194||0)>.99&&t>0&&(amount<r.end||!r.st.done)){const prev=pts[t-at>0?at:Math.max(0,at-1)];tip.x=(tip.x+prev.x)/2;tip.y=(tip.y+prev.y)/2}const pos=recordPoint308(p.page,r,tip),point=p.map(pos);return{...point,page:p.index,aspect:p.aspect,stroke310:Math.min(lo,list.length-1)}}
 const transitions=[],jumps310=[];for(let i=1;i<records.length;i++){const a=records[i-1],b=records[i],before=a.p.map(recordPoint308(a.p.page,a.r,a.r.st.points.at(-1))),after=b.p.map(recordPoint308(b.p.page,b.r,b.r.st.points[0])),dx=Math.abs(after.x-before.x),dy=Math.abs(after.y-before.y),page=a.p.index!==b.p.index;
  const paperSpace=(p,q)=>({x:(q.x*p.width-p.b.x)/(p.scale*p.bounds.w||p.width),y:(q.y*p.height-p.b.y)/(p.scale*p.bounds.h||p.height)});
  jumps310.push({p:b.start,before,after,beforePaper:paperSpace(a.p.page,recordPoint308(a.p.page,a.r,a.r.st.points.at(-1))),afterPaper:paperSpace(b.p.page,recordPoint308(b.p.page,b.r,b.r.st.points[0])),page,pageIndex:b.p.index,strokeIndex:b.strokeIndex});
  if(page||dx>.28&&dy>.18||dy>.42&&dx>.1)transitions.push({p:b.start,before,after,page,kind:page?'page':'column'});
 }
 return{pages:pages.map(p=>({index:p.index,start:p.start,end:p.end,span:p.span,aspect:p.aspect,seconds:p.seconds,strokeCount:p.page.records?.length||0,points:p.page.total||0})),regions311:writingRegions311(pages,recordPoint308),sample,pageAt,transitions,jumps310,estimatedSeconds:Math.ceil(sum+9),strokeCount:records.length,pointCount:snapshots.reduce((n,p)=>n+(p.total||0),0)};
}
export function cameraTransform308(iw,ih,w,h,scale,focus){const k=Math.min(w/iw,h/ih)*scale,sw=iw*k,sh=ih*k,lx=Math.max(0,(sw-w)/2),ly=Math.max(0,(sh-h)/2),x=clamp308((.5-focus.x)*sw,-lx,lx),y=clamp308((.5-focus.y)*sh,-ly,ly);return{x:(w-sw)/2+x,y:(h-sh)/2+y,width:sw,height:sh}}
export function projectPoint308(point,aspect,outAspect,scale,focus){const m=cameraTransform308(aspect,1,outAspect,1,scale,focus);return{x:(m.x+point.x*m.width)/outAspect,y:m.y+point.y*m.height}}
export function trackedCamera308(track,progress,seconds,target,outAspect){
 const point=track.sample(progress),step=.42/Math.max(1,seconds),weights=[1,2,3,4,5,4,3,2,1];let x=0,y=0,total=0;
 for(let i=0;i<weights.length;i++){const q=track.sample(clamp308(progress+(i-4)*step/4));if(q.page!==point.page)continue;x+=q.x*weights[i];y+=q.y*weights[i];total+=weights[i]}
 let focus={x:total?x/total:point.x,y:total?y/total:point.y},scale=1+(target-1)*ease(progress/.14),shade=0,eventIndex=-1,best=Infinity;
 // Binary search keeps long manuscripts independent of the number of already played pages.
 let lo=0,hi=track.transitions.length;while(lo<hi){const m=(lo+hi)>>1;if(track.transitions[m].p<progress)lo=m+1;else hi=m}
 for(const i of [lo-1,lo]){const e=track.transitions[i];if(!e)continue;const d=Math.abs((progress-e.p)*seconds);if(d<1.2&&d<best){best=d;eventIndex=i}}
 if(eventIndex>=0){const e=track.transitions[eventIndex],offset=(progress-e.p)*seconds,blend=ease((offset+1.2)/2.4);const strength=ease((1.2-Math.abs(offset))/.7);focus={x:mix(focus.x,mix(e.before.x,e.after.x,blend),strength),y:mix(focus.y,mix(e.before.y,e.after.y,blend),strength)};scale=1+(scale-1)*ease(Math.abs(offset)/1.2);const prev=track.transitions[eventIndex-1],next=track.transitions[eventIndex+1],spaced=(!prev||(e.p-prev.p)*seconds>4)&&(!next||(next.p-e.p)*seconds>4);if(e.kind==='column'&&spaced&&Math.abs(offset)<.35)shade=.18*(1-ease(Math.abs(offset)/.35));}
 // Margins follow the ink's distance from paper edges, not letterbox padding.
 // Letterbox-based margins become impossible around fit-to-fill and cause zoom jumps.
 const mx=Math.max(0,Math.min(.04,point.x*.5,(1-point.x)*.5)),my=Math.max(0,Math.min(.04,point.y*.5,(1-point.y)*.5));
 const safe=s=>{const p=projectPoint308(point,point.aspect,outAspect,s,focus);return p.x>=mx&&p.x<=1-mx&&p.y>=my&&p.y<=1-my};
 if(!safe(scale)){let a=1,b=scale;for(let i=0;i<14;i++){const mid=(a+b)/2;if(safe(mid))a=mid;else b=mid}scale=a}
 return{scale,focus,shade,point,transition:eventIndex>=0?track.transitions[eventIndex].kind:null};
}
