import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {Window} from 'happy-dom';
const read=p=>fs.readFileSync(p,'utf8');
function scene(t){
 const w=new Window({url:'https://iinnkk.me/writer.html'}),d=w.document;w.structuredClone=structuredClone;
 t.after(()=>w.happyDOM.abort());d.body.innerHTML='<main><div id="board"></div></main>';
 const board=d.getElementById('board');board.parentElement.getBoundingClientRect=()=>({width:390,height:700,top:60});board.getBoundingClientRect=()=>({width:390,height:520,top:60,bottom:580});
 let requests=0,stops=0,prepares=0,draws=0,revoked=0;
 Object.defineProperty(w.navigator,'mediaDevices',{value:{getUserMedia:async()=>{requests++;return {getTracks:()=>[{stop(){stops++}}]}}}});
 Object.defineProperty(w.HTMLMediaElement.prototype,'srcObject',{configurable:true,get(){return this.testStream},set(value){this.testStream=value}});
 w.HTMLMediaElement.prototype.play=async function(){};w.HTMLMediaElement.prototype.pause=function(){};w.HTMLMediaElement.prototype.load=function(){};
 w.URL.createObjectURL=()=> 'blob:scene231';w.URL.revokeObjectURL=()=>revoked++;
 w.AnnotationApp={ready:true,refresh(){},prepareScene225:async()=>prepares++,sceneView225:()=>({width:390,height:520,scale:100}),clearScenePhoto225(){},liveSceneFrame225(){},toast(){}};
 w.eval(read('camera223.js'));
 return {w,d,get requests(){return requests},get stops(){return stops},get prepares(){return prepares},get revoked(){return revoked},context:{translate(){},rotate(){},scale(){},save(){},restore(){},beginPath(){},rect(){},clip(){},drawImage(){draws++},createLinearGradient:()=>({addColorStop(){}}),fillRect(){}},get draws(){return draws}};
}
test('camera enable shares one pending request and reuses the active camera',async t=>{
 const s=scene(t),{w}=s;
 assert.deepEqual(await Promise.all([w.LiveScene225.enable(),w.LiveScene225.enable()]),[true,true]);
 assert.equal(s.requests,1);assert.equal(s.prepares,1);assert.equal(await w.LiveScene225.enable(),true);assert.equal(s.requests,1);
 w.LiveScene225.stop();assert.equal(s.stops,1);assert.equal(w.LiveScene225.active,false);
});
test('uploaded video plays as the drawing background without camera permission, then releases its URL',async t=>{
 const s=scene(t),{w,d}=s;
 const pending=w.LiveScene225.installMedia231(new w.File(['video'],'scene.mp4',{type:'video/mp4'}));
 const video=d.querySelector('video');Object.defineProperty(video,'videoWidth',{value:1920});Object.defineProperty(video,'videoHeight',{value:1080});video.dispatchEvent(new w.Event('loadedmetadata'));
 assert.equal(await pending,true);assert.equal(s.requests,0);assert.equal(s.prepares,1);assert.equal(video.loop,false);assert.equal(video.muted,true);
 assert.ok(Math.abs(w.LiveScene225.aspect228-16/9)<1e-9);w.LiveScene225.draw(s.context,390,220,{});assert.equal(s.draws,1);
 assert.equal(await w.LiveScene225.enable(),true);assert.equal(s.requests,0);
 w.LiveScene225.stop();assert.equal(s.revoked,1);assert.equal(video.getAttribute('src'),null);
});
test('scene readiness cannot invoke the late random palette handler',()=>{
 const s=read('revision119.js'),start=s.indexOf("document.addEventListener('mode-ready109'"),end=s.indexOf('\n',start);let handler,applied=0;
 vm.runInNewContext(s.slice(start,end),{document:{addEventListener:(_,fn)=>handler=fn},window:{LiveScene225:{active:true}},Revision94:{templateFollows:true,apply(){applied++}}});
 handler();assert.equal(applied,0);
});
test('recording asks for microphone only when selected and samples refreshed scene frames',async t=>{
 const w=new Window(),d=w.document;t.after(()=>w.happyDOM.abort());d.body.innerHTML='<div id="topActions"></div>';
 w.AnnotationApp={ready:true,toast(){}};w.WritingMusic={};w.eval(read('process-video.js'));
 assert.equal(d.getElementById('recordMic39').checked,false);assert.equal(d.getElementById('sceneUpload230').accept,'image/*');assert.equal(d.getElementById('sceneVideo232').accept,'video/*');
 assert.match(read('process-video.js'),/if\(window.LiveScene225\?\.active\)app.liveSceneFrame225\(\)/);
});

test('recording composites updated background and ink into a downloadable video without a media permission request',async t=>{
 const w=new Window(),d=w.document;t.after(()=>w.happyDOM.abort());d.body.innerHTML='<div id="topActions"></div><div id="board"></div>';
 let permissions=0,updates=0,layers=0,downloads=0;const tracks=[{stop(){}}];
 Object.defineProperty(w.navigator,'mediaDevices',{value:{getUserMedia:async()=>{permissions++;throw Error('Unexpected permission request')}}});
 w.HTMLCanvasElement.prototype.getContext=()=>({fillRect(){},drawImage(){layers++}});
 w.HTMLCanvasElement.prototype.captureStream=()=>({getTracks:()=>tracks,addTrack(){}});
 w.HTMLAnchorElement.prototype.click=()=>downloads++;w.URL.createObjectURL=()=> 'blob:recorded';w.URL.revokeObjectURL=()=>{};
 d.getElementById('board').getBoundingClientRect=()=>({width:390,height:520});
 w.MediaRecorder=class{static isTypeSupported(){return true}constructor(){this.state='inactive';this.mimeType='video/mp4'}start(){this.state='recording'}stop(){this.state='inactive';this.ondataavailable({data:new w.Blob(['frame'])});this.onstop()}};
 w.AnnotationApp={ready:true,toast(){},liveSceneFrame225(){updates++},canvases:()=>[{width:390,height:520},{width:390,height:520}]};
 w.WritingMusic={};w.LiveScene225={active:true,sync(){}};w.eval(read('process-video.js'));d.getElementById('recordMusic39').checked=false;
 assert.equal(await w.ProcessRecording39.start227(),true);assert.equal(w.ProcessRecording39.active(),true);assert.equal(updates,1);assert.equal(layers,2);assert.equal(permissions,0);
 w.ProcessRecording39.stop225();assert.equal(downloads,1);assert.equal(w.ProcessRecording39.active(),false);
});
test('failed camera preparation releases its stream and exits scene layout instead of leaving a broken screen',async t=>{
 const s=scene(t),{w,d}=s;w.AnnotationApp.prepareScene225=async()=>{throw Error('preparation failed')};
 assert.equal(await w.LiveScene225.enable(),false);assert.equal(w.LiveScene225.active,false);assert.equal(d.body.classList.contains('liveScene225'),false);assert.equal(s.stops,1);
});
test('a selected photo follows photo composition and leaves no live-video controls or camera request',async t=>{const s=scene(t),{w,d}=s;let asset,opened=0;w.HTMLImageElement.prototype.decode=async()=>{};Object.defineProperty(w.HTMLImageElement.prototype,'naturalWidth',{get:()=>1600});Object.defineProperty(w.HTMLImageElement.prototype,'naturalHeight',{get:()=>900});w.HTMLCanvasElement.prototype.getContext=()=>({drawImage(){}});w.HTMLCanvasElement.prototype.toDataURL=()=> 'data:image/jpeg;base64,AA==';w.AnnotationApp.replaceMedia235=async a=>asset=a;w.MediaStudio235={mediaReady(){opened++}};assert.equal(await w.LiveScene225.installImage230(new w.File(['photo'],'photo.jpg',{type:'image/jpeg'})),true);assert.equal(s.requests,0);assert.equal(w.LiveScene225.active,false);assert.equal(d.body.classList.contains('liveScene225'),false);assert.equal(asset.width,1600);assert.equal(opened,1);assert.equal(d.getElementById('sceneActions225').hidden,true)});

test('replacing a template background preserves its aspect instead of resizing the composition to the file',async t=>{const s=scene(t),{w}=s;w.localStorage.setItem('iinnkk.mode53','photo');w.AnnotationApp.getState=()=>({values:{ratio:6/7}});let asset;w.HTMLImageElement.prototype.decode=async()=>{};Object.defineProperty(w.HTMLImageElement.prototype,'naturalWidth',{get:()=>1920});Object.defineProperty(w.HTMLImageElement.prototype,'naturalHeight',{get:()=>1080});w.HTMLCanvasElement.prototype.getContext=()=>({drawImage(){}});w.HTMLCanvasElement.prototype.toDataURL=()=> 'data:image/jpeg;base64,AA==';w.AnnotationApp.replaceMedia235=async a=>asset=a;w.MediaStudio235={mediaReady(){}};assert.equal(await w.LiveScene225.installImage230(new w.File(['photo'],'landscape.jpg',{type:'image/jpeg'})),true);assert.ok(Math.abs(asset.width/asset.height-6/7)<1e-10);assert.equal(s.requests,0)});

test('390px phone scene uses full viewport without stretching its optical source',async t=>{const s=scene(t),{w}=s;w.localStorage.setItem('iinnkk.mode53','scene');let config;w.AnnotationApp.prepareScene225=async c=>config=c;await w.LiveScene225.enable();const board=w.document.getElementById('board');assert.equal(board.style.getPropertyValue('--scene-width227'),'390px');assert.equal(board.style.getPropertyValue('--scene-height227'),'700px');assert.equal(config.ratio,'9:16');assert.equal(w.LiveScene225.aspect228,9/16);w.AnnotationApp.isOverview55=()=>true;w.LiveScene225.sync();assert.equal(board.style.getPropertyValue('--scene-height227'),'660px')});

test('237 camera and mask follow the paper transform and clip before painting the frame',async t=>{const s=scene(t),{w}=s;await w.LiveScene225.enable();w.AnnotationApp.sceneNavigator228=()=>({bounds:{w:4,h:4/(9/16)}});const a=w.LiveScene225.metrics({x:20,y:30,scale:100},900,900,1000,1000),b=w.LiveScene225.metrics({x:0,y:0,scale:50},200,356,1000,1000);assert.ok(Math.abs((a.w/b.w)-2)<1e-9);assert.ok(Math.abs((a.x-20)-b.x*2)<1e-9);let clips=0,rect;const ctx={save(){},restore(){},beginPath(){},rect(...v){rect=v},clip(){clips++},fillRect(){},createLinearGradient:()=>({addColorStop(){}})};w.LiveScene225.draw(ctx,900,900,{x:20,y:30,scale:100});assert.equal(clips,1);assert.deepEqual(rect,[20,30,400,4/(9/16)*100])});
test('240 live crop uses paper-space frame, mask coverage and writing guide, then hides guide on ink',async t=>{const s=scene(t),{w,d}=s;w.localStorage.setItem('iinnkk.mode53','scene');w.AnnotationApp.sceneNavigator228=()=>({bounds:{w:4,h:8}});w.AnnotationApp.sceneView225=()=>({x:10,y:20,scale:50,width:390,height:700});w.AnnotationApp.mediaCheckpoint237=()=>{};w.AnnotationApp.persist=()=>{};const live=d.createElement('canvas');live.id='live';d.getElementById('board').append(live);await w.LiveScene225.enable();w.LiveScene225.editMedia240({frame:{x:1,y:2,w:2,h:4},crop:{zoom:2}});const rects=[],fills=[],texts=[];const c={...s.context,rect:(...x)=>rects.push(x),fillRect:(...x)=>fills.push(x),fillText:(...x)=>texts.push(x)};w.LiveScene225.draw(c,390,700,{x:10,y:20,scale:50});assert.deepEqual(rects[0],[60,120,100,200]);assert.ok(fills.every(x=>JSON.stringify(x)===JSON.stringify([60,120,100,200])));assert.equal(texts.map(x=>x[0]).join(''),'今日手筆');assert.equal(texts[0][1],110);live.dispatchEvent(new w.PointerEvent('pointerdown',{isPrimary:true,bubbles:true}));texts.length=0;w.LiveScene225.draw(c,390,700,{x:10,y:20,scale:50});assert.equal(texts.length,0);assert.equal(w.LiveScene225.history237().media240.crop.zoom,2)});
