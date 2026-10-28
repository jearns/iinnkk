export const VIDEO_FPS = 30;
export const VIDEO_DURATIONS = [15, 30, 60, 120];
export const OUTRO_SLOGAN = '以手为笔，随手写字·iinnkk.me';
export function normalizeDuration(value) { return VIDEO_DURATIONS.includes(Number(value)) ? Number(value) : 30; }
export function videoTimeline(frame, durationInFrames, fps) {
  const introEnd = 2 * fps, outroStart = durationInFrames - 2 * fps;
  const hold = Math.min(3 * fps, Math.max(fps, Math.round((outroStart - introEnd) * .12)));
  const writingEnd = outroStart - hold;
  return {
    phase: frame < introEnd ? 'intro' : frame >= outroStart ? 'outro' : 'artwork',
    progress: Math.max(0, Math.min(1, (frame - introEnd) / Math.max(1, writingEnd - introEnd))),
    introEnd, outroStart, writingEnd,
  };
}
