// Real encode/mux/decode coverage. Run with npm run test:audio (requires ffmpeg/ffprobe).
// Node WebCodecs exercises the same production helper without a browser UI or remote service.
import '@napi-rs/webcodecs/polyfill';
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {addMusic} from '../src/audio-mux.mjs';
import {MUSIC_TRACKS, musicSource} from '../src/music.mjs';
const app = fileURLToPath(new URL('../../', import.meta.url));
const ffmpeg = args => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], {maxBuffer: 16 * 1024 * 1024});
const hashVideo = path => createHash('sha256').update(ffmpeg(['-i', path, '-map', '0:v:0', '-c', 'copy', '-f', 'h264', '-'])).digest('hex');
const rms = pcm => {let sum = 0; for (let i=0; i<pcm.length; i+=4) sum += pcm.readFloatLE(i) ** 2; return Math.sqrt(sum / (pcm.length / 4));};

test('downloaded MP4 has audible AAC for supplied MP3s, existing AAC and imported files', {timeout: 120000}, async t => {
  const dir = mkdtempSync(join(tmpdir(), 'shoubi-audio-'));
  // Native decoder callbacks may be unreferenced in Node; keep this integration run alive.
  const keep = setInterval(() => {}, 1000);
  const nativeEncoder = globalThis.AudioEncoder;
  // Exercise the production fallback from the first capability probe (which is cached).
  globalThis.AudioEncoder = undefined;
  try {
    const silent = join(dir, 'silent.mp4');
    ffmpeg(['-f', 'lavfi', '-i', 'color=c=white:s=160x120:r=30', '-t', '8', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', silent]);
    const video = new Blob([readFileSync(silent)]), videoHash = hashVideo(silent);
    async function verify(source, {duration, tail = false} = {}) {
      const result = await addMusic(video, source, {duration});
      const path = join(dir, 'result.mp4');
      writeFileSync(path, new Uint8Array(await result.arrayBuffer()));
      const streams = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-of', 'json', path])).streams;
      const audio = streams.find(s => s.codec_type === 'audio');
      assert.equal(audio?.codec_name, 'aac');
      assert.ok(Math.abs(Number(audio.duration) - 8) < .06, `audio duration ${audio.duration}`);
      assert.equal(hashVideo(path), videoHash, 'video must remain byte-for-byte unchanged');
      const pcm = ffmpeg(['-i', path, '-vn', '-ac', '1', '-ar', '48000', '-f', 'f32le', '-']);
      assert.ok(rms(pcm) > .00001, 'exported audio must decode to nonzero sound');
      if (tail) assert.ok(rms(pcm.subarray(6 * 48000 * 4)) > .00001, 'short source must loop to the end');
    }
    for (const track of MUSIC_TRACKS.slice(0, 14)) {
      await t.test(track.title, async () => {
        const bytes = readFileSync(join(app, musicSource(track.id, 8)));
        await verify('data:audio/mpeg;base64,' + bytes.toString('base64'), {duration: 8});
      });
    }
    await t.test('existing 千年之后 AAC stays audible', () => verify(new Blob([readFileSync(join(app, musicSource('qiannian', 8)))])));
    await t.test('imported MP3 and browsers without native AAC use the WASM encoder', async () => {
      globalThis.AudioEncoder = undefined;
      await verify(new Blob([readFileSync(join(app, musicSource('xiaodao', 8)))]), {duration: 8});
    });
    await t.test('short MP3 loops for the full film', async () => {
      const tone = join(dir, 'short.mp3');
      ffmpeg(['-f', 'lavfi', '-i', 'sine=frequency=440:duration=1', '-c:a', 'libmp3lame', tone]);
      await verify(new Blob([readFileSync(tone)]), {duration: 8, tail: true});
    });
    await t.test('cancelled exports fail instead of delivering a silent file', async () => {
      const controller = new AbortController(); controller.abort();
      await assert.rejects(addMusic(video, new Blob([readFileSync(join(app, musicSource('xiaodao', 8)))]), {signal: controller.signal, duration: 8}), {name: 'AbortError'});
    });
  } finally {clearInterval(keep); globalThis.AudioEncoder = nativeEncoder; rmSync(dir, {recursive: true, force: true});}
});
