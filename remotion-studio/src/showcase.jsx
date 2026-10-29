import React,{useMemo,useRef,useLayoutEffect}from'react';
import{AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig,delayRender,continueRender,interpolate,Easing}from'remotion';
import{Audio}from'@remotion/media';
import{OUTRO_SLOGAN,OUTRO_SITE,videoTimeline}from'./timing.mjs';
import{scenePlan,sceneFrame,clamp}from'./scene-plan.mjs';
import{musicTrack,musicSource}from'./music.mjs';
function paintImage(ctx,image,w,h,scene,factor=1){
 const fit=Math.min(w/image.width,h/image.height),scale=fit*scene.scale*factor;
 const cx=scene.scale>1?scene.region.x:.5,cy=scene.scale>1?scene.region.y:.5;
 const maxX=Math.max(0,(image.width*scale-w)/2),maxY=Math.max(0,(image.height*scale-h)/2);
 const x=Math.max(-maxX,Math.min(maxX,(.5-cx)*image.width*scale)),y=Math.max(-maxY,Math.min(maxY,(.5-cy)*image.height*scale));
 ctx.drawImage(image,(w-image.width*scale)/2+x,(h-image.height*scale)/2+y,image.width*scale,image.height*scale);
}
function FilmCanvas({surface,frame,timing,view,enter,width,height,fps}){
 const ref=useRef(null),handle=useMemo(()=>delayRender('Original ink frame'),[frame,width,height]);
 useLayoutEffect(()=>{
  const ctx=ref.current.getContext('2d');ctx.fillStyle='#08090b';ctx.fillRect(0,0,width,height);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  if(surface&&!surface.closed){
   const isCover=timing.phase==='cover',hero=view.scene.kind==='hero';
   const current=isCover?1:view.progress;
   if(view.mode==='dolly'&&!isCover&&view.scene.kind==='writing'){
    ctx.save();ctx.globalAlpha=.24;const im=surface.draw(1),k=Math.max(width/im.width,height/im.height)*(1.12-.08*view.t);ctx.drawImage(im,(width-im.width*k)/2,(height-im.height*k)/2,im.width*k,im.height*k);ctx.restore();
   }
   if(view.mode==='dissolve'&&view.previous&&view.blend>0&&!isCover){ctx.save();ctx.globalAlpha=view.blend;paintImage(ctx,surface.draw(view.previous.end),width,height,view.previous);ctx.restore();}
   ctx.save();
   if(!isCover&&hero){ctx.globalAlpha=enter;ctx.translate(0,(1-enter)*80*Math.min(width,height)/1080);}
   if(!isCover&&view.mode==='dissolve'&&view.previous)ctx.globalAlpha*=1-view.blend;
   let shot=isCover?{scale:1,region:{x:.5,y:.5}}:view.scene;
   if(!isCover&&hero)shot={...shot,scale:1.045-.045*enter};
   if(view.mode==='dolly'&&!isCover&&view.scene.kind==='writing'){ctx.beginPath();ctx.rect(width*.055,height*.055,width*.89,height*.89);ctx.clip();}
   paintImage(ctx,surface.draw(current),width,height,shot,isCover?1:view.factor);ctx.restore();
   if(!isCover&&view.shade>0){ctx.save();ctx.globalAlpha=view.shade;const g=ctx.createLinearGradient(0,0,width,height);g.addColorStop(0,'#050608');g.addColorStop(1,view.mode==='shadow'?'#17191e':'#050608');ctx.fillStyle=g;ctx.fillRect(0,0,width,height);ctx.restore();}
  }
  continueRender(handle);
 },[frame,handle,surface,width,height,view.mode,view.factor,view.progress,enter]);
 return <canvas ref={ref} width={width} height={height} data-canvas293="" data-scene293={view.scene.id} data-mode293={view.mode} data-progress293={timing.phase==='cover'?1:view.progress} style={{width:'100%',height:'100%',display:'block'}}/>;
}
export const ShoubiShowcase=({surface,artwork,title,signature,music='none',transition='shadow'})=>{
 const frame=useCurrentFrame(),{fps,durationInFrames,width,height}=useVideoConfig();
 const timing=videoTimeline(frame,durationInFrames,fps),plan=useMemo(()=>scenePlan(durationInFrames,fps,surface?.chapters||[]),[durationInFrames,fps,surface]);
 const view=sceneFrame(frame,plan,fps,transition),brand=timing.phase==='intro'||timing.phase==='outro';
 const enter=interpolate(frame-plan.intro,[0,Math.min(fps*1.3,plan.scenes[0].to-plan.intro)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)});
 const unit=Math.min(width,height)/1080;
 const brandAlpha=timing.phase==='intro'?Math.min(clamp((frame-1)/(fps*.15)),clamp((plan.intro-frame)/(fps*.2))):clamp((frame-plan.outro)/(fps*.2));
 const track=musicTrack(music);
 return <AbsoluteFill data-phase291={timing.phase} data-frame290={frame} style={{direction:'ltr',backgroundColor:'#08090b',fontFamily:'-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif'}}>
  {track&&<Audio src={staticFile(musicSource(music,durationInFrames/fps))} premountFor={fps} volume={1}/>}
  {brand?<AbsoluteFill data-brand-card291="" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',opacity:brandAlpha}}>
   {timing.phase==='outro'&&<div data-slogan291="" style={{fontSize:38*unit,color:'#f5f5f7',letterSpacing:2*unit}}>{OUTRO_SLOGAN}</div>}
  </AbsoluteFill>:<>
   {!surface&&artwork?<Img src={/^(https?:|data:|blob:)/.test(artwork)?artwork:staticFile(artwork)} style={{width:'100%',height:'100%',objectFit:'contain'}}/>:<FilmCanvas surface={surface} frame={frame} timing={timing} view={view} enter={enter} width={width} height={height} fps={fps}/>}

  </>}
  {timing.phase!=='cover'&&<div data-footer293="" style={{position:'absolute',left:0,right:0,bottom:0,padding:`${24*unit}px ${40*unit}px ${22*unit}px`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6*unit,background:'linear-gradient(transparent,rgba(0,0,0,.6))',color:'#f5f5f7'}}><div style={{display:'flex',alignItems:'center',gap:12*unit}}><Img data-brand291="" src={staticFile('apple-touch-icon.png')} style={{width:34*unit,height:34*unit,objectFit:'contain'}}/><span style={{fontSize:24*unit,letterSpacing:3*unit}}>手筆</span></div><div data-site292="" style={{fontSize:18*unit,letterSpacing:1.5*unit,opacity:.6,textAlign:'center'}}>{OUTRO_SITE}</div></div>}
 </AbsoluteFill>;
};
