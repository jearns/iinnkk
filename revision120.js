(function init120(){
 if(!window.Revision119?.ready||!window.Revision100?.ready){setTimeout(init120,50);return}
 const A=AnnotationApp,$=id=>document.getElementById(id),hint=$('writingHint100'),preview=$('previewWatermark90');
 // Migrate only the known legacy default; preserve uploaded pictures and handwriting.
 let legacyData;
 async function legacyDefault(){
  if(!legacyData)legacyData=new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas'),k=Math.min(1,1400/Math.max(im.width,im.height));c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',.85))};im.onerror=()=>reject(Error('旧默认图不可用'));im.src='annotations/marble.webp'}).catch(error=>{legacyData=null;throw error});
  return legacyData;
 }
 async function ensurePhoto(){
  const draft=A.getState(),items=draft.photos||[];
  if(draft.editingWork110||items.length>1)return;
  if(items.length&&items[0].data!==await legacyDefault())return;
  const response=await fetch('promo-calligraphy120.webp');if(!response.ok)throw Error('推广图片暂未载入');
  const blob=await response.blob();if(localStorage.getItem('iinnkk.mode53')!=='photo')return;
  // A new mode could have opened while the image was loading.
  const now=A.getState();if((now.photos||[]).length!==items.length||now.photos?.[0]?.data!==items[0]?.data)return;
  await A.replaceCoverPhoto114([new File([blob],'今日亲笔·推广图.webp',{type:'image/webp'})]);A.persist();
 }
 let anchor=null,frame=0;
 function colorAt(x,y){const paper=$('paper'),r=paper.getBoundingClientRect();try{const cx=Math.max(0,Math.min(paper.width-1,Math.floor((x-r.left)*paper.width/r.width))),cy=Math.max(0,Math.min(paper.height-1,Math.floor((y-r.top)*paper.height/r.height))),p=paper.getContext('2d').getImageData(cx,cy,1,1).data;const luminance=(.2126*p[0]+.7152*p[1]+.0722*p[2]);return luminance<130?'#fff7e3':'#29251f'}catch{const hex=$('papercolor').value,m=hex.match(/^#([0-9a-f]{6})$/i);if(!m)return '#2a2620';const n=parseInt(m[1],16);return ((n>>16)*.2126+((n>>8)&255)*.7152+(n&255)*.0722)<130?'#fff7e3':'#29251f'}}
 function paint(){frame=0;const board=$('board').getBoundingClientRect(),focus=anchor&&!A.isOverview55()?anchor:{clientX:board.left+board.width/2,clientY:board.top+board.height/2},color=colorAt(focus.clientX,focus.clientY),shadow=color==='#fff7e3'?'#000c':'#fff9';for(const el of [hint,preview])if(el){el.style.setProperty('color',color,'important');el.style.setProperty('text-shadow','0 1px 4px '+shadow+',0 0 9px '+shadow,'important')}if(anchor&&!A.isOverview55()&&!hint.hidden){hint.style.setProperty('left',Math.max(100,Math.min(board.width-100,focus.clientX-board.left))+'px','important');hint.style.setProperty('top',Math.max(70,Math.min(board.height-70,focus.clientY-board.top))+'px','important')}}
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint)};
 document.addEventListener('writing-position120',e=>{const p=A.paperFrame107(),board=$('board').getBoundingClientRect();anchor={clientX:board.left+p.x+e.detail.x*p.scale,clientY:board.top+p.y+e.detail.y*p.scale};hint.innerHTML='<b>双指操作</b><span>双指自由拖动纸张</span><span>双击进入全屏预览</span>';hint.hidden=false;hint.classList.add('located120');schedule()});
 document.addEventListener('pointerdown',e=>{if(e.target.closest('#board')){anchor=null;hint.classList.remove('located120')}},true);
 document.addEventListener('preview-painted94',schedule);document.addEventListener('ink-view-changed90',schedule);document.addEventListener('change',e=>{if(['papercolor','photoMode','paperPattern'].includes(e.target.id))schedule()});new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});schedule();
 window.Revision120={ready:true,ensurePhoto};
})();
