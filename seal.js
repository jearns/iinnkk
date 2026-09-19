(function(root){
 function traditional(text){return [...text].map(c=>(root.SEAL_MAP||{})[c]||c).join('')}
 function hash(x,y){const z=Math.sin(x*127.1+y*311.7)*43758.5453;return z-Math.floor(z)}
 const stampCache=new Map();function stamp({text,type='yin',rough=.06,font='regular',fontLoaded=false,shape='square',layout='horizontal',fontScale=1,color='#b62118'}){const key=JSON.stringify([text,type,rough,font,fontLoaded,shape,layout,fontScale,color,root.sealFontRevision||0]);if(stampCache.has(key))return stampCache.get(key);
  const chars=[...traditional(text.trim())].slice(0,6),canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const t=canvas.getContext('2d');if(!chars.length)return canvas;
  const yin=type==='yin';t.fillStyle=color;
  if(yin)t.fillRect(5,5,246,246);else{t.strokeStyle=color;t.lineWidth=4;t.strokeRect(8.5,8.5,239,239)}
  const boxes=layout==='vertical'?chars.map((_,i)=>[12,12+i*232/chars.length,232,232/chars.length-4]):chars.length>4?chars.map((_,i)=>[i<3?130:12,12+(i%3)*78,114,74]):chars.length===1?[[12,12,232,232]]:chars.length===2?[[130,12,114,232],[12,12,114,232]]:chars.length===3?[[130,12,114,232],[12,12,114,114],[12,130,114,114]]:[[130,12,114,114],[130,130,114,114],[12,12,114,114],[12,130,114,114]];
  chars.forEach((ch,i)=>{
   const glyph=document.createElement('canvas');glyph.width=256;glyph.height=256;const g=glyph.getContext('2d');g.fillStyle='#000';g.strokeStyle='#000';g.textAlign='center';g.textBaseline='middle';
   const supported=(root.SEAL_CHARS||'').includes(ch);g.font=(font==='song'?'200':'400')+' 180px '+(font==='small'&&fontLoaded&&(root.SHUOWEN_CHARS||'').includes(ch)?'ShuowenSeal, ShuowenSealFull':font==='custom'&&fontLoaded?'UserSeal':font==='song'?'ZhenjiSong, "Noto Serif SC"':'ZhenjiKai, "LXGW WenKai"');g.textAlign='left';g.textBaseline='alphabetic';let m=g.measureText(ch),gw0=m.actualBoundingBoxLeft+m.actualBoundingBoxRight,gh0=m.actualBoundingBoxAscent+m.actualBoundingBoxDescent;if(Math.max(gw0,gh0)>222){g.font=g.font.replace('180px',(180*222/Math.max(gw0,gh0))+'px');m=g.measureText(ch);gw0=m.actualBoundingBoxLeft+m.actualBoundingBoxRight;gh0=m.actualBoundingBoxAscent+m.actualBoundingBoxDescent}g.fillText(ch,(256-gw0)/2+m.actualBoundingBoxLeft,(256-gh0)/2+m.actualBoundingBoxAscent);
   if(font==='small'&&fontLoaded&&ch==='跡'){g.clearRect(0,0,256,256);for(const [part,dx,dw] of [['足',10,80],['亦',100,146]]){const pc=document.createElement('canvas');pc.width=256;pc.height=256;const pt=pc.getContext('2d');pt.font='180px ShuowenSeal';pt.fillText(part,25,210);const data=pt.getImageData(0,0,256,256).data;let l=256,r=0,u=256,b=0;for(let y=0;y<256;y++)for(let x=0;x<256;x++)if(data[(y*256+x)*4+3]>24){l=Math.min(l,x);r=Math.max(r,x);u=Math.min(u,y);b=Math.max(b,y)}if(r>l&&b>u)g.drawImage(pc,l,u,r-l+1,b-u+1,dx,12,dw,232)}}
   if(font==='song'||font==='regular'){const im=g.getImageData(0,0,256,256),src=new Uint8ClampedArray(im.data),amount=font==='song'?.65:.3;for(let y=1;y<255;y++)for(let x=1;x<255;x++){const k=(y*256+x)*4+3;const edge=Math.min(src[k-4],src[k+4],src[k-1024],src[k+1024]);im.data[k]=Math.round(src[k]*(1-amount)+edge*amount)}g.putImageData(im,0,0)}
   const pixels=g.getImageData(0,0,256,256).data;let left=256,right=0,top=256,bottom=0;
   for(let y=0;y<256;y++)for(let x=0;x<256;x++)if(pixels[(y*256+x)*4+3]>24){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}
   if(right<=left||bottom<=top)return;
   // Crop actual ink bounds, not font em-box metrics, then fill each seal cell.
   const [x,y,w,h]=boxes[i];t.save();t.globalCompositeOperation=yin?'destination-out':'source-over';
   if(!yin){g.globalCompositeOperation='source-in';g.fillStyle=color;g.fillRect(0,0,256,256)}
   const gw=right-left+1,gh=bottom-top+1,fit=Math.min(w/gw,h/gh),dw=gw*fit,dh=gh*fit;t.drawImage(glyph,left,top,gw,gh,x+w*(1-fontScale)/2,y+h*(1-fontScale)/2,w*fontScale,h*fontScale);t.restore();
  });
  // Chip only this stamp's ink, never the writing underneath it.
  if(rough>0){const im=t.getImageData(0,0,256,256),a=im.data,original=new Uint8ClampedArray(a);for(let y=5;y<251;y++)for(let x=5;x<251;x++){const k=(y*256+x)*4;if(!original[k+3])continue;const edge=original[k-4+3]<100||original[k+4+3]<100||original[k-1024+3]<100||original[k+1024+3]<100;const n=hash(x,y);if(n>1-rough*(edge?.85:.015))a[k+3]=0;else if(hash(Math.floor(x/3),Math.floor(y/3))>1-rough*.045)a[k+3]=Math.round(a[k+3]*.25)}t.putImageData(im,0,0)}
  if(rough>0){t.save();t.globalCompositeOperation='destination-out';for(let i=0;i<32;i++){if(hash(i,43)>rough*1.6)continue;const side=i%4,v=8+hash(i,71)*239,r=1+hash(i,92)*5*rough;t.beginPath();t.ellipse(side===0?6:side===1?250:v,side===2?6:side===3?250:v,r*1.7,r,hash(i,91)*3,0,Math.PI*2);t.fill()}t.restore()}
  if(shape!=='square'){const copy=document.createElement('canvas');copy.width=copy.height=256;copy.getContext('2d').drawImage(canvas,0,0);t.clearRect(0,0,256,256);if(shape==='tall')t.drawImage(copy,46,0,164,256);else if(shape==='wide')t.drawImage(copy,0,46,256,164);else{t.save();t.beginPath();if(shape==='oval')t.ellipse(128,128,122,122,0,0,Math.PI*2);else if(shape==='gourd'){t.ellipse(128,78,77,72,0,0,Math.PI*2);t.ellipse(128,176,115,77,0,0,Math.PI*2)}else{t.moveTo(28,5);t.lineTo(225,14);t.lineTo(250,78);t.lineTo(238,232);t.lineTo(102,251);t.lineTo(8,219);t.lineTo(5,70);t.closePath()}t.clip();t.drawImage(copy,0,0);t.restore()}}if(stampCache.size>60)stampCache.clear();stampCache.set(key,canvas);return canvas;
 }
 root.SealEngine={stamp,traditional};
})(typeof globalThis!=='undefined'?globalThis:this);
