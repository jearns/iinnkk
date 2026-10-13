/* Perfect-Freehand 1.2.3 (MIT): perfect-freehand201.LICENSE.
 * Paper-space, timestamp-driven pressure. No generated texture or path displacement.
 * Existing saved strokes retain the previous renderer unless explicitly restyled. */
(function(root){
 const B=root.ParticleBrush,PF=root.PerfectFreehand201,old={start:B.start,advance:B.advance,render:B.render};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t;
 const use=st=>st.settings?.contourVersion201===201&&(st.settings.regular194||st.settings.running194||st.settings.cursive194);
 function samples(st,W,H){
  const out=[],step=clamp(st.settings.size*.006,.5,1.5),ys=390*H/W;
  let last=null;
  for(const raw of st.points){const p={x:raw.x*390,y:raw.y*ys,t:Number.isFinite(raw.t)?raw.t:((last?.t||0)+16),pressure:raw.pressure};
   if(!last){out.push(p);last=p;continue}const d=Math.hypot(p.x-last.x,p.y-last.y);if(d<.001){last=p;continue}
   const count=Math.ceil(d/step);for(let j=1;j<=count;j++){const u=j/count;out.push({x:mix(last.x,p.x,u),y:mix(last.y,p.y,u),t:mix(last.t,p.t,u),pressure:mix(last.pressure??.5,p.pressure??.5,u)})}last=p;
  }return out;
 }
 function model(st,W,H){
  const s=B.settings(st.settings),pts=samples(st,W,H),n=pts.length,remaining=new Float64Array(n);let length=0;
  for(let i=n-2;i>=0;i--){length+=Math.hypot(pts[i+1].x-pts[i].x,pts[i+1].y-pts[i].y);remaining[i]=length}
  let hook=0;
  // Measure direction over a physical span, independent of event sampling density.
  if(st.done&&(s.regular194||0)>.5)for(let i=1;i<n-1;i++){
   if(remaining[i]>length*.32||remaining[i]<1)continue;let a=i-1,b=i+1;const span=clamp(s.size*.035,2,6);
   while(a>0&&remaining[a]-remaining[i]<span)a--;while(b<n-1&&remaining[i]-remaining[b]<span)b++;
   const ux=pts[i].x-pts[a].x,uy=pts[i].y-pts[a].y,vx=pts[b].x-pts[i].x,vy=pts[b].y-pts[i].y;
   if((ux*vx+uy*vy)/Math.max(.001,Math.hypot(ux,uy)*Math.hypot(vx,vy))<.45)hook=Math.max(hook,remaining[i]);
  }
  const dx=(pts.at(-1)?.x||0)-(pts[0]?.x||0),dy=(pts.at(-1)?.y||0)-(pts[0]?.y||0),knife=dx>s.size*.3&&dy>s.size*.3;
  const tail=st.done?(hook||((s.regular194||0)>.5?(knife?Math.min(s.size*.32,length*.22):0):Math.min(s.size*.15,length*.13))):0;
  let velocity=n>1?Math.hypot(pts[1].x-pts[0].x,pts[1].y-pts[0].y)/Math.max(.05,pts[1].t-pts[0].t):0,radius=0,travel=0;const points=[];
  for(let i=0;i<n;i++){
   const p=pts[i],q=pts[Math.max(0,i-1)],next=pts[Math.min(n-1,i+1)],d=Math.hypot(p.x-q.x,p.y-q.y),dt=Math.max(.05,p.t-q.t);
   const tx=i?p.x-q.x:next.x-p.x,ty=i?p.y-q.y:next.y-p.y,mag=Math.hypot(tx,ty)||1,angle=Math.atan2(ty,tx);
   if(i===1)velocity=d/dt;else if(i>1)velocity=mix(velocity,d/dt,1-Math.exp(-dt/32));
   const pressure=st.hasPressure&&Number.isFinite(p.pressure)?clamp(p.pressure,0,1):null;
   let target=B.radiusForSpeed(velocity,s,pressure),regular=s.regular194||0;
   target=mix(target,s.size*(.115+.205*Math.abs(Math.sin(angle)))*s.fullness,regular);
   if(!i)radius=target;else radius+=clamp(target-radius,-d*.48,d*.6);
   let r=radius;
   if(tail&&remaining[i]<tail){const u=clamp(remaining[i]/tail,0,1);r*=Math.pow(u,.85);if(hook)r=Math.min(r,remaining[i]*.75)}
   // PF receives measured pressure, not its point-spacing-based simulation.
   points.push({point:[p.x,p.y],pressure:clamp(r/s.size,.0001,1),distance:d,vector:[-tx/mag,-ty/mag],runningLength:travel+=d});
  }
  if(points.length>1)points[0].vector=points[1].vector;
  return {points,length,hook,tail,contact:tail?0:radius};
 }
 function draw(st,state,t,W,H){
  if(!st.points?.length)return state;const s=B.settings(st.settings),m=model(st,W,H),scale=W/390;
  t.save();t.fillStyle=s.color;t.globalAlpha=state.opacity??1;
  if(m.length<.5){const p=st.points[0];t.beginPath();t.ellipse(p.x*W,p.y*H,s.size*.12*scale,s.size*.14*scale,Math.PI/4,0,Math.PI*2);t.fill()}
  else {const outline=PF.getStrokeOutlinePoints(m.points,{size:s.size,thinning:1,simulatePressure:false,smoothing:.015,start:{cap:(s.regular194||0)<.5},end:{cap:!m.tail},last:!!st.done});
   if(outline.length){t.beginPath();t.moveTo(outline[0][0]*scale,outline[0][1]*scale);for(let i=1;i<outline.length;i++)t.lineTo(outline[i][0]*scale,outline[i][1]*scale);t.closePath();t.fill()}
  }
  t.restore();state.index=st.points.length;state.contact=m.contact;state.travel=m.length;state.ended=!!st.done;return state;
 }
 B.start=(st,t,W,H)=>use(st)?{index:0,opacity:t.globalAlpha??1,contact:0,travel:0,contour201:true}:old.start(st,t,W,H);
 B.advance=(st,state,t,W,H)=>state.contour201?draw(st,state,t,W,H):old.advance(st,state,t,W,H);
 B.render=(st,t,W,H,clip)=>use(st)?draw(st,B.start(st,t,W,H),t,W,H):old.render(st,t,W,H,clip);
 B.contourModel201=model;
 for(const p of Object.values(B.presets194))p.contourVersion201=201;
 const profile=B.lineProfile108;B.lineProfile108=value=>({...profile(value),contourVersion201:201});
})(typeof globalThis!=='undefined'?globalThis:this);
