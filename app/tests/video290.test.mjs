import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {partialDraft, strokeCount} from '../remotion-studio/src/replay.mjs';
import {disposalPrelude} from '../remotion-studio/scripts/disposal-prelude.mjs';

test('replay follows stored stroke order and pressure without altering paper, seals or the source', () => {
  const stroke = id => ({id, geometry: {x: .1, y: .2, k: 2}, settings: {color: '#123456', size: 50}, points: [{x: 0, y: 0, p: .2, t: 0}, {x: 1, y: 2, p: .8, t: 100}]});
  const draft = {values: {papercolor: '#e9dfca'}, extraSeals: [{text: '印'}], flow: {strokes: [stroke('one'), stroke('two')]}, signatureStrokes: [stroke('signature')]};
  const original = structuredClone(draft), halfway = partialDraft(draft, .5);
  assert.equal(strokeCount(draft), 3);
  assert.equal(strokeCount(partialDraft(draft, 0)), 0);
  assert.equal(halfway.flow.strokes[0].id, 'one');
  assert.equal(halfway.flow.strokes[1].points[1].x, .5);
  assert.equal(halfway.flow.strokes[1].points[1].p, .5);
  assert.equal(halfway.signatureStrokes.length, 0);
  assert.deepEqual(halfway.values, draft.values); assert.deepEqual(halfway.extraSeals, draft.extraSeals);
  assert.deepEqual(partialDraft(draft, 1), draft); assert.deepEqual(draft, original);
});

test('legacy browser disposal symbols are installed before renderer helpers capture them', () => {
  const scope = vm.createContext({});
  vm.runInContext(`const NativeSymbol = Symbol; function LegacySymbol(v) {return NativeSymbol(v)}; LegacySymbol.for = NativeSymbol.for; globalThis.Symbol = LegacySymbol;`, scope);
  vm.runInContext(disposalPrelude, scope);
  const key = vm.runInContext('Symbol.dispose', scope);
  assert.equal(key, Symbol.for('Symbol.dispose'));
  assert.equal(vm.runInContext('Symbol.asyncDispose', scope), Symbol.for('Symbol.asyncDispose'));
  vm.runInContext(`const helperKey = Symbol.dispose || Symbol.for('Symbol.dispose'); let disposed = false; const resource = {[Symbol.dispose]: () => disposed = true}; resource[helperKey](); if (!disposed) throw Error('Object not disposable');`, scope);
});

test('selection is opt-in, message source is checked, and laboratory source retains the entry', () => {
  const works = fs.readFileSync('works206.js', 'utf8'), web = fs.readFileSync('remotion-studio/src/web.jsx', 'utf8');
  assert.match(works, /eq\('owner',owner\)\.eq\('id',id\)/);
  assert.match(works, /db\.storage\.from\('ink-drafts'\)\.download/);
  assert.match(web, /event\.source !== pickerRef\.current\?\.contentWindow/);
  assert.doesNotMatch(web, /type="file"/);
  assert.match(fs.readFileSync('lab240.html', 'utf8'), /href="video-studio.html"/);
  assert.match(fs.readFileSync('lab257.html', 'utf8'), /href="video-studio.html"/);
});

test('foreign owners and traversal paths are rejected before any draft download', async () => {
  const source = fs.readFileSync('works206.js', 'utf8');
  const begin = source.indexOf('async function videoDraft290('), end = source.indexOf('async function chooseVideo290(', begin);
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
  const read = new AsyncFunction('client', 'user', 'bounded', 'store', 'root', 'row', source.slice(begin, end) + ';return videoDraft290(row);');
  let downloads = 0;
  const db = {storage: {from: () => ({download: async () => {downloads++;}})}};
  for (const row of [{cloud198: true, owner: 'other', draft_path: 'other/work.json'}, {cloud198: true, owner: 'owner290', draft_path: 'owner290/../other/work.json'}]) {
    await assert.rejects(read(async () => db, async () => ({id: 'owner290'}), p => p, {}, {}, row), /账号|路径/);
  }
  assert.equal(downloads, 0);
});
