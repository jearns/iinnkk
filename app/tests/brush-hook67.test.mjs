import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const context={};context.globalThis=context;
vm.runInNewContext(readFileSync(new URL('../brush.js',import.meta.url),'utf8'),context);
function widths(points){const samples=[];const canvas={beginPath(){},ellipse(x,y,rx,ry){samples.push({x,y,r:Math.max(rx,ry)})},fill(){}};const stroke={points:points.map(([x,y],i)=>({x:x/390,y:y/390,t:i*75,pressure:.5,lift:i===points.length-1})),settings:{size:36,dry:0,taper:.8},done:true,seed:8,hasPressure:false};context.ParticleBrush.render(stroke,canvas,390,390);return samples}
test('slow rising hook tapers rather than stamping an oversized blob',()=>{
 const hook=widths([[170,55],[170,75],[170,95],[170,115],[170,135],[170,155],[169,174],[166,185],[158,188],[149,184],[144,178]]);
 const stem=hook.filter(p=>p.y>105&&p.y<151).map(p=>p.r);const tip=hook.filter(p=>p.x<146&&p.y<182).map(p=>p.r);
 assert.ok(stem.length&&tip.length,'both the stem and hook tip were rendered');
 assert.ok(Math.max(...tip)<Math.max(...stem)*.8,'the hook tip remains finer than the loaded stem');
});
test('stationary finger before moving does not leave a round dot at stroke entry',()=>{
 const samples=[];const canvas={beginPath(){},ellipse(x,y,rx,ry){samples.push({x,y,r:Math.max(rx,ry)})},fill(){}};
 const points=[[60,80,0],[60,80,80],[60,80,160],[62,80,230],[68,80,300],[80,80,370],[100,80,440]].map(([x,y,t])=>({x:x/390,y:y/390,t,pressure:.5}));
 context.ParticleBrush.render({points,settings:{size:32,dry:0},done:true,seed:2,hasPressure:false},canvas,390,390);
 assert.ok(samples.length>0);
 assert.equal(samples.filter(p=>Math.abs(p.x-60)<.1).length,0,'initial contact is not stamped separately');
 assert.ok(samples[0].r<samples.at(-1).r,'the brush enters the paper progressively');
});
test('a slow stroke enters roundly and leaves without an ink bulb',()=>{
 const stroke=widths([[30,100],[34,100],[40,100],[50,100],[65,100],[85,100],[105,100],[125,100],[145,100],[150,100]]);
 const body=stroke.filter(p=>p.x>80&&p.x<125).map(p=>p.r);
 const start=stroke.filter(p=>p.x<35).map(p=>p.r);
 const end=stroke.filter(p=>p.x>148).map(p=>p.r);
 assert.ok(body.length&&start.length&&end.length);
 assert.ok(Math.max(...start)>0,'the entry is rounded rather than an invisible needle');
 assert.ok(Math.max(...start)<Math.max(...body)*.7);
 assert.ok(Math.max(...end)<Math.max(...body)*.9,'the tip does not swell past the stroke body');
});
test('a long pause at the end does not stamp a separate round cap',()=>{
 const samples=[];const canvas={beginPath(){},ellipse(x,y,rx,ry){samples.push({x,y,r:Math.max(rx,ry)})},fill(){}};
 const points=[[35,90,0],[55,90,80],[75,90,160],[95,90,240],[115,90,320],[135,90,400],[150,90,470],[150,90,700]].map(([x,y,t],i)=>({x:x/390,y:y/390,t,lift:i===7}));
 context.ParticleBrush.render({points,settings:{size:38,dry:0,taper:.86},done:true,seed:9,hasPressure:false},canvas,390,390);
 const body=samples.filter(p=>p.x>82&&p.x<122);const end=samples.filter(p=>p.x>148);
 assert.ok(body.length&&end.length);
 assert.ok(Math.max(...end.map(p=>p.r))<Math.max(...body.map(p=>p.r))*.72);
 assert.ok(end.length<8,'the stationary lift does not redraw the endpoint repeatedly');
});
