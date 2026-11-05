import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import vm from 'node:vm';
import {Window} from 'happy-dom';
const read=p=>readFile(p,'utf8');

test('国图四宝和首页榜单目录使用同一份名单，文津阁版本明确',async()=>{
 const root={};vm.runInNewContext(await read('calligraphy-rank-data183.js'),{window:root});
 const d=root.CalligraphyRanks183,section=d.lists.find(x=>x.id==='national275');
 assert.deepEqual([...section.works],['dunhuang','zhaocheng275','yongle275','wenjinge275']);
 assert.equal(new Set(section.works).size,4);
 assert.equal(d.works.filter(w=>w.id==='dunhuang').length,1);
 assert.match(d.works.find(w=>w.id==='wenjinge275').description,/文津阁本/);
 assert.match(d.works.find(w=>w.id==='zhaocheng275').url,/nlc\.cn/);
 const home={};vm.runInNewContext(await read('rank-directory275.js'),{window:home});
 assert.deepEqual(JSON.parse(JSON.stringify(home.RankDirectory275)),JSON.parse(JSON.stringify(d.lists.map(({id,title})=>({id,title})) )));
 assert.equal(home.RankDirectory275.length,16);
 const slide=await read('home-slides260.js');assert.match(slide,/刷分类榜单，\\n知千年书脉/);
});

test('系统输入法入口聚焦原生输入框，不拦截指针或载入书写识别引擎',async()=>{
 const w=new Window({url:'https://iinnkk.me/'}),document=w.document;
 const input=document.createElement('input');input.setAttribute('inputmode','none');document.body.append(input);
 const scripts=document.querySelectorAll('script').length;
 vm.runInNewContext(await read('system-input275.js'),{window:w,document,HTMLInputElement:w.HTMLInputElement,HTMLTextAreaElement:w.HTMLTextAreaElement});
 const ev=new w.Event('pointerdown',{bubbles:true,cancelable:true});input.dispatchEvent(ev);
 assert.equal(ev.defaultPrevented,false);assert.equal(input.hasAttribute('inputmode'),false);
 await w.HandInput254.handwrite(input);
 assert.equal(document.activeElement,input);assert.equal(document.querySelectorAll('script').length,scripts);
 assert.equal(document.getElementById('handInput254'),null);
 w.close();
});

test('活动页面与离线清单只引用系统输入法，发布脚本保留右键保护',async()=>{
 const files=(await readdir('.')).filter(f=>f.endsWith('.html')&&!/^engine\d+\.html$/.test(f));
 for(const file of files){const html=await read(file);if(!/<head[\s>]/i.test(html)&&file!=='manage234.html')continue;
  assert.match(html,/system-input275\.js/,file);
  assert.doesNotMatch(html,/<script[^>]+src=["'][^"']*(?:input-surface|handwriting-input)[^"']*["']/i,file);
 }
 const sources=JSON.parse(await read('runtime-sources106.json'));
 assert.ok(sources.scripts.includes('system-input275.js'));
 assert.ok(!sources.scripts.includes('handwriting-input254.js'));
 const offline=JSON.parse(await read('offline-assets.json'));
 assert.ok(offline.includes('rank-directory275.js'));
 assert.ok(offline.some(p=>/^release275\/home\.[a-f0-9]+\.css$/.test(p)));
 assert.match(await read('scripts/check-release224.mjs'),/check-context269\.mjs/i);
});
