import React,{useMemo,useRef,useLayoutEffect,useEffect}from'react';
import{AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig,delayRender,continueRender,cancelRender,interpolate,Easing}from'remotion';
import{Audio}from'@remotion/media';
import{OUTRO_SLOGAN,OUTRO_SITE,videoTimeline}from'./timing.mjs';
import{scenePlan,sceneFrame,clamp}from'./scene-plan.mjs';
import{musicTrack,musicSource}from'./music.mjs';
let font294;function loadBrandFont294(){return font294||(font294=new FontFace('ShoubiFilm294',`url("${staticFile('release294/film-brand.woff')}")`).load().then(font=>document.fonts.add(font)));}
function paintImage(ctx,image,w,h,scene,factor=1){
 const fit=Math.min(w/image.width,h/image.height),scale=fit*scene.scale*factor;
 const cx=scene.scale>1?scene.region.x:.5,cy=scene.scale>1?scene.region.y:.5;
 const maxX=Math.max(0,(image.width*scale-w)/2),maxY=Math.max(0,(image.height*scale-h)/2);
 const x=Math.max(-maxX,Math.min(maxX,(.5-cx)*image.width*scale)),y=Math.max(-maxY,Math.min(maxY,(.5-cy)*image.height*scale));
 ctx.drawImage(image,(w-image.width*scale)/2+x,(h-image.height*scale)/2+y,image.width*scale,image.height*scale);
}
function FilmCanvas({surface,frame,timing,view,enter,width,height,fps}){
 const ref=useRef(null),layers=useRef({}),handle=useMemo(()=>delayRender('Original ink frame'),[frame,width,height]);
 useLayoutEffect(()=>{
  let disposed=false,finished=false;const finish=()=>{if(!finished){finished=true;continueRender(handle)}};
  const copy=(image,key)=>{const c=layers.current[key]||(layers.current[key]=document.createElement('canvas'));c.width=image.width;c.height=image.height;c.getContext('2d').drawImage(image,0,0);return c};
  const paint=async()=>{
   if(!surface||surface.closed)return;
   const isCover=timing.phase==='cover',hero=view.scene.kind==='hero',current=isCover?1:view.progress;
   let backdrop,previous;
   if(view.mode==='dolly'&&!isCover&&view.scene.kind==='writing'){const im=await surface.draw(current,{complete:true});if(disposed)return;backdrop=copy(im,'backdrop')}
   if(view.mode==='dissolve'&&view.previous&&view.blend>0&&!isCover){const im=await(surface.sequence294&&view.previous.kind==='hero'?surface.hero():surface.draw(view.previous.end));if(disposed)return;previous=copy(im,'previous')}
   const image=await(surface.sequence294&&(isCover||hero)?surface.hero():surface.draw(current));if(disposed)return;
   const ctx=ref.current.getContext('2d');ctx.resetTransform();ctx.globalAlpha=1;ctx.fillStyle='#08090b';ctx.fillRect(0,0,width,height);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
   if(backdrop){ctx.save();ctx.globalAlpha=.24;const k=Math.max(width/backdrop.width,height/backdrop.height)*(1.12-.08*view.t);ctx.drawImage(backdrop,(width-backdrop.width*k)/2,(height-backdrop.height*k)/2,backdrop.width*k,backdrop.height*k);ctx.restore()}
   if(previous){ctx.save();ctx.globalAlpha=view.blend;paintImage(ctx,previous,width,height,view.previous);ctx.restore()}
   ctx.save();if(!isCover&&hero){ctx.globalAlpha=enter;ctx.translate(0,(1-enter)*80*Math.min(width,height)/1080)}
   if(previous)ctx.globalAlpha*=1-view.blend;
   let shot=isCover?{scale:1,region:{x:.5,y:.5}}:view.scene;if(!isCover&&hero)shot={...shot,scale:1.045-.045*enter};
   if(backdrop){ctx.beginPath();ctx.rect(width*.055,height*.055,width*.89,height*.89);ctx.clip()}
   paintImage(ctx,image,width,height,shot,isCover?1:view.factor);ctx.restore();
   if(!isCover&&view.shade>0){ctx.save();ctx.globalAlpha=view.shade;const g=ctx.createLinearGradient(0,0,width,height);g.addColorStop(0,'#050608');g.addColorStop(1,view.mode==='shadow'?'#17191e':'#050608');ctx.fillStyle=g;ctx.fillRect(0,0,width,height);ctx.restore()}
  };paint().then(finish,error=>{if(!disposed)cancelRender(error);finish()});return()=>{disposed=true;finish()};
 },[frame,handle,surface,width,height,view.mode,view.factor,view.progress,enter]);
 return <canvas ref={ref} width={width} height={height} data-canvas293="" data-scene293={view.scene.id} data-mode293={view.mode} data-progress293={timing.phase==='cover'?1:view.progress} style={{width:'100%',height:'100%',display:'block'}}/>;
}
export const ShoubiShowcase=({surface,artwork,title,signature,music='none',musicUrl295=null,transition='shadow'})=>{
 const brandFontHandle=useMemo(()=>delayRender('Brand typography'),[]);useEffect(()=>{loadBrandFont294().then(()=>continueRender(brandFontHandle),cancelRender)},[]);
 const frame=useCurrentFrame(),{fps,durationInFrames,width,height}=useVideoConfig();
 const timing=videoTimeline(frame,durationInFrames,fps),plan=useMemo(()=>scenePlan(durationInFrames,fps,surface?.chapters||[]),[durationInFrames,fps,surface]);
 const view=sceneFrame(frame,plan,fps,transition),brand=timing.phase==='intro'||timing.phase==='outro';
 const enter=interpolate(frame-plan.intro,[0,Math.min(fps*1.3,plan.scenes[0].to-plan.intro)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)});
 const unit=Math.min(width,height)/1080;
 const brandAlpha=timing.phase==='intro'?Math.min(clamp((frame-1)/(fps*.15)),clamp((plan.intro-frame)/(fps*.2))):clamp((frame-plan.outro)/(fps*.2));
 const track=musicTrack(music);
 return <AbsoluteFill data-phase291={timing.phase} data-frame290={frame} style={{direction:'ltr',backgroundColor:'#08090b',fontFamily:'ShoubiFilm294,-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif'}}>
  {(track||musicUrl295)&&<Audio loop src={musicUrl295||staticFile(musicSource(music,durationInFrames/fps))} premountFor={fps} volume={1}/>}
  {!brand&&(!surface&&artwork?<Img src={/^(https?:|data:|blob:)/.test(artwork)?artwork:staticFile(artwork)} style={{width:'100%',height:'100%',objectFit:'contain'}}/>:<FilmCanvas surface={surface} frame={frame} timing={timing} view={view} enter={enter} width={width} height={height} fps={fps}/>)}
  {timing.phase!=='cover'&&<>
   {!brand&&<div style={{position:'absolute',left:0,right:0,bottom:0,height:90*unit,background:'linear-gradient(transparent,rgba(0,0,0,.5))'}}/>}
   <div data-brand294="" data-brand-phase294={timing.phase} style={{position:'absolute',left:'50%',top:timing.phase==='intro'?height/2:timing.phase==='outro'?interpolate(frame,[plan.outro,plan.outro+fps*.75],[height-46*unit,height/2-70*unit],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)}):interpolate(frame,[plan.intro,plan.intro+fps*.75],[height/2,height-46*unit],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)}),transform:'translate(-50%,-50%)',display:'flex',alignItems:'center',gap:18*unit,color:'#f5f5f7',whiteSpace:'nowrap',opacity:timing.phase==='intro'?clamp((frame-1)/(fps*.2)):1}}>
    <Img data-brand291="" src={staticFile('apple-touch-icon.png')} style={{width:(timing.phase==='intro'?96:timing.phase==='outro'?interpolate(frame,[plan.outro,plan.outro+fps*.75],[34,96],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)}):interpolate(frame,[plan.intro,plan.intro+fps*.75],[96,34],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)}))*unit,objectFit:'contain'}}/>
    <span style={{fontSize:(timing.phase==='intro'?42:timing.phase==='outro'?interpolate(frame,[plan.outro,plan.outro+fps*.75],[24,42],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}):interpolate(frame,[plan.intro,plan.intro+fps*.75],[42,24],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}))*unit,letterSpacing:3*unit}}>手筆</span>
   </div>
   {timing.phase==='outro'&&<div data-brand-card291="" style={{position:'absolute',left:0,right:0,top:height/2+16*unit,textAlign:'center',color:'#f5f5f7'}}><div data-slogan291="" style={{fontSize:38*unit,lineHeight:1.6,opacity:interpolate(frame,[plan.outro+fps*.65,plan.outro+fps*1.15],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),translate:`0 ${interpolate(frame,[plan.outro+fps*.65,plan.outro+fps*1.15],[12,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})*unit}px`}}>{OUTRO_SLOGAN}</div><div data-site292="" style={{marginTop:16*unit,fontSize:30*unit,letterSpacing:2*unit,opacity:interpolate(frame,[plan.outro+fps*.95,plan.outro+fps*1.5],[0,.6],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{OUTRO_SITE}</div></div>}
  </>}
 </AbsoluteFill>;
};
