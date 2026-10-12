/* 源迹：轨迹驱动笔毫。原始采样保留；局部纸纹是二维噪声，不生成平行白槽。 */
(function(root){
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t;
 function hash(x,y,seed=1){let z=Math.sin(x*127.1+y*311.7+seed*19.19)*43758.5453;return z-Math.floor(z)}
 function noise(x,y,seed){const ix=Math.floor(x),iy=Math.floor(y),u=x-ix,v=y-iy,fx=u*u*(3-2*u),fy=v*v*(3-2*v);return mix(mix(hash(ix,iy,seed),hash(ix+1,iy,seed),fx),mix(hash(ix,iy+1,seed),hash(ix+1,iy+1,seed),fx),fy)}
 const defaults={size:30,dynamics:.82,dry:.45,softness:.48,smoothing:.32,taper:.8,fullness:1,color:'#050505',particle:'round'};
 function settings(s){return {...defaults,...s}}
 // One continuous control, with distinct rounded, firm and flowing stages.
 function lineProfile108(value){const level=clamp(Number(value)||0,0,100),stages=[
  {dynamics:.06,smoothing:.08,softness:.10,taper:.12,speedResponse:.35},
  {dynamics:.32,smoothing:.20,softness:.22,taper:.38,speedResponse:.65},
  {dynamics:.64,smoothing:.40,softness:.42,taper:.66,speedResponse:1},
  {dynamics:.86,smoothing:.60,softness:.65,taper:.88,speedResponse:1.5},
  {dynamics:1,smoothing:.80,softness:.86,taper:1,speedResponse:2.2}
 ];const i=Math.min(3,Math.floor(level/25)),f=(level-i*25)/25,out={lineStrength108:level};
 for(const key of Object.keys(stages[0]))out[key]=mix(stages[i][key],stages[i+1][key],f);return out}
 function radiusForSpeed(v,s,p=null){s=settings(s);v*=s.speedResponse||1;const slow=1/(1+Math.pow(Math.max(v,0)/.24,1.85));let load=mix(.85,.025+slow*.98,Math.pow(clamp(s.dynamics,0,1),.20));if(p!==null)load=mix(load,.018+Math.pow(clamp(p,0,1),1.25)*1.04,.88);return s.size*.5*s.fullness*load}
 function dryForSpeed(v,s,p=null){v*=s.speedResponse||1;let d=s.dry*Math.pow(clamp((v-.20)/.80,0,1),.70);if(p!==null)d=Math.max(d,s.dry*Math.pow(1-p,2)*.7);return Math.min(.85,d)}
 let canvasFactory=null;const masks=new Map();
 function setCanvasFactory(factory){canvasFactory=factory}
 function mask(s,level){const key=s.color+':'+s.particle+':'+level;if(masks.has(key))return masks.get(key);const create=canvasFactory||(root.document?()=>root.document.createElement('canvas'):null);if(!create)return null;const c=create();c.width=128;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=s.color;ctx.fillRect(0,0,128,128);const data=ctx.getImageData(0,0,128,128);for(let y=0;y<128;y++)for(let x=0;x<128;x++){const xx=s.particle==='square'?Math.floor(x/2)*2:x,yy=s.particle==='square'?Math.floor(y/2)*2:y,cloud=noise(xx/3.2,yy/2,72)*.8+hash(xx,yy,18)*.2;data.data[(y*128+x)*4+3]=Math.round(clamp((cloud-level/5*.54)/.10+.5,0,1)*255)}ctx.putImageData(data,0,0);if(masks.size>=24)masks.delete(masks.keys().next().value);masks.set(key,c);return c}
 function prepare(s){for(let i=1;i<=5;i++)mask(s,i)}
 function dab(t,x,y,r,angle,s,dry,opacity,turn,state,scale){
  if(r<.08*scale)return;const clip=state.clip;if(clip&&(x+r*1.5<clip.x||y+r*1.5<clip.y||x-r*1.5>clip.x+clip.w||y-r*1.5>clip.y+clip.h))return;
 const twist=state.twist||0,rx=r*(.76+Math.abs(turn)*.14),ry=r*(1+Math.abs(turn)*.10);angle=s.kaishu127?angle*.22+Math.PI/4+twist*.12:angle+twist*.35;t.fillStyle=s.color;t.globalAlpha=1;
 // A rounded, oblique contact gives Yan-style strokes firm shoulders without sharp square stamps.
 if(s.kaishu127&&dry<.08){t.beginPath();t.ellipse(x,y,rx*.94,ry,angle,0,Math.PI*2);t.fill();return}
  if(dry<.08){t.beginPath();t.ellipse(x,y,rx,ry,angle,0,Math.PI*2);t.fill();return}
  const level=Math.min(5,Math.max(1,Math.ceil(dry*5))),tile=mask(s,level);
  if(tile){const k=s.color+':'+s.particle+':'+level;let pattern=state.patterns?.get(k);if(!pattern){pattern=t.createPattern(tile,'repeat');if(!state.patterns)state.patterns=new Map();state.patterns.set(k,pattern)}t.save();t.scale(scale,scale);const shift=(state.seed%113);t.translate(shift,shift*.37);t.fillStyle=pattern;t.beginPath();t.ellipse(x/scale-shift,y/scale-shift*.37,rx/scale,ry/scale,angle,0,Math.PI*2);t.fill();t.restore();t.fillStyle=s.color;t.beginPath();t.ellipse(x-Math.sin(angle)*ry*dry*.22*(noise(x/scale/41,y/scale/37,state.seed+19)-.5),y+Math.cos(angle)*ry*dry*.22*(noise(x/scale/41,y/scale/37,state.seed+19)-.5),rx,ry*Math.max(.08,1-dry*(1.05+.48*noise(x/scale/19,y/scale/23,state.seed))),angle,0,Math.PI*2);t.fill();return}
  // Bounded work per dab: dense contact plus a few seeded, intermittent tufts.
  // No per-pixel noise loops, grain maps or semi-transparent grey coating.
  const core=Math.max(.22,1-dry*.85),cs=Math.cos(angle),sn=Math.sin(angle);
  t.beginPath();t.ellipse(x,y,rx,ry*core,angle,0,Math.PI*2);t.fill();
  for(let k=0;k<9;k++){const u=hash(k,2,state.seed)*1.5-.75,v=hash(k,5,state.seed)*2-1,phase=noise(state.travel/(8+hash(k,4,state.seed)*19),k,state.seed+7);if(phase<dry*.48)continue;const width=.13+hash(k,8,state.seed)*.19,dx=u*rx*.6,dy=v*ry*(.7+dry*.18),px=x+dx*cs-dy*sn,py=y+dx*sn+dy*cs;t.beginPath();if(s.particle==='square'){t.save();t.translate(px,py);t.rotate(angle);t.fillRect(-rx*.26,-ry*width,rx*.52,ry*width*2);t.restore()}else{t.ellipse(px,py,Math.max(.15*scale,rx*.36),Math.max(.12*scale,ry*width),angle,0,Math.PI*2);t.fill()}}
 }
 function start(st,t,W,H){const s=settings(st.settings),p=st.points[0];return{index:1,last:p,pos:{x:p.x*W,y:p.y*H},r:s.size*.025,contact:s.size*.025,velocity:0,angle:0,travel:0,hold:0,turn:0,dry:0,seed:st.seed||1,ended:false}}
 function tailInfo(st,W,H){const pts=st.points;let length=0,remaining=Array(pts.length).fill(0);for(let i=pts.length-2;i>=0;i--){length+=Math.hypot((pts[i+1].x-pts[i].x)*W,(pts[i+1].y-pts[i].y)*H)/(W/390);remaining[i]=length}let end=pts.length-1;while(end>0&&Math.hypot(pts[end].x-pts[end-1].x,pts[end].y-pts[end-1].y)<.0003)end--;const v=end?Math.hypot((pts[end].x-pts[end-1].x)*390,(pts[end].y-pts[end-1].y)*H/(W/390))/Math.max(1,pts[end].t-pts[end-1].t):0;let hook=false;for(let i=Math.max(1,end-9);i<end-1;i++){const a=pts[i-1],b=pts[i],c=pts[end],ux=(b.x-a.x)*W,uy=(b.y-a.y)*H,vx=(c.x-b.x)*W,vy=(c.y-b.y)*H,mag=Math.hypot(ux,uy)*Math.hypot(vx,vy);if(mag>1&&remaining[i]<st.settings.size*.85&&remaining[i]>st.settings.size*.08&&Math.acos(Math.max(-1,Math.min(1,(ux*vx+uy*vy)/mag)))>1.12){hook=true;break}}const lowPressure=st.hasPressure&&pts[end].pressure<.3,ex=end?Math.abs(pts[end].x-pts[end-1].x)*W:0,ey=end?Math.abs(pts[end].y-pts[end-1].y)*H:0,axisEnd=st.settings.kaishu127&&!hook&&!lowPressure&&v<.18&&Math.min(ex,ey)/Math.max(.001,ex,ey)<.35;return{remaining,length,hook,sharp:!axisEnd&&(v>.24||lowPressure||hook||Math.min(ex,ey)/Math.max(.001,ex,ey)>.35&&length>st.settings.size*.35)}}
 // Swept contact: each segment is a connected ribbon, not thousands of stamps.
 function ribbon192(t,x0,y0,r0,x1,y1,r1,s,dry,state,scale){
  const dx=x1-x0,dy=y1-y0,d=Math.hypot(dx,dy);if(d<.001)return;const clip=state.clip,r=Math.max(r0,r1);if(clip&&(Math.max(x0,x1)+r<clip.x||Math.min(x0,x1)-r>clip.x+clip.w||Math.max(y0,y1)+r<clip.y||Math.min(y0,y1)-r>clip.y+clip.h))return;
  const nx=-dy/d,ny=dx/d;t.fillStyle=s.color;t.globalAlpha=1;
  function shape(f=1){t.beginPath();t.moveTo(x0+nx*r0*f,y0+ny*r0*f);t.lineTo(x1+nx*r1*f,y1+ny*r1*f);t.lineTo(x1-nx*r1*f,y1-ny*r1*f);t.lineTo(x0-nx*r0*f,y0-ny*r0*f);t.closePath();t.fill();
   if(state.travel*scale>=r0&&r0>.02*scale){t.beginPath();t.ellipse(x0,y0,r0*f,r0*f,0,0,Math.PI*2);t.fill()}
   if(state.travel*scale+d>=r1&&r1>.02*scale&&!state.tip193){t.beginPath();t.ellipse(x1,y1,r1*f,r1*f,0,0,Math.PI*2);t.fill()}}
  if(dry>.08){const tile=mask(s,Math.min(5,Math.max(1,Math.ceil(dry*5))));if(tile){const key=s.color+':'+s.particle+':'+Math.ceil(dry*5);state.patterns||=new Map();let pattern=state.patterns.get(key);if(!pattern){pattern=t.createPattern(tile,'repeat');state.patterns.set(key,pattern)}t.fillStyle=pattern;shape();t.fillStyle=s.color;shape(Math.max(.18,1-dry*.8));return}}
  shape();
 }
 function advance(st,state,t,W,H){const s=settings(st.settings),scale=W/390,tail=st.done?tailInfo(st,W,H):null;
  for(;state.index<st.points.length;state.index++){
   const i=state.index,p=st.points[i],prev=state.last,dt=clamp(p.t-prev.t,1,250),x=p.x*W,y=p.y*H,dx=x-state.pos.x,dy=y-state.pos.y,d=Math.hypot(dx,dy),distance=d/scale;
   if(d<.02*scale){state.last=p;continue}
   const pressure=st.hasPressure&&Number.isFinite(p.pressure)?p.pressure:null,speed=distance/dt;
   state.velocity=state.travel?mix(state.velocity,speed,1-Math.exp(-dt/40)):speed;
   const loaded=radiusForSpeed(state.velocity,s,pressure),opening=clamp((state.travel+distance)/(Math.max(2,s.size*.10)),.45,1);
   const target=loaded*opening,next=state.r+clamp(target-state.r,-distance*.22,distance*.65);
   let envelope=1;if(tail&&tail.sharp){const len=Math.min(160,Math.max(8,s.size*.6),tail.length*.28),u=clamp(tail.remaining[i]/Math.max(.01,len),0,1);envelope=Math.min(u*u*(3-2*u),tail.remaining[i]/Math.max(.01,next)*.7)}
   const r0=Math.max(.02*scale,state.contact*scale),r1=Math.max(0,next*envelope*scale);
   state.dry=mix(state.dry,dryForSpeed(state.velocity,s,pressure),1-Math.exp(-dt/95));
   state.tip193=!!tail?.sharp&&tail.remaining[i]<.001;
   ribbon192(t,state.pos.x,state.pos.y,r0,x,y,r1,s,state.dry,state,scale);
   state.contact=next*envelope;state.r=next;state.pos={x,y};state.angle=Math.atan2(dy,dx);state.travel+=distance;state.last=p;
  }
  if(st.done&&!state.travel&&st.points.length>1)dab(t,state.pos.x,state.pos.y,s.size*.12*scale,0,s,0,1,0,state,scale);
  state.ended=!!st.done;return state;
 }
 function render(st,t,W,H,clip=null){if(!st.points?.length)return null;const state=start(st,t,W,H);state.clip=clip;if(st.points.length===1){const s=settings(st.settings);dab(t,state.pos.x,state.pos.y,s.size*.12*(W/390),0,s,0,1,0,state,W/390)}return advance(st,state,t,W,H)}
 const api={setCanvasFactory,prepare,settings,lineProfile108,radiusForSpeed,dryForSpeed,start,advance,render};root.ParticleBrush=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);

