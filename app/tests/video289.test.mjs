import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {decodeArtwork} from '../remotion-studio/src/artwork.mjs';
import {containTelemetryRejection} from '../remotion-studio/scripts/telemetry-compat.mjs';

test('image admission requires a successful decode and clears event handlers', async () => {
  const original = globalThis.Image;
  let image;
  globalThis.Image = class {
    constructor() { image = this; this.naturalWidth = 100; this.naturalHeight = 200; }
    set src(value) { this.url = value; queueMicrotask(() => this.onload()); }
    async decode() { this.decoded = true; }
  };
  try {
    assert.equal(await decodeArtwork('blob:valid'), image);
    assert.equal(image.decoded, true);
    assert.equal(image.onload, null);
    globalThis.Image.prototype.decode = async () => { throw new Error('invalid PNG'); };
    await assert.rejects(decodeArtwork('blob:broken'), /图片已损坏/);
    assert.equal(image.onerror, null);
    globalThis.Image = class { set src(_) {} };
    await assert.rejects(decodeArtwork('blob:stuck', 5), /图片读取超时/);
  } finally { globalThis.Image = original; }
});

test('usage event remains sent with the original payload when its rejection is contained', async () => {
  const source = 'await LicensingInternals.internalRegisterUsageEvent({event: "web-render", host: "https://iinnkk.me", succeeded: true});';
  const patched = containTelemetryRejection(source);
  const calls = [], warnings = [];
  await new (Object.getPrototypeOf(async () => {}).constructor)('LicensingInternals', 'console', patched)({
    internalRegisterUsageEvent: async payload => { calls.push(payload); throw new TypeError('network unavailable'); },
  }, {warn: (...args) => warnings.push(args)});
  assert.deepEqual(calls, [{event: 'web-render', host: 'https://iinnkk.me', succeeded: true}]);
  assert.equal(warnings.length, 1);
  assert.throws(() => containTelemetryRejection('unknown SDK version'), /implementation changed/);
});

test('video status, privacy, loading and control text exists in all five locale dictionaries', () => {
  const keys = ['作品成影', '手筆 · 十八种可能', '下载 MP4 视频', '正在生成视频…', '图片已损坏或无法读取，请重新选择。', '图片读取超时，请重新选择。', '正在本机合成视频 {progress}%', '此浏览器暂不支持 MP4 导出，请尝试其他浏览器。', '手机和平板兼容性仍在验证中，建议先使用轻量画质。', 'Remotion 会向其服务发送不含作品内容的使用统计，包括站点来源、网络地址及生成状态。'];
  for (const lang of ['en', 'fr', 'ru', 'ar', 'es']) {
    const dictionary = JSON.parse(fs.readFileSync('locales218/' + lang + '.json', 'utf8'));
    for (const key of keys) assert.ok(dictionary[key], lang + ': ' + key);
    assert.ok(dictionary['正在本机合成视频 {progress}%'].includes('{progress}'));
  }
});
