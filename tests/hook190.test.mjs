import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import fs from 'node:fs';
test('large bent hook keeps overlapping contacts and smoothly changes radius',()=>{
 const c={};vm.runInNewContext(fs.readFileSync('brush.js','utf8'),c);
 for(const size of [80,621,1000]){const stamps=[],ctx={beginPath(){},fill(){},ellipse(x,y,rx,ry){stamps.push({x,y,r:Math.min(rx,ry)})}};
 const points=[{x:.5,y:.1,t:0},{x:.5,y:.3,t:150},{x:.5,y:.6,t:320},{x:.5,y:.8,t:490},{x:.48,y:.85,t:570},{x:.42,y:.86,t:640},{x:.36,y:.84,t:690},{x:.3,y:.79,t:730},{x:.3,y:.79,t:740,lift:true}];
 c.ParticleBrush.render({settings:{size,dry:0,kaishu127:true,smoothing:.6,taper:1},points,done:true},ctx,390,390);
 assert.ok(stamps.length>100);for(let i=1;i<stamps.length;i++){const a=stamps[i-1],b=stamps[i];assert.ok(Math.hypot(b.x-a.x,b.y-a.y)<=a.r+b.r,`disconnected contact at ${i}, size ${size}`)}
 }
});
