import test from 'node:test';
import assert from 'node:assert/strict';
import {VIDEO_DURATIONS, VIDEO_FPS, normalizeDuration, videoTimeline, OUTRO_SLOGAN, OUTRO_SITE} from '../remotion-studio/src/timing.mjs';
import {cameraLayers, draftFocus} from '../remotion-studio/src/camera.mjs';
import {prepareReplay} from '../remotion-studio/src/replay.mjs';

test('all five durations reserve a finished-work cover frame and two seconds for each brand card', () => {
  assert.deepEqual(VIDEO_DURATIONS, [8, 15, 30, 60, 120]);
  for (const seconds of VIDEO_DURATIONS) {
    const total = seconds * VIDEO_FPS, at = f => videoTimeline(f, total, VIDEO_FPS);
    assert.equal(at(0).phase, 'cover'); assert.equal(at(0).progress, 1);
    assert.equal(at(1).phase, 'intro'); assert.equal(at(60).phase, 'intro'); assert.equal(at(61).phase, 'artwork');
    assert.equal(at(total - 61).phase, 'artwork'); assert.equal(at(total - 60).phase, 'outro');
    assert.equal(at(total - 1).phase, 'outro'); assert.equal(at(total - 61).progress, 1);
    assert.equal(at(61).progress, 0); assert.ok(at(120).progress < 1);
  }
  assert.equal(normalizeDuration(8), 8); assert.equal(normalizeDuration('120'), 120);
  assert.equal(OUTRO_SLOGAN, '以手为笔，随手写字'); assert.equal(OUTRO_SITE, 'iinnkk.me');
});

test('camera changes from full view to ink close-up and returns to an uncropped full work', () => {
  const total = 900, fps = 30, at = f => videoTimeline(f, total, fps);
  const focus = [{x: .25, y: .2}, {x: .8, y: .7}];
  const opening = cameraLayers(90, at(90), fps, .75, focus);
  const close = cameraLayers(300, at(300), fps, .75, focus);
  assert.ok(opening[0].scale < 1.07); assert.ok(close[0].scale > 1.5);
  assert.ok(close[0].x || close[0].y);
  for (const ratio of [.08, .75, 5]) for (let f = 60; f < total - 60; f++) {
    const layers = cameraLayers(f, at(f), fps, ratio, focus);
    assert.ok(layers.length >= 1 && layers.length <= 2);
    assert.equal(layers[0].opacity, 1);
    for (const layer of layers) for (const key of ['scale', 'x', 'y', 'rotate', 'opacity']) assert.ok(Number.isFinite(layer[key]));
  }
  const boundary = 61 + .45 * 779;
  const transition = cameraLayers(boundary, at(boundary), fps, .75, focus);
  assert.equal(transition.length, 1); assert.ok(transition[0].shade > .999);
  const pose = f => {const {scale,x,y,rotate} = cameraLayers(f, at(f), fps, .75, focus)[0];return {scale,x,y,rotate}};
  assert.deepEqual(pose(300), pose(350)); assert.equal(pose(300).rotate, 0);
  const end = cameraLayers(839, at(839), fps, .75, focus)[0];
  assert.deepEqual([end.scale, end.x, end.y, end.rotate], [1, 0, 0, 0]);
  assert.deepEqual(draftFocus({flow: {strokes: []}}), {x: .5, y: .5});
});

test('the complete work poster is ready before replay frames and is reused as the last frame', async () => {
  const oldDocument = globalThis.document, controller = new AbortController(), events = [];
  let release, started, removed = false;
  const blocked = new Promise(resolve => {started = resolve;});
  const draft = {sheetBounds194: {w: 4, h: 5}, flow: {strokes: [{points: [{x: 1, y: 1}, {x: 2, y: 2}]}]}};
  const api = {ready: true, renderSavedDraft179: async d => {
    events.push(d.flow.strokes.length ? 'ink' : 'blank');
    if (!d.flow.strokes.length) {started(); return new Promise(resolve => {release = () => resolve(new Blob(['frame']));});}
    return new Blob(['frame']);
  }};
  const iframe = {style: {}, setAttribute() {}, contentWindow: {AnnotationApp: api}, remove() {removed = true;}};
  globalThis.document = {createElement: () => iframe, body: {append: () => queueMicrotask(() => iframe.onload())}};
  try {
    const flight = prepareReplay(draft, {steps: 2, signal: controller.signal, onPoster: blob => {assert.ok(blob.size); events.push('poster');}});
    await blocked; assert.deepEqual(events, ['ink', 'poster', 'blank']); release();
    const result = await flight; assert.equal(result.frames.length, 3); assert.equal(result.focuses.length, 3); assert.ok(removed); result.close();
  } finally {controller.abort(); if (oldDocument === undefined) delete globalThis.document; else globalThis.document = oldDocument;}
});
