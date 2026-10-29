// Deterministic canvas animation: identical timestamps produce identical preview/export frames.
export const TITLE_EFFECTS295=[['writing','逐笔书写'],['train','列车掠过 · 尾迹显字'],['light','光幕横扫'],['ink','墨晕聚合'],['focus','虚实入镜'],['rise','浮光升起'],['shutter','电影开幕']];
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>1-Math.pow(1-clamp(x),3);
export function drawTitle295(ctx,layer,width,height,time,{effect='light',duration=2.6}={}){
 const p=clamp(time/Math.max(.2,duration)),q=ease(p);ctx.save();
 if(effect==='train'){
  // The train's trailing edge reveals the calligraphy; the full train exits to the right.
  const span=width*1.45,tail=-span+(width+span)*q;
  ctx.save();ctx.beginPath();ctx.rect(0,0,Math.max(0,tail),height);ctx.clip();ctx.globalAlpha=clamp(p*5);ctx.drawImage(layer,0,0,width,height);ctx.restore();
  if(p<1){const h=Math.min(height*.2,width*.14),y=height*.53;ctx.save();ctx.fillStyle='#171c22';ctx.shadowColor='#0009';ctx.shadowBlur=12;ctx.beginPath();ctx.roundRect(tail,y,span,h,[h*.12,h*.55,h*.1,h*.1]);ctx.fill();const gleam=ctx.createLinearGradient(0,y,0,y+h);gleam.addColorStop(0,'#687580');gleam.addColorStop(.45,'#222b34');gleam.addColorStop(.55,'#151c22');gleam.addColorStop(1,'#35434e');ctx.fillStyle=gleam;ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#acc5d1';for(let x=tail+width*.04;x<tail+span-h*.6;x+=h*.65){ctx.fillRect(x,y+h*.2,h*.43,h*.3);ctx.fillStyle='#0c1116';ctx.fillRect(x+h*.46,y+h*.08,h*.03,h*.8);ctx.fillStyle='#acc5d1'}ctx.fillStyle='#0b0e13';for(let x=tail+h*.3;x<tail+span-h*.3;x+=h*1.3){ctx.beginPath();ctx.arc(x,y+h,h*.11,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#ffebba';ctx.fillRect(tail+span-h*.2,y+h*.55,h*.13,h*.12);ctx.restore()}
 }else if(effect==='light'){
  ctx.beginPath();ctx.rect(0,0,width*q,height);ctx.clip();ctx.globalAlpha=clamp(p*5);ctx.drawImage(layer,0,0,width,height);if(p<1){const g=ctx.createLinearGradient(width*q-width*.1,0,width*q,0);g.addColorStop(0,'#fff0');g.addColorStop(1,'#f8e4bca0');ctx.fillStyle=g;ctx.fillRect(width*q-width*.1,0,width*.1,height)}
 }else if(effect==='ink'){
  ctx.beginPath();ctx.ellipse(width*.5,height*.5,width*.75*q,height*.8*q,0,0,Math.PI*2);ctx.clip();ctx.globalAlpha=q;ctx.filter=`blur(${(1-q)*14}px)`;ctx.drawImage(layer,0,0,width,height);
 }else if(effect==='focus'){
  const scale=1.1-.1*q;ctx.translate(width/2,height/2);ctx.scale(scale,scale);ctx.globalAlpha=q;ctx.filter=`blur(${(1-q)*18}px)`;ctx.drawImage(layer,-width/2,-height/2,width,height);
 }else if(effect==='rise'){
  ctx.globalAlpha=q;ctx.translate(0,(1-q)*height*.055);ctx.drawImage(layer,0,0,width,height);
 }else if(effect==='shutter'){
  ctx.beginPath();ctx.rect(0,height*(1-q)/2,width,height*q);ctx.clip();ctx.globalAlpha=clamp(p*4);ctx.drawImage(layer,0,0,width,height);
 }else ctx.drawImage(layer,0,0,width,height);ctx.restore();
}
