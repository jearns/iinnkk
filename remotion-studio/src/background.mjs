// Local media is decoded only at the requested frame; the same provider is used by preview and export.
export async function prepareBackground296({data,file,kind='image',title='背景'}){
 let url=file?URL.createObjectURL(file):data,closed=false,serial=Promise.resolve(),clean,media;
 const close=()=>{closed=true;if(media?.tagName==='VIDEO'){media.pause();media.removeAttribute('src');media.load()}if(file&&url)URL.revokeObjectURL(url);clean=null;};
 try{
 if(kind==='video'){media=document.createElement('video');media.muted=true;media.playsInline=true;media.preload='auto';media.src=url;await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('视频背景读取超时')),15000);media.onloadeddata=()=>{clearTimeout(timer);resolve()};media.onerror=()=>{clearTimeout(timer);reject(Error('视频格式不受支持，请使用 MP4'))}})}else{media=new Image();media.src=url;await media.decode()}
 const copy=im=>{const c=document.createElement('canvas'),w=im.videoWidth||im.naturalWidth||im.width,h=im.videoHeight||im.naturalHeight||im.height,k=Math.min(1,1920/Math.max(w,h));c.width=Math.max(1,Math.round(w*k));c.height=Math.max(1,Math.round(h*k));c.getContext('2d').drawImage(im,0,0,c.width,c.height);return c};
 async function frame(time,showOriginal=false){const job=serial.catch(()=>{}).then(async()=>{if(closed)throw Error('背景已关闭');if(kind==='video'){const t=Math.max(0,time)%Math.max(.01,media.duration);if(Math.abs(media.currentTime-t)>.0005){await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('视频背景定位超时')),10000);media.onseeked=()=>{clearTimeout(timer);resolve()};media.currentTime=t})}return copy(media)}if(kind==='catalogue'&&!showOriginal){if(!clean){await import('../../paper-ink188.js');clean=await window.PaperInk188.ensure(media)}return copy(clean)}return copy(media)});serial=job;return job;}
 return{title,kind,frame,close};
 }catch(e){close();throw e}
}
