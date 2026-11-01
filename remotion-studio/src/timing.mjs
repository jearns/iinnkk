export const VIDEO_FPS = 30;
export const VIDEO_DURATIONS = [8, 15, 30, 60, 120, 180, 300, 480, 600];
export const OUTRO_SLOGAN = '以手为笔，随时写字';
export const OUTRO_SITE = 'iinnkk.me';
export function normalizeDuration(value) { const n=Number(value); return Number.isFinite(n)&&n>=8 ? Math.ceil(n) : 30; }
export function videoTimeline(frame, durationInFrames, fps) {
  const introEnd = 1 + 2 * fps, outroStart = durationInFrames - 2 * fps;
  const hold = Math.min(3 * fps, Math.max(fps * .6, Math.round((outroStart - introEnd) * .12)));
  const writingEnd = outroStart - hold;
  return {
    phase: frame === 0 ? 'cover' : frame < introEnd ? 'intro' : frame >= outroStart ? 'outro' : 'artwork',
    progress: frame === 0 ? 1 : Math.max(0, Math.min(1, (frame - introEnd) / Math.max(1, writingEnd - introEnd))),
    introEnd, outroStart, writingEnd,
  };
}

export function resolveDuration308(choice, estimatedSeconds) { return choice==='auto' ? normalizeDuration(estimatedSeconds||30) : normalizeDuration(choice); }
