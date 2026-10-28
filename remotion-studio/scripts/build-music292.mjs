// Offline asset preparation; never runs in the user's browser or on startup.
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {VIDEO_DURATIONS} from '../src/timing.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
mkdirSync(new URL('../../video-music292/', import.meta.url), {recursive: true});
for (const [id, source] of Object.entries({yangguan: 'guqin', fisher: 'fisher', satie: 'focus-satie', bach: 'focus-goldberg'})) {
  for (const seconds of VIDEO_DURATIONS) {
    execFileSync('ffmpeg', ['-v', 'error', '-i', `music/${source}.mp3`, '-t', String(seconds), '-af', `loudnorm=I=-22:TP=-3:LRA=8,volume=0.48,afade=t=in:st=0:d=0.35,afade=t=out:st=${seconds - .8}:d=0.8`, '-ac', '1', '-ar', '48000', '-c:a', 'aac', '-b:a', '32k', '-movflags', '+faststart', '-y', `video-music292/${id}-${seconds}.m4a`], {cwd: root});
  }
}
