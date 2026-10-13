/* 源迹：轨迹驱动笔毫。原始采样保留；局部纸纹是二维噪声，不生成平行白槽。 */
(function(root){
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t;
 function hash(x,y,seed=1){let n=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(seed|0,1442695041);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
 function noise(x,y,seed){const ix=Math.floor(x),iy=Math.floor(y),u=x-ix,v=y-iy,fx=u*u*(3-2*u),fy=v*v*(3-2*v);return mix(mix(hash(ix,iy,seed),hash(ix+1,iy,seed),fx),mix(hash(ix,iy+1,seed),hash(ix+1,iy+1,seed),fx),fy)}
 const defaults={size:30,dynamics:.82,dry:.45,softness:.48,smoothing:.32,taper:.8,fullness:1,color:'#050505',particle:'round'};
 function settings(s){return {...defaults,...s}}
 // Five reference-calibrated brush channels; all measurements use paper coordinates.
 const channels194=['seal194','clerical194','regular194','running194','cursive194'];
 const profiles194=[
  {dynamics:.02,dry:0,softness:.7,smoothing:.72,taper:0,speedResponse:.35,fullness:.85},
  {dynamics:.28,dry:.12,softness:.3,smoothing:.36,taper:.7,speedResponse:.65,fullness:1},
  {dynamics:.50,dry:.05,softness:.2,smoothing:.22,taper:.9,speedResponse:.65,fullness:1.05},
  {dynamics:.87,dry:.22,softness:.48,smoothing:.36,taper:.94,speedResponse:1.15,fullness:.9},
  {dynamics:1,dry:.22,softness:.5,smoothing:.34,taper:1,speedResponse:1.6,fullness:1.08}
 ];
 const names194=['李斯·篆书','蔡邕·隶书','颜真卿·楷书','王羲之·行书','张旭·草书'],keys194=['lisi','cai','yan','wang','zhang'];
 const notes194=['泰山刻石：玉箸匀线，中锋圆转，藏头护尾；结体宜修长。','熹平石经：逆入蚕头，长横波磔，主笔燕尾；结体宜扁阔。','多宝塔碑：横轻竖重，折处顿按，捺脚拖刀；结体宜方正。','兰亭序：露锋入纸，提按映带，牵丝轻灵；欹正随手写取势。','古诗四帖：绞转灵动，提按相生，少量飞白；连绵随真实轨迹。'];
 const presets194=Object.fromEntries(keys194.map((key,i)=>[key,{...profiles194[i],size:[150,250,150,1000,1000][i],name:names194[i],desc:notes194[i],lineStrength108:i*25,styleVersion194:194,...Object.fromEntries(channels194.map((name,j)=>[name,i===j?1:0])),kaishu127:i===2}]));
 function lineProfile108(value){const level=clamp(Number(value)||0,0,100),i=Math.min(3,Math.floor(level/25)),f=(level-i*25)/25,out={lineStrength108:level,styleVersion194:194,kaishu127:false};for(const name of Object.keys(profiles194[0]))out[name]=mix(profiles194[i][name],profiles194[i+1][name],f);for(let j=0;j<5;j++)out[channels194[j]]=j===i?1-f:j===i+1?f:0;return out}
 function radiusForSpeed(v,s,p=null){s=settings(s);v*=s.speedResponse||1;const slow=1/(1+Math.pow(Math.max(v,0)/.24,1.85));let load=mix(.85,.025+slow*.98,Math.pow(clamp(s.dynamics,0,1),.20));if(p!==null)load=mix(load,.018+Math.pow(clamp(p,0,1),1.25)*1.04,.88);const expressive=(s.running194||0)+(s.cursive194||0);const release=clamp((v-.65)/1.9,0,1)*(s.cursive194||0),floor=mix(.15,.012,release);load=Math.max(load,floor*expressive);if((s.cursive194||0)>.98)load=Math.min(load,.56);return s.size*.5*s.fullness*load}
 function dryForSpeed(v,s,p=null){v*=s.speedResponse||1;let d=s.dry*Math.pow(clamp((v-.20)/.80,0,1),.70);if(p!==null)d=Math.max(d,s.dry*Math.pow(1-p,2)*.7);return Math.min(.85,d)}
 let canvasFactory=null;const masks=new Map(),grains194=new Map();
 function setCanvasFactory(factory){canvasFactory=factory}
 function mask(s,level){const key=s.color+':'+s.particle+':'+level;if(masks.has(key))return masks.get(key);const create=canvasFactory||(root.document?()=>root.document.createElement('canvas'):null);if(!create)return null;const c=create();c.width=128;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=s.color;ctx.fillRect(0,0,128,128);const data=ctx.getImageData(0,0,128,128);let grain=grains194.get(s.particle);if(!grain){grain=new Float32Array(128*128);for(let y=0;y<128;y++)for(let x=0;x<128;x++)grain[y*128+x]=hash(x>>2,y>>1,72)*.7+hash(x,y,18)*.3;grains194.set(s.particle,grain)}for(let y=0;y<128;y++)for(let x=0;x<128;x++){const cloud=grain[y*128+x];data.data[(y*128+x)*4+3]=Math.round(clamp((cloud-level/5*.54)/.10+.5,0,1)*255)}ctx.putImageData(data,0,0);if(masks.size>=24)masks.delete(masks.keys().next().value);masks.set(key,c);return c}
 const cursiveMasks196=new Map();let cursiveGrain196=null;
 function cursiveMask196(s,level){const key=s.color+':'+level;if(cursiveMasks196.has(key))return cursiveMasks196.get(key);const create=canvasFactory||(root.document?()=>root.document.createElement('canvas'):null);if(!create)return null;const c=create();c.width=256;c.height=64;const ctx=c.getContext('2d');ctx.fillStyle=s.color;ctx.fillRect(0,0,c.width,c.height);const pixels=ctx.getImageData(0,0,c.width,c.height);if(!cursiveGrain196){cursiveGrain196=new Float32Array(c.width*c.height);for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)cursiveGrain196[y*c.width+x]=noise(x/22,y/5,81)*.38+noise(x/2.5,y/1.3,19)*.62}for(let i=0;i<cursiveGrain196.length;i++){const cloud=cursiveGrain196[i],k=i*4,threshold=.12+level*.10;pixels.data[k+3]=Math.round(clamp((cloud-threshold)/.07+.5,0,1)*255)}ctx.putImageData(pixels,0,0);if(cursiveMasks196.size>=16)cursiveMasks196.delete(cursiveMasks196.keys().next().value);cursiveMasks196.set(key,c);return c}
 function prepare(s){if((s.cursive194||0)>.2){for(let i=1;i<=4;i++)cursiveMask196(s,i)}else for(let i=1;i<=5;i++)mask(s,i)}
 function dab(t,x,y,r,angle,s,dry,opacity,turn,state,scale){
  if(r<.08*scale)return;const clip=state.clip;if(clip&&(x+r*1.5<clip.x||y+r*1.5<clip.y||x-r*1.5>clip.x+clip.w||y-r*1.5>clip.y+clip.h))return;
 const twist=state.twist||0,rx=r*(.76+Math.abs(turn)*.14),ry=r*(1+Math.abs(turn)*.10);angle=s.kaishu127?angle*.22+Math.PI/4+twist*.12:angle+twist*.35;t.fillStyle=s.color;t.globalAlpha=state.opacity??1;
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
 function start(st,t,W,H){const s=settings(st.settings),p=st.points[0];return{index:1,last:p,pos:{x:p.x*W,y:p.y*H},r:s.size*(.006+.20*(s.clerical194||0)+.10*(s.regular194||0)+.06*(s.cursive194||0)),contact:s.size*(.006+.20*(s.clerical194||0)+.10*(s.regular194||0)+.06*(s.cursive194||0)),velocity:0,angle:0,travel:0,hold:0,turn:0,dry:0,seed:st.seed||1,inkTravel195:st.inkTravel195||0,opacity:t.globalAlpha??1,ended:false}}
 function tailInfo(st,W,H){const pts=st.points;let length=0,remaining=Array(pts.length).fill(0);for(let i=pts.length-2;i>=0;i--){length+=Math.hypot((pts[i+1].x-pts[i].x)*W,(pts[i+1].y-pts[i].y)*H)/(W/390);remaining[i]=length}let end=pts.length-1;while(end>0&&Math.hypot(pts[end].x-pts[end-1].x,pts[end].y-pts[end-1].y)<.0003)end--;const v=end?Math.hypot((pts[end].x-pts[end-1].x)*390,(pts[end].y-pts[end-1].y)*H/(W/390))/Math.max(1,pts[end].t-pts[end-1].t):0;let hook=false;for(let i=1;i<end-1;i++){const a=pts[i-1],b=pts[i],c=pts[end],ux=(b.x-a.x)*W,uy=(b.y-a.y)*H,vx=(c.x-b.x)*W,vy=(c.y-b.y)*H,mag=Math.hypot(ux,uy)*Math.hypot(vx,vy);if(mag>1&&remaining[i]<st.settings.size*.85&&remaining[i]>st.settings.size*.08&&Math.acos(Math.max(-1,Math.min(1,(ux*vx+uy*vy)/mag)))>1.12){hook=true;break}}const lowPressure=st.hasPressure&&pts[end].pressure<.3,ex=end?Math.abs(pts[end].x-pts[end-1].x)*W:0,ey=end?Math.abs(pts[end].y-pts[end-1].y)*H:0,axisEnd=st.settings.kaishu127&&!hook&&!lowPressure&&v<.18&&Math.min(ex,ey)/Math.max(.001,ex,ey)<.35;return{remaining,length,hook,sharp:!axisEnd&&(v>.24||lowPressure||hook||Math.min(ex,ey)/Math.max(.001,ex,ey)>.35&&length>st.settings.size*.35)}}
 // Swept contact: each segment is a connected ribbon, not thousands of stamps.
 function ribbon192(t,x0,y0,r0,x1,y1,r1,s,dry,state,scale){
  const dx=x1-x0,dy=y1-y0,d=Math.hypot(dx,dy);if(d<.001)return;const clip=state.clip,r=Math.max(r0,r1);if(clip&&(Math.max(x0,x1)+r<clip.x||Math.min(x0,x1)-r>clip.x+clip.w||Math.max(y0,y1)+r<clip.y||Math.min(y0,y1)-r>clip.y+clip.h))return;
  const nx=-dy/d,ny=dx/d,previous=state.normal195||{x:nx,y:ny},next=state.nextNormal195||{x:nx,y:ny};t.fillStyle=state.color194||s.color;t.globalAlpha=state.opacity??1;
  // Adjacent strips share exactly the same cross-section. No overlapping round dabs
  // and no mismatched perpendicular ends that leave spikes on broad strokes.
  const overlap=Math.min(.8,d*.4),startOverlap=state.travel?overlap:0,endOverlap=state.tip193||state.final195?0:overlap,ax=x0-dx/d*startOverlap,ay=y0-dy/d*startOverlap,bx=x1+dx/d*endOverlap,by=y1+dy/d*endOverlap;
  function strip(a,b,a1=a,b1=b){const px=previous.y,py=-previous.x,qx=next.y,qy=-next.x,k=d*(.12+.25*(s.softness||0));t.beginPath();t.moveTo(ax+previous.x*r0*a,ay+previous.y*r0*a);
   if(t.bezierCurveTo){t.bezierCurveTo(ax+previous.x*r0*a+px*k,ay+previous.y*r0*a+py*k,bx+next.x*r1*a1-qx*k,by+next.y*r1*a1-qy*k,bx+next.x*r1*a1,by+next.y*r1*a1);t.lineTo(bx+next.x*r1*b1,by+next.y*r1*b1);t.bezierCurveTo(bx+next.x*r1*b1-qx*k,by+next.y*r1*b1-qy*k,ax+previous.x*r0*b+px*k,ay+previous.y*r0*b+py*k,ax+previous.x*r0*b,ay+previous.y*r0*b)}else{t.lineTo(bx+next.x*r1*a1,by+next.y*r1*a1);t.lineTo(bx+next.x*r1*b1,by+next.y*r1*b1);t.lineTo(ax+previous.x*r0*b,ay+previous.y*r0*b)}t.closePath();t.fill()}

  if((s.cursive194||0)>.2){
   // An uneven contact patch and travelling bristle tufts: wet ink has a dense
   // centre, dry ink exposes irregular paper channels along the actual path.
   // No repeated pixel mask, uniform white flecks or equally spaced rail lines.
   const unit=Math.max(4,s.size*.018),travel=(state.travel+(state.inkTravel195||0))/unit,end=travel+d/scale/unit;
   const edge=(u,side)=>1+(noise(u*.9,side,state.seed+67)-.5)*(.035+dry*.19)+(noise(u*3.7,side+4,state.seed+17)-.5)*dry*.06;
   const left0=edge(travel,0),left1=edge(end,0),right0=edge(travel,1),right1=edge(end,1),core=Math.max(.45,1-dry*.65);
   // Only lifted, narrow contacts expose paper grain. Pattern follows local tangent
   // and accumulated travel; opaque ink colour never changes into grey paint.
   if(dry>.12){const tile=cursiveMask196(s,Math.min(4,Math.max(1,Math.ceil(dry*5))));if(tile){state.patterns||=new Map();const key='grain199:'+Math.ceil(dry*5);let pattern=state.patterns.get(key);if(!pattern){pattern=t.createPattern(tile,'repeat');state.patterns.set(key,pattern)}const cs=dx/d,sn=dy/d,k=scale*.45;pattern.setTransform?.({a:cs*k,b:sn*k,c:-sn*k,d:cs*k,e:x0-cs*state.travel*scale,f:y0-sn*state.travel*scale});t.fillStyle=pattern}}
   strip(-core*left0,core*right0,-core*left1,core*right1);
   const bands=7,weights=Array.from({length:bands},(_,k)=>.25+hash(k,7,state.seed)*1.6),total=weights.reduce((a,b)=>a+b,0);let offset=-1;
   for(let k=0;k<bands;k++){const a=offset,b=a+2*weights[k]/total;offset=b;const phase=u=>noise(u*.48,k*.71,state.seed+23),porosity=u=>clamp((dry-.12)*(.2+phase(u)*1.3),0,.87),gap0=porosity(travel),gap1=porosity(end),wiggle=u=>(noise(u*.8,k,state.seed+44)-.5)*dry*.025;
    // Tufts join and separate locally, rather than carrying one gap to the end.
    if(phase((travel+end)/2)<dry*.48&&Math.abs((a+b)/2)>core*.8)continue;
    const a0=a+(b-a)*gap0*.28+wiggle(travel),b0=b-(b-a)*gap0*.72+wiggle(travel),a1=a+(b-a)*gap1*.28+wiggle(end),b1=b-(b-a)*gap1*.72+wiggle(end);
    strip(a0*(a0<0?left0:right0),b0*(b0<0?left0:right0),a1*(a1<0?left1:right1),b1*(b1<0?left1:right1));
   }
   t.fillStyle=state.color194||s.color;
  }else{const rough=s.regular194?0:(s.running194?.027:0),u=state.travel/Math.max(8,s.size*.04),v=u+d/scale/Math.max(8,s.size*.04);strip(-1+(noise(u,0,state.seed)-.5)*rough,1+(noise(u,1,state.seed)-.5)*rough,-1+(noise(v,0,state.seed)-.5)*rough,1+(noise(v,1,state.seed)-.5)*rough)}
  if(state.travel&&state.turn197>.9&&((s.regular194||0)+(s.running194||0)+(s.cursive194||0))>.5){t.beginPath();t.ellipse(x0,y0,r0*(s.regular194?.72:.88),r0*(s.regular194?.85:.88),Math.PI/4,0,Math.PI*2);t.fill()}
  // Only actual stroke ends get caps, never every sampling boundary.
  if(!state.travel&&((s.clerical194||0)>.5||(s.cursive194||0)>.98)){t.beginPath();t.ellipse(x0,y0,r0*.78,r0,Math.atan2(dy,dx),0,Math.PI*2);t.fill()}
  if(state.final195&&!state.tip193&&r1>.02*scale){t.beginPath();t.ellipse(x1,y1,r1*(1-.18*(s.regular194||0)),r1,Math.atan2(dy,dx),0,Math.PI*2);t.fill()}
  state.normal195=next;
 }
 function advanceSeal194(st,state,t,W,H){const s=settings(st.settings),radius=s.size*.34*s.fullness*(W/390);t.save();t.globalAlpha=state.opacity??1;t.strokeStyle=s.color;t.lineWidth=radius*2;t.lineCap=t.lineJoin='round';for(;state.index<st.points.length;state.index++){const p=st.points[state.index],last=state.last,x=p.x*W,y=p.y*H;if(Math.hypot(x-state.pos.x,y-state.pos.y)<.01)continue;const end=st.done&&state.index===st.points.length-1,qx=end?x:(last.x*W+x)/2,qy=end?y:(last.y*H+y)/2;t.beginPath();t.moveTo(state.pos.x,state.pos.y);t.quadraticCurveTo(last.x*W,last.y*H,qx,qy);t.stroke();state.travel+=Math.hypot(qx-state.pos.x,qy-state.pos.y)/(W/390);state.pos={x:qx,y:qy};state.last=p}if(st.done){const p=st.points.at(-1);t.beginPath();t.moveTo(state.pos.x,state.pos.y);t.lineTo(p.x*W,p.y*H);t.stroke()}t.restore();return state}
 function inkTone194(color,amount){if(!/^#[0-9a-f]{6}$/i.test(color))return color;const n=parseInt(color.slice(1),16);return '#'+[n>>16,(n>>8)&255,n&255].map(v=>Math.round(mix(v,Math.min(120,v+60),amount)).toString(16).padStart(2,'0')).join('')}
 function advance(st,state,t,W,H){const s=settings(st.settings),scale=W/390,tail=st.done?tailInfo(st,W,H):null;if((s.seal194||0)>.99&&st.points.length>1)return advanceSeal194(st,state,t,W,H);const first=st.points[0],last=st.points.at(-1),sx=(last.x-first.x)*390,sy=(last.y-first.y)*H/scale,clerical=!!tail&&(s.clerical194||0)>.2&&sx>Math.max(s.size*.9,Math.abs(sy)*2),knife=!!tail&&(s.regular194||0)>.2&&sx>s.size*.3&&sy>s.size*.3,sharp194=(s.cursive194||0)<.98&&!!tail&&((s.clerical194||0)>.5?clerical||tail.hook:((s.regular194||0)>.5?(tail.hook||knife||st.hasPressure&&last.pressure<.3):tail.sharp||knife))&&!((s.regular194||0)>.5&&!knife&&!tail.hook&&Math.abs(sy)<Math.abs(sx)*.15);
  for(;state.index<st.points.length;state.index++){
   const i=state.index,p=st.points[i],prev=state.last,dt=clamp(p.t-prev.t,1,250),rawX=p.x*W,rawY=p.y*H;
   let x=rawX,y=rawY;const before=st.points[i-1],after=st.points[i+1];if(before&&after){const ax=(p.x-before.x)*W,ay=(p.y-before.y)*H,bx=(after.x-p.x)*W,by=(after.y-p.y)*H,al=Math.hypot(ax,ay),bl=Math.hypot(bx,by);if(al&&bl&&Math.max(al,bl)<Math.max(6,s.size*.1)*scale&&(ax*bx+ay*by)/(al*bl)>.85){x=(before.x*.2+p.x*.6+after.x*.2)*W;y=(before.y*.2+p.y*.6+after.y*.2)*H}}
   const dx=x-state.pos.x,dy=y-state.pos.y,d=Math.hypot(dx,dy),distance=d/scale;
   if(d<.02*scale){state.last=p;continue}
   const pressure=st.hasPressure&&Number.isFinite(p.pressure)?p.pressure:null,speed=distance/dt;
   state.velocity=state.travel?mix(state.velocity,speed,1-Math.exp(-dt/40)):speed;
   const angle=Math.atan2(dy,dx),regular=s.regular194||0,clericalWeight=s.clerical194||0,seal=s.seal194||0,progress=tail?clamp(state.travel/Math.max(1,tail.length),0,1):clamp(state.travel/(s.size*3),0,1),turn=state.travel?Math.abs(Math.atan2(Math.sin(angle-state.angle),Math.cos(angle-state.angle))):0;let heading=state.heading195??angle;heading+=Math.atan2(Math.sin(angle-heading),Math.cos(angle-heading))*(1-Math.exp(-distance/Math.max(4,s.size*.14)));state.heading195=heading;let loaded=radiusForSpeed(state.velocity,s,pressure);loaded=mix(loaded,s.size*.34*s.fullness,seal);loaded=mix(loaded,s.size*(.115+.205*Math.abs(Math.sin(heading)))*(knife?1+progress*.35:1)*s.fullness,regular);loaded*=1+(s.cursive194||0)*Math.min(.16,turn*.1);loaded=mix(loaded,s.size*.13*(1+.1*Math.abs(Math.sin(angle))),clericalWeight);if(tail&&regular&&Math.abs(sy)<Math.abs(sx)*.15)loaded*=1+regular*.18*clamp((progress-.84)/.16,0,1);if(clerical){const u=clamp(tail.remaining[i]/Math.max(4,s.size*.65),0,1);loaded*=1+clericalWeight*.8*Math.sin(Math.PI*u)**2}const opening=clamp((state.travel+distance)/(Math.max(2,s.size*.10)),.45,1);
   const target=loaded*mix(opening,1,seal),next=state.r+clamp(target-state.r,-distance*(regular?.28:.18),distance*(regular?.55:.25));
   let envelope=1;if(sharp194&&(s.seal194||0)<.98){const len=Math.min(160,Math.max(8,s.size*.6),tail.length*.28),u=clamp(tail.remaining[i]/Math.max(.01,len),0,1);envelope=mix(Math.min(u*u*(3-2*u),tail.remaining[i]/Math.max(.01,next)*.7),1,s.seal194||0)}
   if(tail&&(s.cursive194||0)>.98){const u=clamp(tail.remaining[i]/Math.max(8,s.size*.10),0,1);envelope=.45+.55*(u*u*(3-2*u))}const r0=Math.max(.02*scale,state.contact*scale),r1=Math.max(0,next*envelope*scale);
   const depletion=clamp((state.travel+(st.inkTravel195||0))/Math.max(240,s.size*.5),0,1)*(s.cursive194||0),dryTarget=(s.cursive194||0)>.2?clamp(dryForSpeed(state.velocity,{...s,dry:.75},pressure)*.85+depletion*.025,0,.65):dryForSpeed(state.velocity,s,pressure)*.35;state.dry=mix(state.dry,dryTarget,1-Math.exp(-dt/95));state.color194=s.color;
   state.tip193=sharp194&&tail.remaining[i]<.001;
   state.turn197=turn;const following=st.points[i+1];let tangent=angle;if(following){const fx=following.x*W-x,fy=following.y*H-y;if(Math.hypot(fx,fy)>.02*scale)tangent=angle+Math.atan2(Math.sin(Math.atan2(fy,fx)-angle),Math.cos(Math.atan2(fy,fx)-angle))*.5}state.nextNormal195={x:-Math.sin(tangent),y:Math.cos(tangent)};state.final195=st.done&&(i===st.points.length-1||tail.remaining[i]<.001);
   ribbon192(t,state.pos.x,state.pos.y,r0,x+(state.tip193&&clerical?next*scale*.12:0),y-(state.tip193&&clerical?next*scale*.6:0),r1,s,state.dry,state,scale);
   state.contact=next*envelope;state.r=next;state.pos={x,y};state.angle=Math.atan2(dy,dx);state.travel+=distance;state.last=p;
  }
  if(st.done&&!state.travel&&st.points.length>1)dab(t,state.pos.x,state.pos.y,s.size*((s.seal194||0)>.98?.34*s.fullness:.12)*scale,0,s,0,1,0,state,scale);
  state.ended=!!st.done;return state;
 }
 function render(st,t,W,H,clip=null){if(!st.points?.length)return null;const state=start(st,t,W,H);state.clip=clip;if(st.points.length===1){const s=settings(st.settings);dab(t,state.pos.x,state.pos.y,s.size*((s.seal194||0)>.98?.34*s.fullness:.12)*(W/390),0,s,0,1,0,state,W/390)}return advance(st,state,t,W,H)}
 const api={presets194,profiles194,setCanvasFactory,prepare,settings,lineProfile108,radiusForSpeed,dryForSpeed,start,advance,render};root.ParticleBrush=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);

