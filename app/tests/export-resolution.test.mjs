import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const fn=source.slice(source.indexOf('function exportMaxSide('),source.indexOf('let exportBlob='));
function side(w,h,mount=false){const s={sheetBounds:()=>({w,h}),gridMetrics:()=>({dx:1,dy:1}),exportPrefs:{mount},mountKey:'bare',Mounting:{box:()=>({width:w+.5,height:h+.5})}};vm.createContext(s);vm.runInContext(fn,s);return s.exportMaxSide()}
test('long sheets preserve more pixels per character and bound allocation',()=>{assert.equal(side(4,4),4096);assert.ok(side(4,16)>=8000);for(const [w,h]of [[4,40],[40,4],[4,400],[40,40]]){const size=side(w,h);const k=size/Math.max(w,h);assert.ok(size<=16384);assert.ok(w*h*k*k<=18000000);assert.ok(size>2400)}});
test('mount borders count toward export memory budget',()=>{const w=4,h=16,k=side(w,h,true)/h;assert.ok((w+.5)*(h+.5)*k*k<=18000000)});
test('high resolution strokes bypass cached screen raster and render source geometry',()=>{const start=source.indexOf('if(compositionOptions?.highResolution)');assert.ok(start>0&&start<source.indexOf('const interactive=[paper'));assert.match(source.slice(start,start+200),/ParticleBrush.render\(shown,t,w,h,clip\)/)});
