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

export async function prepareReplay(draft, {signal, maxSide = 720, steps = 72, onProgress = () => {}} = {}) {
  if (!strokeCount(draft)) throw new Error('这幅作品没有保存笔画轨迹，暂不能逐笔成影。');
  const urls = [];
  const iframe = document.createElement('iframe');
  iframe.title = '作品回放渲染器'; iframe.tabIndex = -1; iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;left:-2400px;top:0;width:1024px;height:768px;opacity:0;pointer-events:none;border:0';
  const abort = () => { throw new DOMException('已取消', 'AbortError'); };
  try {
    const app = await new Promise((resolve, reject) => {
      const started = Date.now(); let timer, settled = false;
      const fail = error => {if (settled) return; settled = true; clearTimeout(timer); reject(error);};
      const check = () => {
        clearTimeout(timer); if (settled) return;
        if (signal?.aborted) return fail(new DOMException('已取消', 'AbortError'));
        const api = iframe.contentWindow?.AnnotationApp;
        if (api?.ready && api.renderSavedDraft179) {settled = true; return resolve(api);}
        if (Date.now() - started > 30000) return fail(new Error('作品渲染器准备超时，请重试。'));
        timer = setTimeout(check, 80);
      };
      iframe.onerror = () => fail(new Error('作品渲染器未能加载，请重试。'));
      iframe.onload = check;
      iframe.src = 'writer.html?prepare158=1&release=290&videoReplay290=1'; document.body.append(iframe);
      timer = setTimeout(check, 100);
    });
    for (let i = 0; i <= steps; i++) {
      if (signal?.aborted) abort();
      let timer;
      const blob = await Promise.race([
        app.renderSavedDraft179(partialDraft(draft, i / steps), {previewMax187: maxSide, guide: false, credit: false, qr: false, palette: false}),
        new Promise((_, reject) => {timer = setTimeout(() => reject(new Error('书写回放画面生成超时，请使用轻量画质重试。')), 20000);}),
      ]).finally(() => clearTimeout(timer));
      if (!blob?.size) throw new Error('书写回放画面未能生成，请重试。');
      urls.push(URL.createObjectURL(blob)); onProgress((i + 1) / (steps + 1));
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    if (signal?.aborted) abort();
    return {frames: urls, close() { urls.forEach(url => URL.revokeObjectURL(url)); }};
  } catch (error) { urls.forEach(url => URL.revokeObjectURL(url)); throw error; }
  finally { iframe.remove(); }
}
