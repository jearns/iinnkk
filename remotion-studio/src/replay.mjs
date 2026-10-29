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

export async function prepareReplay(draft, {signal, maxSide = 2240, onProgress = () => {}, onPoster = () => {}, allowEmpty294=false} = {}) {
  if (!strokeCount(draft)&&!allowEmpty294) throw new Error('这幅作品没有保存笔画轨迹，暂不能生成书写影片。');
  const started=performance.now(),iframe=document.createElement('iframe');let surface,poster,closed=false;
  iframe.title='纪录大片渲染器';iframe.tabIndex=-1;iframe.setAttribute('aria-hidden','true');
  iframe.style.cssText='position:fixed;left:-2400px;top:0;width:1024px;height:768px;opacity:0;pointer-events:none;border:0';
  const cleanup=()=>{if(closed)return;closed=true;surface?.close();if(poster)URL.revokeObjectURL(poster);iframe.remove();};
  try {
    const app=await new Promise((resolve,reject)=>{
      let timer,done=false;const finish=(value,error)=>{if(done)return;done=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);error?reject(error):resolve(value)};
      const cancel=()=>finish(null,new DOMException('已取消','AbortError'));
      const check=()=>{if(signal?.aborted)return cancel();const api=iframe.contentWindow?.AnnotationApp;if(api?.ready&&api.prepareVideoReplay293)return finish(api);if(performance.now()-started>45000)return finish(null,Error('作品渲染器准备超时，请重试。'));timer=setTimeout(check,60)};
      signal?.addEventListener('abort',cancel,{once:true});iframe.onload=check;iframe.onerror=()=>finish(null,Error('作品渲染器未能加载，请重试。'));
      iframe.src='writer.html?prepare158=1&release=294&videoReplay293=1';document.body.append(iframe);timer=setTimeout(check,80);
    });
    surface=await app.prepareVideoReplay293(draft,{signal,maxSide,onProgress,allowEmpty294});
    if(signal?.aborted)throw new DOMException('已取消','AbortError');
    poster=URL.createObjectURL(surface.poster);onPoster(surface.poster);
    return{surface,width:surface.width,height:surface.height,chapters:surface.chapters,frames:[poster],prepareMs:performance.now()-started,close:cleanup};
  }catch(error){cleanup();throw error;}
}
