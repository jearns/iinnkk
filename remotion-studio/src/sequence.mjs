import{prepareReplay,createReplayEngine296}from'./replay.mjs';
import{loadDraft294}from'../../release296/selection.mjs';
// Frames own their pixels. Page preparation/eviction can never invalidate a captured frame.
export async function prepareSequence294(items,options={}){
 const slots=[],store=window.DraftStore;let closed=false,serial=Promise.resolve(),tick=0;
 const abort=()=>close();options.signal?.addEventListener('abort',abort,{once:true});
 function close(){if(closed)return;closed=true;for(const slot of slots){slot.session?.close();slot.engine?.close()}options.signal?.removeEventListener('abort',abort)}
 async function page(index){if(closed||options.signal?.aborted)throw new DOMException('已取消','AbortError');let slot=slots.find(s=>s.index===index);if(slot){slot.used=++tick;return slot.session}
  slot=slots.length<2?(()=>{const s={used:0};slots.push(s);return s})():slots.reduce((a,b)=>a.used<b.used?a:b);slot.session?.close();slot.session=null;slot.index=index;slot.used=++tick;slot.engine||=await createReplayEngine296({signal:options.signal});const draft=await loadDraft294(store,items[index]);slot.session=await prepareReplay(draft,{...options,engine296:slot.engine,allowEmpty294:items.length>1||items[index].pageCount>1,onProgress:index===0?options.onProgress:()=>{},onPoster:index===0?options.onPoster:()=>{}});return slot.session;
 }
 const snapshot=image=>{const c=document.createElement('canvas');c.width=image.width;c.height=image.height;c.getContext('2d').drawImage(image,0,0);return c};
 function capture(progress,{complete=false,hero=false,style={},transparent=false,cancelled=()=>false}={}){const job=serial.catch(()=>{}).then(async()=>{if(cancelled())return null;const p=Math.max(0,Math.min(1,progress))*items.length,index=hero?0:Math.min(items.length-1,Math.floor(p)),local=hero||complete||progress>=1?1:p-index;const s=await page(index);if(cancelled())return null;await s.surface.configure296?.(style);if(cancelled())return null;return snapshot(transparent?s.surface.drawInk296(local):s.surface.draw(local));});serial=job;return job;}
 try{const first=await page(0);if(items.length>1)await page(1);const surface={sequence294:true,capture296:capture,chapters:items.length===1?first.chapters:[],width:first.width,height:first.height,get closed(){return closed},hero:opts=>capture(1,{...opts,hero:true}),draw:(progress,opts)=>capture(progress,opts),stats:()=>({cachedPages:slots.filter(s=>s.session).length,engines:slots.length}),close};return{surface,width:first.width,height:first.height,frames:first.frames,close};}catch(e){close();throw e}
}
