/* Compact centered export footer, independent of the available mounting mat. */
(function(root){
 function fit(ctx,text,size,width){ctx.font=size+'px system-ui,-apple-system,sans-serif';return size*Math.min(1,width/Math.max(1,ctx.measureText(text).width))}
 function draw(ctx,{x=0,y=0,width,height,qr=true,credit=true,idea=null,attribution196='',writingOriginal211='',writingParameters262='',qrUrl262='https://iinnkk.me',paper='#f3ead8'}){
  const cx=x+width/2,pad=height*.08,available=width*.9,caption='手筆·以手为笔·iinnkk.me·随时写字',hasIdea=!!idea?.name||!!idea?.backgroundCaption186;let side=Math.min(width*.13,height*.45),font=Math.min(width*.024,height*.078),originalLines211=[];
  function lines211(text){ctx.font=(font*.9)+'px system-ui,-apple-system,sans-serif';const lines=[];let line='';for(const char of text){if(char==='\n'){lines.push(line);line='';continue}if(line&&ctx.measureText(line+char).width>available){lines.push(line);line=char}else line+=char}if(line)lines.push(line);return lines}
  function measure211(){originalLines211=writingOriginal211?lines211('书写原文：'+writingOriginal211):[];return(attribution196?font*1.65:0)+(qr?side+font*1.65:0)+(credit?font*1.65:0)+(hasIdea?font*(idea.name?2.6:1.3):0)+originalLines211.length*font*1.3+(writingParameters262?font*1.45:0)}
  let rows=measure211();for(let i=0;i<12&&rows>height-pad*2;i++){const k=Math.min(.95,(height-pad*2)/rows);font*=k;side*=k;rows=measure211()}const top=y+(height-rows)/2;let cursor=top;
  ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#594c3a';
  let seal;if(qr||credit){seal=root.SealEngine?.stamp({text:'手',font:'yishan',type:'yin',color:'#b62118',rough:.12,fontLoaded:!!root.yiShanBeiSealReady});if(!seal){ctx.restore();throw Error('篆书印章组件尚未就绪')}}
  if(attribution196){ctx.font=fit(ctx,attribution196,font,available)+'px system-ui,-apple-system,sans-serif';ctx.fillText(attribution196,cx,cursor+font*.7,available);cursor+=font*1.65}
  for(const text of originalLines211){ctx.fillStyle='#594c3a';ctx.font=(font*.9)+'px system-ui,-apple-system,sans-serif';ctx.fillText(text,cx,cursor+font*.65,available);cursor+=font*1.3}
  if(qr){const headline='扫描二维码，留下你的大手筆！',big=fit(ctx,headline,font*1.25,available);ctx.font=big+'px system-ui,-apple-system,sans-serif';ctx.fillText(headline,cx,cursor+font*.7,available);cursor+=font*1.65;
   const code=root.InkQR47?.create?.(qrUrl262,{errorCorrectionLevel:'H'});if(!code){ctx.restore();throw Error('二维码组件尚未就绪')}const left=cx-side/2,quiet=side*.13,module=(side-quiet*2)/code.modules.size;ctx.fillStyle='#fffdfa';ctx.fillRect(left,cursor,side,side);ctx.fillStyle='#171717';for(let yy=0;yy<code.modules.size;yy++)for(let xx=0;xx<code.modules.size;xx++)if(code.modules.data[yy*code.modules.size+xx])ctx.fillRect(left+quiet+xx*module,cursor+quiet+yy*module,module+.1,module+.1);const stamp=side*.18,back=stamp*1.18;ctx.fillStyle='#fffdfa';ctx.fillRect(cx-back/2,cursor+(side-back)/2,back,back);ctx.drawImage(seal,cx-stamp/2,cursor+(side-stamp)/2,stamp,stamp);cursor+=side;
  }
  if(credit){const size=fit(ctx,caption,font,available-font*1.8),stamp=size*1.2;ctx.font=size+'px system-ui,-apple-system,sans-serif';const tw=ctx.measureText(caption).width,rw=tw+stamp+size*.4,left=cx-rw/2;ctx.drawImage(seal,left,cursor+font*.85-stamp/2,stamp,stamp);ctx.fillStyle='#594c3a';ctx.fillText(caption,left+stamp+size*.4+tw/2,cursor+font*.85);cursor+=font*1.65}
  if(writingParameters262){ctx.fillStyle='#594c3a';ctx.font=fit(ctx,writingParameters262,font*.9,available)+'px system-ui,-apple-system,sans-serif';ctx.fillText(writingParameters262,cx,cursor+font*.65,available);cursor+=font*1.45}
  if(hasIdea){for(const [text,mult]of [[(idea.name?'设计理念：'+idea.name:'')+(idea.backgroundCaption186?(idea.name?'。':'')+'背景说明：'+idea.backgroundCaption186:''),1],...(idea.name?[[String(idea.idea||idea.description||'以笔墨与纸色相映，呈现手写的温度。').replace(/[\r\n]+/g,' '),.88]]:[])]){ctx.fillStyle='#594c3a';ctx.font=fit(ctx,text,font*mult,available)+'px system-ui,-apple-system,sans-serif';ctx.fillText(text,cx,cursor+font*.65,available);cursor+=font*1.3}}
  ctx.restore();return{top,side,font,height:rows,originalLines211};
 }
 root.BrandCredit182={draw};
})(typeof window==='undefined'?globalThis:window);


