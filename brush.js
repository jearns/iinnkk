/* 源迹：轨迹驱动笔毫。原始采样保留；局部纸纹是二维噪声，不生成平行白槽。 */
(function(root){
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t;
 function hash(x,y,seed=1){let z=Math.sin(x*127.1+y*311.7+seed*19.19)*43758.5453;return z-Math.floor(z)}
 function noise(x,y,seed){const ix=Math.floor(x),iy=Math.floor(y),u=x-ix,v=y-iy,fx=u*u*(3-2*u),fy=v*v*(3-2*v);return mix(mix(hash(ix,iy,seed),hash(ix+1,iy,seed),fx),mix(hash(ix,iy+1,seed),hash(ix+1,iy+1,seed),fx),fy)}
 const defaults={size:30,dynamics:.82,dry:.45,softness:.48,smoothing:.32,taper:.8,fullness:1,color:'#050505',particle:'round'};
 function settings(s){return {...defaults,...s}}
 function radiusForSpeed(v,s,p=null){s=settings(s);const slow=1/(1+Math.pow(Math.max(v,0)/.24,1.85));let load=mix(.85,.025+slow*.98,Math.pow(clamp(s.dynamics,0,1),.20));if(p!==null)load=mix(load,.018+Math.pow(clamp(p,0,1),1.25)*1.04,.88);return s.size*.5*s.fullness*load}
 function dryForSpeed(v,s,p=null){let d=s.dry*Math.pow(clamp((v-.20)/.80,0,1),.70);if(p!==null)d=Math.max(d,s.dry*Math.pow(1-p,2)*.7);return Math.min(.85,d)}
 let canvasFactory=null;const masks=new Map();
 function setCanvasFactory(factory){canvasFactory=factory}
 function mask(s,level){const key=s.color+':'+s.particle+':'+level;if(masks.has(key))return masks.get(key);const create=canvasFactory||(root.document?()=>root.document.createElement('canvas'):null);if(!create)return null;const c=create();c.width=128;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=s.color;ctx.fillRect(0,0,128,128);const data=ctx.getImageData(0,0,128,128);for(let y=0;y<128;y++)for(let x=0;x<128;x++){const xx=s.particle==='square'?Math.floor(x/2)*2:x,yy=s.particle==='square'?Math.floor(y/2)*2:y,cloud=noise(xx/3.2,yy/2,72)*.8+hash(xx,yy,18)*.2;data.data[(y*128+x)*4+3]=Math.round(clamp((cloud-level/5*.54)/.10+.5,0,1)*255)}ctx.putImageData(data,0,0);if(masks.size>=24)masks.delete(masks.keys().next().value);masks.set(key,c);return c}
 function prepare(s){for(let i=1;i<=5;i++)mask(s,i)}
 function dab(t,x,y,r,angle,s,dry,opacity,turn,state,scale){
  if(r<.08*scale)return;const clip=state.clip;if(clip&&(x+r*1.5<clip.x||y+r*1.5<clip.y||x-r*1.5>clip.x+clip.w||y-r*1.5>clip.y+clip.h))return;
  const twist=state.twist||0,rx=r*(.76+Math.abs(turn)*.14),ry=r*(1+Math.abs(turn)*.10);angle+=twist*.35;t.fillStyle=s.color;t.globalAlpha=1;
  if(dry<.08){t.beginPath();t.ellipse(x,y,rx,ry,angle,0,Math.PI*2);t.fill();return}
  const level=Math.min(5,Math.max(1,Math.ceil(dry*5))),tile=mask(s,level);
  if(tile){const k=s.color+':'+s.particle+':'+level;let pattern=state.patterns?.get(k);if(!pattern){pattern=t.createPattern(tile,'repeat');if(!state.patterns)state.patterns=new Map();state.patterns.set(k,pattern)}t.save();t.scale(scale,scale);const shift=(state.seed%113);t.translate(shift,shift*.37);t.fillStyle=pattern;t.beginPath();t.ellipse(x/scale-shift,y/scale-shift*.37,rx/scale,ry/scale,angle,0,Math.PI*2);t.fill();t.restore();t.fillStyle=s.color;t.beginPath();t.ellipse(x-Math.sin(angle)*ry*dry*.22*(noise(x/scale/41,y/scale/37,state.seed+19)-.5),y+Math.cos(angle)*ry*dry*.22*(noise(x/scale/41,y/scale/37,state.seed+19)-.5),rx,ry*Math.max(.08,1-dry*(1.05+.48*noise(x/scale/19,y/scale/23,state.seed))),angle,0,Math.PI*2);t.fill();return}
  // Bounded work per dab: dense contact plus a few seeded, intermittent tufts.
  // No per-pixel noise loops, grain maps or semi-transparent grey coating.
  const core=Math.max(.22,1-dry*.85),cs=Math.cos(angle),sn=Math.sin(angle);
  t.beginPath();t.ellipse(x,y,rx,ry*core,angle,0,Math.PI*2);t.fill();
  for(let k=0;k<9;k++){const u=hash(k,2,state.seed)*1.5-.75,v=hash(k,5,state.seed)*2-1,phase=noise(state.travel/(8+hash(k,4,state.seed)*19),k,state.seed+7);if(phase<dry*.48)continue;const width=.13+hash(k,8,state.seed)*.19,dx=u*rx*.6,dy=v*ry*(.7+dry*.18),px=x+dx*cs-dy*sn,py=y+dx*sn+dy*cs;t.beginPath();if(s.particle==='square'){t.save();t.translate(px,py);t.rotate(angle);t.fillRect(-rx*.26,-ry*width,rx*.52,ry*width*2);t.restore()}else{t.ellipse(px,py,Math.max(.15*scale,rx*.36),Math.max(.12*scale,ry*width),angle,0,Math.PI*2);t.fill()}}
 }
 function start(st,t,W,H){const s=settings(st.settings),p=st.points[0];return{index:1,last:p,pos:{x:p.x*W,y:p.y*H},r:s.size*.06,contact:s.size*.06,velocity:0,angle:0,travel:0,hold:0,turn:0,dry:0,seed:st.seed||1,ended:false}}
 function tailInfo(st,W,H){const pts=st.points;let length=0,remaining=Array(pts.length).fill(0);for(let i=pts.length-2;i>=0;i--){length+=Math.hypot((pts[i+1].x-pts[i].x)*W,(pts[i+1].y-pts[i].y)*H)/(W/390);remaining[i]=length}let end=pts.length-1;while(end>0&&Math.hypot(pts[end].x-pts[end-1].x,pts[end].y-pts[end-1].y)<.0003)end--;const lastHold=pts.at(-1).t-pts[end].t;const v=end?Math.hypot((pts[end].x-pts[end-1].x)*390,(pts[end].y-pts[end-1].y)*H/(W/390))/Math.max(1,pts[end].t-pts[end-1].t):0;return{remaining,length,sharp:(v>.30||(st.hasPressure&&pts[end].pressure<.3))&&lastHold<100}}
 function advance(st,state,t,W,H){const s=settings(st.settings),scale=W/390,tail=st.done?tailInfo(st,W,H):null;
  for(;state.index<st.points.length;state.index++){
   const i=state.index,p=st.points[i],prev=state.last,dt=clamp(p.t-prev.t,1,250),rawX=p.x*W,rawY=p.y*H,rawD=Math.hypot(rawX-prev.x*W,rawY-prev.y*H),pressure=st.hasPressure&&Number.isFinite(p.pressure)?p.pressure:null;
   if(rawD<.06*scale&&p.lift){state.last=p;continue}
   // A pause wets the existing contact, never inflates a new circular blot.
   if(rawD<.06*scale){if(!state.hold)state.holdBase=state.contact||state.r;state.hold+=dt;const rest=1-Math.exp(-state.hold/650),base=state.holdBase,limit=state.travel?Math.min(base*.10,s.size*.012):s.size*.025,desired=base+limit*rest;state.r=desired;state.contact=desired;dab(t,state.pos.x,state.pos.y,desired*scale,state.angle,s,Math.max(0,state.dry*(1-rest)),1,state.turn,state,scale);state.last=p;continue}
   state.hold=0;const speed=rawD/scale/dt;state.velocity=state.travel?mix(state.velocity,speed,1-Math.exp(-dt/28)):speed;
   // Light causal smoothing, followed by an exact final sample; never replace
   // the user's character with a font or infer a different written shape.
   const follow=(i===st.points.length-1||st.points[i+1]?.lift)&&st.done?1:1-s.smoothing*.42;
   const nx=mix(state.pos.x,rawX,follow),ny=mix(state.pos.y,rawY,follow),dx=nx-state.pos.x,dy=ny-state.pos.y,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
   let da=state.travel?Math.atan2(Math.sin(a-state.angle),Math.cos(a-state.angle)):0;if(!state.travel)state.angle=a;
   state.turn=mix(state.turn,clamp(da,-1,1),.3);state.twist=mix(state.twist||0,clamp(da*1.7,-1.2,1.2),.22);const target=mix(state.r,radiusForSpeed(state.velocity,s,pressure),1-Math.exp(-dt/(18+s.softness*35))),distance=rawD/scale;
   // Opening and turns load the hairs along the path; a late pointer-up cannot stamp a bulb.
   const next=state.r+clamp(target-state.r,-Math.max(.08,distance*.9),Math.max(.04,distance*.48));
   state.dry=mix(state.dry,dryForSpeed(state.velocity,s,pressure),1-Math.exp(-dt/95));const dryness=clamp(state.dry*(.28+1.2*noise(state.travel/29,state.seed*.01,state.seed+91))*(1-Math.min(.7,Math.abs(state.turn)*.6)),0,.9),opacity=1;
   const steps=Math.max(1,Math.ceil(d/(Math.max(.55,next*.11)*scale)));
   for(let j=1;j<=steps;j++){
    const f=j/steps,travel=state.travel+d/scale*f,startEnvelope=clamp(.18+travel/(s.size*.18),.18,1);
    let envelope=startEnvelope,dry=dryness;
    if(tail&&tail.sharp){const remain=tail.remaining[i]+d/scale*(1-f),len=Math.min(s.size*.5,tail.length*.24);if(remain<len){envelope*=mix(1,Math.max(.04,remain/len),s.taper);dry=Math.min(.85,dry+.20*s.dry*(1-remain/len))}}
    state.contact=mix(state.r,next,f)*envelope;dab(t,state.pos.x+dx*f,state.pos.y+dy*f,state.contact*scale,state.angle+da*f,s,dry,opacity,state.turn,state,scale);
   }
   state.travel+=d/scale;state.pos={x:nx,y:ny};state.r=next;state.angle=a;state.last=p;
  }if(st.done&&state.travel===0&&state.hold===0){dab(t,state.pos.x,state.pos.y,s.size*.12*scale,0,s,0,1,0,state,scale)}state.ended=!!st.done;return state;
 }
 function render(st,t,W,H,clip=null){if(!st.points?.length)return null;const state=start(st,t,W,H);state.clip=clip;if(st.points.length===1){const s=settings(st.settings);dab(t,state.pos.x,state.pos.y,s.size*.12*(W/390),0,s,0,1,0,state,W/390)}return advance(st,state,t,W,H)}
 const api={setCanvasFactory,prepare,settings,radiusForSpeed,dryForSpeed,start,advance,render};root.ParticleBrush=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
