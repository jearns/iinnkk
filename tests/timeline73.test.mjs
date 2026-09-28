import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const sandbox={window:{}};
vm.runInNewContext(readFileSync('timeline73-data.js','utf8'),sandbox);
const chapters=sandbox.window.CalligraphyTimeline73;
test('history scroll covers the requested epochs in reverse chronology',()=>{
 assert.equal(chapters.length,31);
 assert.equal(chapters[0].era,'殷商');
 assert.equal(chapters.at(-1).era,'当代');
 assert.equal(chapters[0].id,'oracle');
 assert.equal(chapters.at(-1).id,'qinling');
 assert.equal(new Set(chapters.map(x=>x.id)).size,31);
 assert.ok(chapters.every(x=>x.status&&x.museum&&x.style&&x.size>0&&x.zoom>0));
});
test('missing originals and later copies cannot be advertised as autograph originals',()=>{
 for(const id of ['shizhoupian','yishan','zhangzhi','xuanshi','yuanshe','jijiuzhang']){
  const c=chapters.find(x=>x.id===id);
  assert.match(c.status+c.museum,/亡佚|不存|无原件|摹|刻|传/);
 }
 assert.match(chapters.find(x=>x.id==='shengjiao').status,/非王羲之亲笔/);
});
