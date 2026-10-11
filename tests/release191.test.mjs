import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {Window} from 'happy-dom';
test('hook contacts follow the sampled path continuously at phone and export scales',()=>{
 const sandbox={};vm.runInNewContext(fs.readFileSync('brush.js','utf8'),sandbox);
 for(const size of [80,150,305,621,1000])for(const width of [390,1170])for(const kaishu127 of [false,true]){
 const stamps=[],ctx={beginPath(){},fill(){},ellipse(x,y,rx,ry){stamps.push({x,y,r:Math.min(rx,ry)})}};
 const points=[{x:.7,y:.05,t:0},{x:.7,y:.35,t:150},{x:.7,y:.65,t:320},{x:.69,y:.77,t:490},{x:.63,y:.82,t:570},{x:.51,y:.83,t:620},{x:.4,y:.82,t:655},{x:.2,y:.73,t:720}];
 const state=sandbox.ParticleBrush.render({settings:{size,dry:0,kaishu127,smoothing:.65,taper:1},points,done:true},ctx,width,width);
 for(let i=1;i<stamps.length;i++){const a=stamps[i-1],b=stamps[i];assert.ok(Math.hypot(b.x-a.x,b.y-a.y)<=a.r+b.r,`gap: ${size}/${width}/${kaishu127}/${i}`)}
 assert.ok(Math.abs(state.pos.x-.2*width)<.001&&Math.abs(state.pos.y-.73*width)<.001);
 }
});
test('reference transparency is honoured even while floating is enabled',()=>{
 const s=fs.readFileSync('revision131.js','utf8'),fn=s.slice(s.indexOf(' function drawBackground('),s.indexOf(' const stripSnapshots155'));
 for(const opacity of [0,20,65,100]){const ref={width:400,height:300},ctx={save(){},restore(){},scale(){},drawImage(){this.actual=this.globalAlpha}},sandbox={A:{getBackgroundReference188:()=>ref,getCopyFloat181:()=>({enabled:true,opacity:30})},root:{},config:()=>({enabled:true,opacity,crop:{x:0,y:0,w:1,h:1}})};vm.runInNewContext(fn+';drawBackground(ctx,{w:4,h:3},1)',{...sandbox,ctx});assert.equal(ctx.actual,opacity/100)}
});
test('HUD and paper settings locks share state and disable every zoom control',()=>{
 const w=new Window();w.document.body.innerHTML='<section id="paperPen100"><header><strong>纸笔</strong></header></section><button id="topSize"><span></span></button><button id="topLines"></button><button id="zoomQuick79"></button><div id="board"></div><dialog id="dailyDialog"></dialog><input id="inkMode" value="assist"><input id="zoom" value="300"><input id="sizeNumber" value="150">';
 w.setInterval=()=>0;let persisted=0;w.Reference129={ready:true};w.Revision100={ready:true};w.AnnotationApp={writingParameters133:()=>({style:75,size:150,zoom:300}),persist:()=>persisted++,configure47(){}};w.Revision39={syncLock(){w.document.getElementById('zoom').disabled=!!w.writingLocked}};w.TouchOrder129={icon:()=>''};w.eval(fs.readFileSync('revision133.js','utf8'));
 const hud=w.document.querySelector('.zoomLock191'),panel=w.document.querySelector('.paperLock191');assert.ok(hud&&panel);hud.click();assert.equal(w.writingLocked,true);assert.equal(panel.getAttribute('aria-pressed'),'true');const zoom=w.document.querySelector('[data-source="zoom"] input[type="number"]');assert.equal(zoom.disabled,true);panel.click();assert.equal(w.writingLocked,false);assert.equal(hud.getAttribute('aria-pressed'),'false');assert.equal(zoom.disabled,false);assert.equal(persisted,2);w.happyDOM.abort();
});
