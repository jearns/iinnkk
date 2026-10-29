import{prepareReplay}from'./replay.mjs';
import{loadDraft294}from'../../record-selection294.mjs';
// A bounded two-page window. Large books never create an iframe/canvas for every page.
export async function prepareSequence294(items,options={}){
 const cache=new Map();let closed=false;const store=window.DraftStore;
 const abort=()=>close();options.signal?.addEventListener('abort',abort,{once:true});
 function close(){if(closed)return;closed=true;for(const entry of cache.values()){entry.controller.abort();entry.job.then(s=>s.close(),()=>{})}cache.clear();options.signal?.removeEventListener('abort',abort)}
 function get(index){
  if(closed)throw new DOMException('已取消','AbortError');
  let entry=cache.get(index);if(entry){cache.delete(index);cache.set(index,entry);return entry.job;}
  while(cache.size>=2){const old=cache.keys().next().value,e=cache.get(old);cache.delete(old);e.controller.abort();e.session?.close();e.job.then(s=>s.close(),()=>{});}
  const controller=new AbortController();entry={controller};
  entry.job=(async()=>{const draft=await loadDraft294(store,items[index]);if(controller.signal.aborted)throw new DOMException('已取消','AbortError');const session=await prepareReplay(draft,{...options,allowEmpty294:items.length>1||items[index].pageCount>1,signal:controller.signal,onProgress:index===0?options.onProgress:()=>{},onPoster:index===0?options.onPoster:()=>{}});if(closed||controller.signal.aborted){session.close();throw new DOMException('已取消','AbortError')}entry.session=session;return session;})();entry.job.catch(()=>{});cache.set(index,entry);return entry.job;
 }
 try{
  const first=await get(0),n=items.length;
  // Prewarm one adjacent page, only after the first page is ready.
  const prewarm=index=>{if(index<n&&!closed&&!cache.has(index))get(index).catch(()=>{})};
  const surface={sequence294:true,chapters:n===1?first.surface.chapters:[],width:first.width,height:first.height,get closed(){return closed},
   async hero(){return(await get(0)).surface.draw(1)},
   async draw(progress,{complete=false}={}){const p=Math.max(0,Math.min(1,progress))*n,index=Math.min(n-1,Math.floor(p)),local=progress>=1?1:p-index;const session=await get(index),canvas=session.surface.draw(complete?1:local);prewarm(index+1);return canvas;},stats:()=>({cachedPages:cache.size}),close};
  return{surface,width:first.width,height:first.height,frames:first.frames,chapters:surface.chapters,close};
 }catch(e){close();throw e}
}
