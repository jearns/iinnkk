import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {cameraLayers} from '../remotion-studio/src/camera.mjs';
import {videoTimeline,VIDEO_DURATIONS} from '../remotion-studio/src/timing.mjs';
import {MUSIC_TRACKS,musicSource} from '../remotion-studio/src/music.mjs';
test('each locked shot stays still; only an opaque shadow can hide a camera cut',()=>{
 for(const seconds of VIDEO_DURATIONS)for(const ratio of [.08,.75,5]){
  let previous;const n=seconds*30;
  for(let frame=61;frame<n-60;frame++){
   const shot=cameraLayers(frame,videoTimeline(frame,n,30),30,ratio,[{x:.2,y:.15},{x:.8,y:.8}])[0];
   assert.equal(shot.rotate,0);assert.ok(shot.shade>=0&&shot.shade<=1);
   if(previous&&previous.shot===shot.shot)assert.deepEqual([shot.scale,shot.x,shot.y],[previous.scale,previous.x,previous.y]);
   if(previous&&previous.shot!==shot.shot)assert.ok(Math.min(previous.shade,shot.shade)>.96);
   previous=shot;
  }
  assert.equal(previous.scale,1);
 }
});
test('all four music choices have exact-length small AAC assets for every duration',()=>{
 assert.equal(MUSIC_TRACKS.length,4);assert.equal(musicSource('none',8),null);
 for(const track of MUSIC_TRACKS)for(const duration of VIDEO_DURATIONS){
  const path=musicSource(track.id,duration);assert.ok(fs.statSync(path).size<duration*4600+6000);assert.ok(track.credit);
 }
 const web=fs.readFileSync('remotion-studio/src/web.jsx','utf8');
 assert.match(web,/coverMetadata\(poster/);assert.match(web,/addMusic\(blob/);
 const composition=fs.readFileSync('remotion-studio/src/showcase.jsx','utf8');assert.doesNotMatch(composition,/data-caption289/);assert.doesNotMatch(composition,/data-announcement292/);assert.match(composition,/data-footer293/);
 const mux=fs.readFileSync('remotion-studio/src/audio-mux.mjs','utf8');assert.doesNotMatch(mux,/new AudioEncoder|new VideoEncoder/);
});
