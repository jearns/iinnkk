export const TITLE_EFFECTS295=[['writing','逐笔书写'],['letters','逐字浮现'],['train','主体尾迹 · 逐字显字'],['light','光幕横扫'],['ink','墨晕聚合'],['focus','虚实入镜'],['rise','浮光升起'],['shutter','电影开幕']];
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>1-(1-clamp(x))**3;
export function titleFrame296(time,{start=0,end=8,duration=2.6,track=[],letterCount=1}={}){if(time<start||time>=end)return{visible:false,progress:0,letters:0};const p=clamp((time-start)/Math.max(.1,Math.min(duration,end-start))),n=Math.max(1,Math.min(40,Math.round(letterCount)||1));let edge=null;if(track.length){const before=track.filter(p=>p.t<=time).at(-1)||track[0],after=track.find(p=>p.t>time)||before,k=after.t===before.t?0:clamp((time-before.t)/(after.t-before.t));edge=before.x+(after.x-before.x)*k}return{visible:true,progress:p,letters:p*n,edge};}
export function drawTitle295(ctx,layer,width,height,time,options={}){
 const state=titleFrame296(time,options);if(!state.visible)return;const effect=options.effect||'letters';if(effect==='train'&&!(options.track?.length>1))return;const p=state.progress,q=ease(p);ctx.save();
 if(effect==='letters'||effect==='train'){
  const box=options.bounds||{x:0,y:0,w:1,h:1},count=Math.max(1,Math.min(40,Math.round(options.letterCount)||1)),regions=options.regions?.length===count?options.regions:Array.from({length:count},(_,i)=>({x:box.x+box.w*i/count,y:box.y,w:box.w/count,h:box.h}));
  regions.forEach((r,i)=>{const rtl=options.track?.length>1&&options.track.at(-1).x<options.track[0].x;const alpha=effect==='train'&&state.edge!=null?clamp((rtl?(r.x-state.edge):(state.edge-r.x-r.w))/Math.max(.012,r.w*.25)):clamp(state.letters-i);if(!alpha)return;ctx.save();ctx.beginPath();ctx.rect(r.x*width,r.y*height,r.w*width+1,r.h*height+1);ctx.clip();ctx.globalAlpha=ease(alpha);ctx.drawImage(layer,0,0,width,height);ctx.restore()});
 }else if(effect==='light'){ctx.beginPath();ctx.rect(0,0,width*q,height);ctx.clip();ctx.globalAlpha=clamp(p*5);ctx.drawImage(layer,0,0,width,height)}
 else if(effect==='ink'){ctx.beginPath();ctx.ellipse(width/2,height/2,width*.75*q,height*.8*q,0,0,Math.PI*2);ctx.clip();ctx.globalAlpha=q;ctx.filter=`blur(${(1-q)*14}px)`;ctx.drawImage(layer,0,0,width,height)}
 else if(effect==='focus'){const scale=1.1-.1*q;ctx.translate(width/2,height/2);ctx.scale(scale,scale);ctx.globalAlpha=q;ctx.filter=`blur(${(1-q)*18}px)`;ctx.drawImage(layer,-width/2,-height/2,width,height)}
 else if(effect==='rise'){ctx.globalAlpha=q;ctx.translate(0,(1-q)*height*.055);ctx.drawImage(layer,0,0,width,height)}
 else if(effect==='shutter'){ctx.beginPath();ctx.rect(0,height*(1-q)/2,width,height*q);ctx.clip();ctx.globalAlpha=clamp(p*4);ctx.drawImage(layer,0,0,width,height)}else ctx.drawImage(layer,0,0,width,height);ctx.restore();
}
