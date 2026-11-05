import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Window} from 'happy-dom';
const read=p=>fs.readFileSync(p,'utf8');
test('all fifty original outline identities survive with local real-world assets',()=>{
 const original=JSON.parse(read('release296/outlines.json')),current=JSON.parse(read('release304/outlines.json'));
 assert.equal(original.length,50);assert.equal(current.length,52);
 for(const old of original){const item=current.find(x=>x.id===old.id);assert.ok(item,old.id);for(const key of ['id','name','group','words'])assert.deepEqual(item[key],old[key]);}
 for(const item of current){assert.ok(fs.existsSync(item.image),item.image);assert.match(item.source,/^https:\/\//);if(item.photoDerived)assert.match(item.image,/\.webp$/);else assert.match(item.image,/\.svg$/);}
 assert.equal(current.filter(x=>x.photoDerived).length,22);
});
test('magazine uses a native fixed dialog outside the transformed editor',()=>{
 const w=new Window({settings:{disableJavaScriptFileLoading:true,disableCSSFileLoading:true}});w.document.write(read('self-portrait257.html'));const d=w.document.getElementById('portraitMagazine268');assert.equal(d.tagName,'DIALOG');assert.equal(d.dataset.fixed224,'true');assert.match(read('hand255/photo.js'),/document\.body\.append\(magazineDialog268\)/);assert.match(read('hand255/photo.js'),/magazineDialog268\.showModal\(\)/);assert.match(read('release304/portrait-panel.css'),/transform:\s*none/);w.close();
});
test('download hosts use the same lazy panel and icon actions even with an existing fitter',()=>{
 const src=read('export-studio182.js');assert.match(src,/release305\/export-panel\.css/);assert.match(src,/dataset\.panel304='export'/);assert.doesNotMatch(src,/if\(window\.ExportViewport260\)return Promise\.resolve\(\)/);assert.match(src,/aria-label="下载 PNG"/);assert.match(read('release304/export-panel.css'),/repeat\(3/);assert.match(read('release304/export-panel.css'),/#exportPreview182#exportPreview182\[data-panel304/);
});
test('outline picker pages only four assets and keeps all five groups',()=>{
 const src=read('release304/portrait.js');assert.match(src,/items\.slice\(page\*4,page\*4\+4\)/);assert.match(src,/run===token/);assert.match(src,/data-fixed224|dataset\.fixed224/);const data=JSON.parse(read('release304/outlines.json'));assert.equal(new Set(data.map(x=>x.group)).size,5);
});
