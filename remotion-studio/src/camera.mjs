const clamp = n => Math.max(0, Math.min(1, n));
const mix = (a, b, t) => a + (b - a) * t;
const ease = t => {t = clamp(t); return t * t * (3 - 2 * t);};
export function draftFocus(draft) {
  const strokes = [...(draft.flow?.strokes || []), ...(draft.signatureStrokes || [])];
  let stroke; for (let i = strokes.length - 1; i >= 0; i--) if (strokes[i].points?.length) {stroke = strokes[i]; break;}
  const point = stroke?.points?.at(-1);
  if (!point) return {x: .5, y: .5};
  const bounds = draft.sheetBounds194 || {x: 0, y: 0, w: 4, h: 4 / (Number(draft.values?.ratio) || .75)};
  const g = stroke.geometry || {}, k = g.k ?? 1, r = g.r || 0;
  const x = point.x * k * Math.cos(r) - point.y * k * Math.sin(r) + (g.x || 0);
  const y = point.x * k * Math.sin(r) + point.y * k * Math.cos(r) + (g.y || 0);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return {x: .5, y: .5};
  return {x: .1 + .8 * clamp((x - (bounds.x || 0)) / (bounds.w || 4)), y: .08 + .82 * clamp((y - (bounds.y || 0)) / (bounds.h || 5.333))};
}
export function smoothFocuses(points) {
  return points.reduce((out, point) => {const last = out.at(-1);out.push(last ? {x: mix(last.x, point.x, .55), y: mix(last.y, point.y, .55)} : point);return out;}, []);
}
export function cameraLayers(frame, timing, fps, aspect = .75, focuses = []) {
  const width = 968, height = 1160, ratio = Math.max(.01, Number(aspect) || .75);
  const imageWidth = Math.min(width, height * ratio), imageHeight = Math.min(height, width / ratio);
  const close = Math.max(1.7, Math.min(6, Math.max(width / imageWidth, height / imageHeight) * 1.12));
  const position = timing.progress * Math.max(0, focuses.length - 1), index = Math.floor(position), a = focuses[index] || {x: .5, y: .5}, b = focuses[Math.min(index + 1, focuses.length - 1)] || a;
  const follow = {x: mix(a.x, b.x, ease(position - index)), y: mix(a.y, b.y, ease(position - index))};
  const length = timing.outroStart - timing.introEnd, elapsed = frame - timing.introEnd;
  const cuts = [0, .18, .44, .64, .84, 1], blend = Math.min(fps * 1.1, length * .07);
  function shot(i, opacity) {
    const start = cuts[i] * length, end = i === 4 ? timing.writingEnd - timing.introEnd : cuts[i + 1] * length;
    const t = ease((elapsed - start) / Math.max(1, end - start));
    let scale = 1, focus = {x: .5, y: .5}, rotate = 0;
    if (i === 0) scale = mix(1, 1.06, t);
    if (i === 1) {scale = close * mix(.96, 1.04, t); focus = follow; rotate = mix(-.35, .25, t);}
    if (i === 2) {scale = close * mix(1.08, 1.14, t);focus = {x: mix(follow.x, mix(.32, .68, t), .18), y: follow.y};rotate = .25;}
    if (i === 3) {scale = mix(1.16, Math.min(close * .85, 1.45), t); focus = {x: mix(.5, follow.x, .35), y: mix(.5, follow.y, .35)}; rotate = mix(-.8, .4, t);}
    if (i === 4) scale = mix(1.16, 1, t);
    const limitX = Math.max(0, (imageWidth * scale - width) / 2), limitY = Math.max(0, (imageHeight * scale - height) / 2);
    const x = Math.max(-limitX, Math.min(limitX, (.5 - focus.x) * imageWidth * scale));
    const y = Math.max(-limitY, Math.min(limitY, (.5 - focus.y) * imageHeight * scale));
    return {shot: i, opacity, scale, x, y, rotate};
  }
  for (let i = 1; i < cuts.length - 1; i++) {
    const boundary = cuts[i] * length;
    if (Math.abs(elapsed - boundary) < blend / 2) {
      const amount = ease((elapsed - boundary + blend / 2) / blend);
      // Opaque previous layer plus a fading next layer avoids a dark dip.
      return [shot(i - 1, 1), shot(i, amount)];
    }
  }
  let indexShot = 0; while (indexShot < 4 && elapsed >= cuts[indexShot + 1] * length) indexShot++;
  return [shot(indexShot, 1)];
}
