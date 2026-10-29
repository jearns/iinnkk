export function strokeCount(draft) {
  return [...(draft?.flow?.strokes || []), ...(draft?.signatureStrokes || [])].filter(s => s.points?.length).length;
}

// Preserve stroke identity, pressure, brush settings and geometry. Only the last
// visible stroke is shortened; never infer stroke order from a finished image.
export function partialDraft(draft, fraction) {
  const copy = structuredClone(draft);
  const all = [...(copy.flow?.strokes || []), ...(copy.signatureStrokes || [])];
  let remain = all.reduce((n, s) => n + Math.max(1, (s.points?.length || 1) - 1), 0) * Math.max(0, Math.min(1, fraction));
  const cut = strokes => (strokes || []).flatMap(stroke => {
    const points = stroke.points || [], count = Math.max(1, points.length - 1);
    const amount = Math.min(count, Math.max(0, remain)); remain -= count;
    if (!amount || !points.length) return [];
    if (amount >= count || points.length === 1) return [stroke];
    const index = Math.floor(amount), f = amount - index, visible = points.slice(0, index + 1);
    if (f > 0) {
      const a = points[index], b = points[index + 1], next = {...a};
      for (const key of Object.keys(b)) if (typeof a[key] === 'number' && typeof b[key] === 'number') next[key] = a[key] + (b[key] - a[key]) * f;
      visible.push(next);
    }
    return [{...stroke, points: visible}];
  });
  copy.flow = {...copy.flow, strokes: cut(copy.flow?.strokes)};
  copy.signatureStrokes = cut(copy.signatureStrokes);
  return copy;
}

export async function createReplayEngine296({signal}={}){
 const iframe=document.createElement('iframe');iframe.title='纪录大片渲染器';iframe.tabIndex=-1;iframe.setAttribute('aria-hidden','true');iframe.style.cssText='position:fixed;left:-2400px;top:0;width:1024px;height:768px;opacity:0;pointer-events:none;border:0';let closed=false;
 const close=()=>{if(closed)return;closed=true;iframe.remove()};
 try{const app=await new Promise((resolve,reject)=>{let timer,done=false;const start=performance.now();const finish=(value,error)=>{if(done)return;done=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);error?reject(error):resolve(value)};const cancel=()=>finish(null,new DOMException('已取消','AbortError'));const check=()=>{if(signal?.aborted)return cancel();const api=iframe.contentWindow?.AnnotationApp;if(api?.ready&&iframe.contentWindow?.WriterEntry154?.ready)return finish(api);if(performance.now()-start>30000)return finish(null,Error('作品渲染器准备超时，请重试。'));timer=setTimeout(check,50)};signal?.addEventListener('abort',cancel,{once:true});iframe.onload=check;iframe.onerror=()=>finish(null,Error('作品渲染器未能加载，请重试。'));iframe.src='writer.html?prepare158=1&release=296&videoReplay293=1';document.body.append(iframe);timer=setTimeout(check,50)});return{app,close};}catch(e){close();throw e}
}
export async function prepareReplay(draft,{signal,maxSide=1920,onProgress=()=>{},onPoster=()=>{},allowEmpty294=false,showOriginal295=false,engine296}={}){
 if(!strokeCount(draft)&&!allowEmpty294)throw Error('这幅作品没有保存笔画轨迹，暂不能生成书写影片。');const started=performance.now();let engine=engine296,surface,poster,closed=false;
 const close=()=>{if(closed)return;closed=true;surface?.close();if(poster)URL.revokeObjectURL(poster);if(!engine296)engine?.close()};
 try{engine||=await createReplayEngine296({signal});surface=await engine.app.prepareVideoReplay293(draft,{signal,maxSide,onProgress,allowEmpty294,showOriginal295});if(signal?.aborted)throw new DOMException('已取消','AbortError');poster=URL.createObjectURL(surface.poster);onPoster(surface.poster);return{surface,width:surface.width,height:surface.height,chapters:surface.chapters,frames:[poster],prepareMs:performance.now()-started,close};}catch(e){close();throw e}
}
