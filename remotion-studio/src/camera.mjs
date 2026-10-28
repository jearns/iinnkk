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
// Each shot is a locked camera. The ink changes; the camera never follows it.
export function cameraLayers(frame, timing, fps, aspect = .75, focuses = []) {
  const width = 1016, height = 1376, ratio = Math.max(.01, Number(aspect) || .75);
  const imageWidth = Math.min(width, height * ratio), imageHeight = Math.min(height, width / ratio);
  const length = timing.outroStart - timing.introEnd, elapsed = frame - timing.introEnd;
  const cuts = length < 7 * fps ? [0, .35, .67, 1] : [0, .23, .45, .68, .84, 1];
  let shot = 0; while (shot < cuts.length - 2 && elapsed >= cuts[shot + 1] * length) shot++;
  const final = shot === cuts.length - 2;
  const detail = shot > 0 && !final;
  const anchor = focuses[Math.round((shot === 2 ? .62 : .34) * Math.max(0, focuses.length - 1))] || {x: .5, y: .5};
  const scale = detail ? Math.min(3.5, Math.max(1.65, Math.max(width / imageWidth, height / imageHeight) * 1.1) * (shot === 2 ? 1.12 : 1)) : 1;
  const limitX = Math.max(0, (imageWidth * scale - width) / 2), limitY = Math.max(0, (imageHeight * scale - height) / 2);
  const x = detail ? Math.max(-limitX, Math.min(limitX, (.5 - anchor.x) * imageWidth * scale)) : 0;
  const y = detail ? Math.max(-limitY, Math.min(limitY, (.5 - anchor.y) * imageHeight * scale)) : 0;
  // A fully opaque shadow hides the cut; no superimposed, offset copies of ink.
  const blend = Math.min(fps * .4, length * .08);
  const distance = Math.min(...cuts.slice(1, -1).map(c => Math.abs(elapsed - c * length)));
  const shade = ease(1 - distance / blend);
  return [{shot, opacity: 1, scale, x, y, rotate: 0, shade}];
}
