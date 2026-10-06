import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('export keeps 4K dimensions and picks the best JPEG quality within 2MB',async()=>{
 const ctx={save(){},restore(){},fillRect(){}},calls=[],canvas={width:3000,height:4000,getContext:()=>ctx,toBlob(cb,type,q){calls.push(q);cb({size:Math.ceil(500000+2200000*q),type})}},env={};
 vm.runInNewContext(fs.readFileSync('export-encoder127.js','utf8'),env);const blob=await env.ArtworkEncoder127.encode(canvas);
 assert.ok(blob.size<=2000000);assert.ok(blob.size>1970000);assert.equal(blob.type,'image/jpeg');assert.equal(canvas.width,3000);assert.equal(canvas.height,4000);assert.ok(calls.length<=10);
});
test('simple images retain highest JPEG quality without repeated encodes',async()=>{
 const env={},calls=[],canvas={getContext:()=>({save(){},restore(){},fillRect(){}}),toBlob(cb,type,q){calls.push(q);cb({size:300000,type})}};
 vm.runInNewContext(fs.readFileSync('export-encoder127.js','utf8'),env);await env.ArtworkEncoder127.encode(canvas);assert.deepEqual(calls,[.94]);
});
test('selection toolbar stays open across recolor and delete until manually closed',()=>{
 class Element{constructor(tag){this.tag=tag;this.children=[];this.style={};this.value='';this.hidden=false}append(...nodes){this.children.push(...nodes)}setAttribute(){}addEventListener(){}contains(n){return this===n||this.children.some(c=>c.contains?.(n))}}
 const env={document:{createElement:tag=>new Element(tag)}};vm.runInNewContext(fs.readFileSync('ink-selection.js','utf8'),env);
 const board=new Element('board'),button=new Element('button'),initial={settings:{color:'#000000'},points:[{x:1,y:1}]};let strokes=[initial];
 env.InkSelection.create({board,button,presets:{},prepare:x=>x,getStrokes:()=>strokes,bounds:a=>a.length?{x:0,y:0,w:1,h:1}:null,view:()=>({x:0,y:0,scale:1}),commit(){},replace:a=>strokes=a,finish(){},toast(){}});
 button.onclick();const layer=board.children[0],toolbar=layer.children[0],mode=toolbar.children[0],color=toolbar.children[2];mode.value='all';mode.onchange();color.value='#ff0000';color.onchange();assert.equal(layer.hidden,false);assert.equal(strokes[0].settings.color,'#ff0000');color.value='#0000ff';color.onchange();assert.equal(strokes[0].settings.color,'#0000ff');assert.equal(layer.hidden,false);toolbar.children[6].onclick();assert.equal(strokes.length,0);assert.equal(layer.hidden,false);toolbar.children.at(-1).onclick();assert.equal(layer.hidden,true);
});
test('both writing watermark states include five-tap clear and six-tap undo',()=>{
 const s=fs.readFileSync('revision100.js','utf8');assert.equal(s.split('双指五击清空书写').length-1,2);assert.equal(s.split('双指六击返回操作').length-1,2);
});
