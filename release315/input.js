/* v315 input capabilities are local stroke metadata, never a pressure claim for touch/mouse. */
(function(root){
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),finite=Number.isFinite;
 const defaults={modelHz:120,highSpeed:8,lowSpeed:5.5,velocityTauMs:32,nibTauMs:48,bundleCount:32,consumePerWidth:.0025,virtualPressure:true};
 function calibration(settings={}){const c={...defaults,...settings.calibration315};return{modelHz:clamp(+c.modelHz||120,60,240),highSpeed:clamp(+c.highSpeed||8,2,60),lowSpeed:clamp(+c.lowSpeed||5.5,1,50),velocityTauMs:clamp(+c.velocityTauMs||32,8,120),nibTauMs:clamp(+c.nibTauMs||48,12,180),bundleCount:32,consumePerWidth:clamp(+c.consumePerWidth||.0025,.0001,.02),virtualPressure:settings.virtualPressure315!==false&&c.virtualPressure!==false}}
 function capabilities(e){return{deviceType:['pen','touch','mouse'].includes(e.pointerType)?e.pointerType:'unknown',pressureReported:false,pressureConfirmed:false,tiltReported:false,twistReported:false,minPressure:1,maxPressure:0}}
 function point(e,world,last=null,cap=capabilities(e)){
  const type=cap.deviceType,reported=type==='pen'&&finite(e.pressure)&&e.pressure>=0&&e.pressure<=1,rawTime=finite(e.timeStamp)?e.timeStamp:last?.t??0;
  let t=rawTime,timeAdjusted=false;if(last&&t<=last.t){t=last.t+1000/120;timeAdjusted=true}
  const p={...world,t,deviceType:type,schemaVersion:315,pressureSource315:'none',capabilities315:{pressure:false,tilt:false,twist:false}};
  if(timeAdjusted)p.timeAdjusted315=true;
  if(reported){cap.pressureReported=true;if(!world.lift&&(e.buttons??1)!==0){cap.minPressure=Math.min(cap.minPressure,e.pressure);cap.maxPressure=Math.max(cap.maxPressure,e.pressure);if(Math.abs(e.pressure-.5)>.015||cap.maxPressure-cap.minPressure>.015)cap.pressureConfirmed=true}
   if(cap.pressureConfirmed){p.pressure=e.pressure;p.pressureSource315='pen-reported';p.capabilities315.pressure=true}else p.pressureSource315='pen-unconfirmed';
  }else delete p.pressure;
  if(type==='pen'&&finite(e.tiltX)&&finite(e.tiltY)){p.tiltX=clamp(e.tiltX,-90,90);p.tiltY=clamp(e.tiltY,-90,90);p.capabilities315.tilt=cap.tiltReported=true}
  if(type==='pen'&&finite(e.twist)&&e.twist>=0&&e.twist<360){p.twist=e.twist;p.capabilities315.twist=cap.twistReported=true}
  if(type==='pen'&&(e.buttons??1)===0&&!world.lift)p.hover315=true;
  return p;
 }
 function initialInk(settings={}){const ink=clamp((settings.inkLoad315??100)/100,0,1);return{ink,water:clamp(.35+ink*.65,0,1),loads:Array(32).fill(ink)}}
 function inkBefore(strokes,settings={}){for(let i=strokes.length-1;i>=0;i--){const s=strokes[i];if(s.settings?.engineVersion315!==315)continue;if(s.settings.inkEpoch315!==settings.inkEpoch315)break;if(s.endInk315)return structuredClone(s.endInk315);return root.Brush315?.analyze(s).ink||initialInk(settings)}return initialInk(settings)}
 function begin(st,e,{strokes=[],cssPixelsPerUnit=390,screenShortSide=390}={}){st.schemaVersion=315;st.input315=capabilities(e);st.settings={...st.settings,engineVersion315:315,calibration315:calibration(st.settings),inkStart315:inkBefore(strokes,st.settings)};st.input315.cssPixelsPerUnit=cssPixelsPerUnit;st.input315.screenShortSide=screenShortSide;st.points[0]=point(e,st.points[0],null,st.input315);return st}
 root.InkInput315={capabilities,point,calibration,initialInk,inkBefore,begin};
})(typeof globalThis!=='undefined'?globalThis:this);
