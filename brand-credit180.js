/* One centered site credit for ordinary exports and copy compositions. */
(function(root){
 function draw(ctx,{x=0,y=0,width,height,qr=true,credit=true,paper='#f5f1e6'}){
  const caption='手笔·以手为笔·iinnkk.me·随时写字',font=Math.max(1,Math.min(width*.017,height*.08)),side=Math.min(width*.086,height*.62),gap=font*.55,rowHeight=credit?font*1.25:0,total=(qr?side:0)+(qr&&credit?gap:0)+rowHeight,top=y+(height-total)/2,cx=x+width/2;
  ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
  const seal=root.SealEngine?.stamp({text:'手',font:'yishan',type:'yin',color:'#b62118',rough:.12,fontLoaded:!!root.yiShanBeiSealReady});
  if(qr){const code=root.InkQR47?.create?.('https://iinnkk.me',{errorCorrectionLevel:'H'});if(!code||!seal){ctx.restore();throw Error('二维码或篆书印章组件未就绪')}
   const left=cx-side/2,quiet=side*.13,module=(side-quiet*2)/code.modules.size;ctx.fillStyle='#fffdfa';ctx.fillRect(left,top,side,side);ctx.fillStyle='#171717';
   for(let yy=0;yy<code.modules.size;yy++)for(let xx=0;xx<code.modules.size;xx++)if(code.modules.data[yy*code.modules.size+xx])ctx.fillRect(left+quiet+xx*module,top+quiet+yy*module,module+.1,module+.1);
   const stampSide=side*.18,back=stampSide*1.18;ctx.fillStyle='#fffdfa';ctx.fillRect(cx-back/2,top+(side-back)/2,back,back);ctx.drawImage(seal,cx-stampSide/2,top+(side-stampSide)/2,stampSide,stampSide);
  }
  if(credit){ctx.font=font+'px system-ui,-apple-system,sans-serif';const stampSide=font*1.25,stampGap=font*.4,available=Math.max(1,width*.9-stampSide-stampGap),textWidth=Math.min(available,ctx.measureText(caption).width),rowWidth=stampSide+stampGap+textWidth,left=cx-rowWidth/2,rowY=top+(qr?side+gap:0)+rowHeight/2;
   if(!seal){ctx.restore();throw Error('篆书印章组件未就绪')}ctx.drawImage(seal,left,rowY-stampSide/2,stampSide,stampSide);ctx.fillStyle=contrast(paper);ctx.fillText(caption,left+stampSide+stampGap+textWidth/2,rowY,textWidth);
  }
  ctx.restore();return{font,side,gap,top,total};
 }
 function contrast(color){const hex=/^#([0-9a-f]{6})$/i.exec(color||'');if(!hex)return'#594c3a';const rgb=[0,2,4].map(i=>parseInt(hex[1].slice(i,i+2),16));return rgb[0]*.299+rgb[1]*.587+rgb[2]*.114<135?'#f7f0de':'#594c3a'}
 root.BrandCredit180={draw};
})(typeof window==='undefined'?globalThis:window);
