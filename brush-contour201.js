/* Brush 202: robust swept-contact union; no self-crossing whole-stroke polygon.
 * Paper-space, timestamp-driven pressure. No generated texture or path displacement.
 * Existing saved strokes retain the previous renderer unless explicitly restyled. */
(function(root){
 const B=root.ParticleBrush,old={start:B.start,advance:B.advance,render:B.render};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t;
 const use=st=>[201,202].includes(st.settings?.contourVersion201)&&(st.settings.regular194||st.settings.running194||st.settings.cursive194);
 function samples(st,W,H){
  const out=[],step=clamp(st.settings.size*.006,.5,1.5),ys=390*H/W;
  let last=null;
  for(const raw of st.points){const p={x:raw.x*390,y:raw.y*ys,t:Number.isFinite(raw.t)?raw.t:((last?.t||0)+16),pressure:raw.pressure};
   if(!last){out.push(p);last=p;continue}const d=Math.hypot(p.x-last.x,p.y-last.y);if(d<.001){last=p;continue}
   const count=Math.ceil(d/step);for(let j=1;j<=count;j++){const u=j/count;out.push({x:mix(last.x,p.x,u),y:mix(last.y,p.y,u),t:mix(last.t,p.t,u),pressure:mix(last.pressure??.5,p.pressure??.5,u)})}last=p;
  }
  // Smooth only a small physical neighbourhood; event count never sets the window.
  const arc=[0];for(let i=1;i<out.length;i++)arc[i]=arc[i-1]+Math.hypot(out[i].x-out[i-1].x,out[i].y-out[i-1].y);
  const window=clamp(st.settings.size*.05,.8,8),smooth=out.map(p=>({...p}));
  for(let i=1;i<out.length-1;i++){let sx=out[i].x,sy=out[i].y,sum=1;
   for(const sign of [-1,1])for(let j=i+sign;j>=0&&j<out.length;j+=sign){const d=Math.abs(arc[j]-arc[i]);if(d>window)break;const w=(1-d/window)*Math.max(.05,(arc[Math.min(j+1,arc.length-1)]-arc[Math.max(0,j-1)])*.5);sx+=out[j].x*w;sy+=out[j].y*w;sum+=w}
   smooth[i].x=sx/sum;smooth[i].y=sy/sum;
  }
  // A tiny initial reversal is finger settling, not a separate hooked stamp.
  const settle=Math.min(st.settings.size*.10,(arc.at(-1)||0)*.06);let end=0;while(end<out.length-1&&arc[end]<settle)end++;
  if(end>1){const a=smooth[0],b=smooth[end];for(let i=1;i<end;i++){const u=arc[i]/Math.max(.001,arc[end]);smooth[i].x=mix(a.x,b.x,u);smooth[i].y=mix(a.y,b.y,u)}}
  const compact=[],raw=[],spacing=clamp(st.settings.size*.025,.7,2.5);let previous=-spacing;
  for(let i=0;i<smooth.length;i++)if(i===0||i===smooth.length-1||arc[i]-previous>=spacing){compact.push(smooth[i]);raw.push(out[i]);previous=arc[i]}
  compact.raw202=raw;return compact;
 }
 function model(st,W,H){
  const s=B.settings(st.settings),pts=samples(st,W,H),n=pts.length,remaining=new Float64Array(n);let length=0;
  for(let i=n-2;i>=0;i--){length+=Math.hypot(pts[i+1].x-pts[i].x,pts[i+1].y-pts[i].y);remaining[i]=length}
  const turnPts=pts.raw202||pts,turnRemaining=new Float64Array(n);for(let i=n-2;i>=0;i--)turnRemaining[i]=turnRemaining[i+1]+Math.hypot(turnPts[i+1].x-turnPts[i].x,turnPts[i+1].y-turnPts[i].y);
  let hook=0;
  // Measure direction over a physical span, independent of event sampling density.
  if(st.done&&(s.regular194||0)>.5)for(let i=1;i<n-1;i++){
   if(turnRemaining[i]>length*.32||turnRemaining[i]<1)continue;let a=i-1,b=i+1;const span=clamp(s.size*.035,2,6);
   while(a>0&&turnRemaining[a]-turnRemaining[i]<span)a--;while(b<n-1&&turnRemaining[i]-turnRemaining[b]<span)b++;
   const ux=turnPts[i].x-turnPts[a].x,uy=turnPts[i].y-turnPts[a].y,vx=turnPts[b].x-turnPts[i].x,vy=turnPts[b].y-turnPts[i].y;
   if((ux*vx+uy*vy)/Math.max(.001,Math.hypot(ux,uy)*Math.hypot(vx,vy))<.45)hook=Math.max(hook,turnRemaining[i]);
  }
  const dx=(pts.at(-1)?.x||0)-(pts[0]?.x||0),dy=(pts.at(-1)?.y||0)-(pts[0]?.y||0),knife=dx>s.size*.3&&dy>s.size*.3;
  if(st.done&&(s.regular194||0)>.5&&n>3&&!hook){let a=n-2;while(a>0&&remaining[a]<Math.min(s.size*.25,length*.15))a--;const b=Math.min(n-1,a+Math.max(1,Math.floor((n-a)*.35))),u=pts[b],v=pts[a],z=pts.at(-1),ux=u.x-v.x,uy=u.y-v.y,vx=z.x-u.x,vy=z.y-u.y;if((ux*vx+uy*vy)/Math.max(.001,Math.hypot(ux,uy)*Math.hypot(vx,vy))<.65)hook=remaining[b]}
  const tail=st.done?(hook||((s.regular194||0)>.5?(knife?Math.min(s.size*.32,length*.22):0):Math.min(s.size*.30,length*.18))):0;
  let velocity=n>1?Math.hypot(pts[1].x-pts[0].x,pts[1].y-pts[0].y)/Math.max(.05,pts[1].t-pts[0].t):0,radius=0,travel=0,heading=null;const points=[];
  for(let i=0;i<n;i++){
   const p=pts[i],q=pts[Math.max(0,i-1)],next=pts[Math.min(n-1,i+1)],d=Math.hypot(p.x-q.x,p.y-q.y),dt=Math.max(.05,p.t-q.t);
   let a=Math.max(0,i-1),b=Math.min(n-1,i+1);const tangentSpan=clamp(s.size*.06,1,9);
   while(a>0&&remaining[a]-remaining[i]<tangentSpan)a--;while(b<n-1&&remaining[i]-remaining[b]<tangentSpan)b++;
   const tx=pts[b].x-pts[a].x,ty=pts[b].y-pts[a].y,mag=Math.hypot(tx,ty)||1,angle=Math.atan2(ty,tx);
   if(i===1)velocity=d/dt;else if(i>1)velocity=mix(velocity,d/dt,1-Math.exp(-dt/32));
   const pressure=st.hasPressure&&Number.isFinite(p.pressure)?clamp(p.pressure,0,1):null;
   let target=B.radiusForSpeed(velocity,s,pressure),regular=s.regular194||0;
   if(heading===null)heading=angle;else heading+=Math.atan2(Math.sin(angle-heading),Math.cos(angle-heading))*(1-Math.exp(-d/Math.max(2,s.size*.055)));
   target=mix(target,s.size*(.115+.205*Math.abs(Math.sin(heading)))*s.fullness,regular);
   if(!i)radius=target;else radius+=clamp((target-radius)*(1-Math.exp(-d/Math.max(1,s.size*.025))),-d*.30,d*.40);
   let r=radius;
   const expressive=(s.running194||0)+(s.cursive194||0),opening=Math.min(s.size*.14,length*.12);
   if(opening>0){const u=clamp(travel/opening,0,1);r*=mix(1,.08+.92*u*u*(3-2*u),expressive)}
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
  else {
   // Same-winding swept contacts form a union in ONE nonzero fill. This avoids
   // self-crossing outline holes and applies opacity once even at intersections.
   const pts=m.points,radii=pts.map(p=>p.pressure*s.size),drawCircle=(p,r)=>{if(r<.01)return;t.moveTo((p[0]+r)*scale,p[1]*scale);t.arc(p[0]*scale,p[1]*scale,r*scale,0,Math.PI*2);t.closePath()};
   const normals=pts.map((p,i)=>{
    const a=p.vector,b=pts[Math.min(i+1,pts.length-1)].vector;let x=a[1]+b[1],y=-a[0]-b[0],mag=Math.hypot(x,y);
    if(mag<.1){x=a[1];y=-a[0];mag=1}return [x/mag,y/mag];
   });
   const triangle=(a,b,c)=>{if((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])<0)[b,c]=[c,b];t.moveTo(a[0]*scale,a[1]*scale);t.lineTo(b[0]*scale,b[1]*scale);t.lineTo(c[0]*scale,c[1]*scale);t.closePath()};
   t.beginPath();
   for(let i=1;i<pts.length;i++){
    const a=pts[i-1].point,b=pts[i].point,na=normals[i-1],nb=normals[i],ra=radii[i-1],rb=radii[i];
    const al=[a[0]+na[0]*ra,a[1]+na[1]*ra],ar=[a[0]-na[0]*ra,a[1]-na[1]*ra],bl=[b[0]+nb[0]*rb,b[1]+nb[1]*rb],br=[b[0]-nb[0]*rb,b[1]-nb[1]*rb];
    // Shared cross sections, positive triangles even when a tight turn inverts
    // the inner edge. Negative winding must never cancel ink at a reversal.
    triangle(al,ar,bl);triangle(ar,br,bl);
   }
   const endCap=(i)=>{const p=pts[i].point,v=pts[i].vector,r=radii[i];if(r<.01)return;const angle=Math.atan2(-v[1],-v[0]);t.moveTo(p[0]*scale+Math.cos(angle)*r*.3*scale,p[1]*scale+Math.sin(angle)*r*.3*scale);t.ellipse(p[0]*scale,p[1]*scale,r*.3*scale,r*scale,angle,0,Math.PI*2);t.closePath()};
   if((s.regular194||0)>.5){endCap(0);if(!m.tail)endCap(pts.length-1)}else {drawCircle(pts[0].point,radii[0]);drawCircle(pts.at(-1).point,radii.at(-1))}
   for(let i=1;i<pts.length-1;i++){
    const u=pts[i].vector,v=pts[i+1].vector;
    // Only a real directional corner needs a contact join. Dense round stamping
    // would waste raster work and turn small speed fluctuations into beads.
    if(u[0]*v[0]+u[1]*v[1]<.96)drawCircle(pts[i].point,radii[i]);
   }
   t.fill('nonzero');
  }
  t.restore();state.index=st.points.length;state.contact=m.contact;state.travel=m.length;state.ended=!!st.done;return state;
 }
 B.start=(st,t,W,H)=>use(st)?{index:0,opacity:t.globalAlpha??1,contact:0,travel:0,contour201:true}:old.start(st,t,W,H);
 B.advance=(st,state,t,W,H)=>state.contour201?draw(st,state,t,W,H):old.advance(st,state,t,W,H);
 B.render=(st,t,W,H,clip)=>use(st)?draw(st,B.start(st,t,W,H),t,W,H):old.render(st,t,W,H,clip);
 B.contourModel201=model;
 for(const p of Object.values(B.presets194))p.contourVersion201=202;
 const profile=B.lineProfile108;B.lineProfile108=value=>({...profile(value),contourVersion201:202});
})(typeof globalThis!=='undefined'?globalThis:this);
