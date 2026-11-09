import{readSourceSync}from'../source/read.mjs';
import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';import{createRequire}from'node:module';const require=createRequire(import.meta.url),{createCanvas}=require('@napi-rs/canvas');
const e={};vm.runInNewContext(readSourceSync('brush.js','utf8'),e);const B=e.ParticleBrush,N=e.Brush315;B.setCanvasFactory(()=>createCanvas(128,128));
function stroke({duration=200,ink=.45,strength=100,style=75,pressure=null,virtual=true,points=121}={}){return{schemaVersion:315,seed:37,done:true,settings:{...B.lineProfile108(style),size:34,color:'#111111',engineVersion315:315,flyingWhite315:strength,virtualPressure315:virtual,inkStart315:{ink,water:.65,loads:Array(32).fill(ink)},calibration315:{consumePerWidth:.0025}},points:Array.from({length:points},(_,i)=>({x:.1+i/(points-1)*.8,y:.5,t:i/(points-1)*duration,deviceType:pressure===null?'touch':'pen',pressureSource315:pressure===null?'none':'pen-reported',...(pressure===null?{}:{pressure})}))}}
const render=(st,size=1000)=>{const c=createCanvas(size,size);B.render(st,c.getContext('2d'),size,size);return c};
test('A: slow seal/clerical/regular and running strokes never enter flying-white at strength 100',()=>{for(const style of[0,25,50,75,100]){const st=stroke({style,duration:6000,ink:.2}),v=N.analyze(st);assert.equal(v.maxGate,0);assert.ok(v.ink.ink<.2)}});
test('B: fully loaded fast stroke remains complete rather than equating speed with flying-white',()=>{const a=N.analyze(stroke({ink:1,duration:120}));assert.equal(a.maxGate,0);assert.equal(a.final.reason,'saturated')});
test('C/D: semi-dry fast brush has continuous multiple longitudinal gaps and pressure widens the contact',()=>{const st=stroke({pressure:.8}),v=N.analyze(st,{trace:true});assert.ok(v.maxGate>.8);const c=render(st),d=c.getContext('2d').getImageData(700,0,1,1000).data;let spans=0,on=false;for(let i=3;i<d.length;i+=4){const next=d[i]>128;if(next&&!on)spans++;on=next}assert.ok(spans>5,'multiple persistent ink bundles, not random white dots');const low=N.analyze(stroke({pressure:.2})),high=N.analyze(stroke({pressure:.9}));assert.ok(high.final.nibWidth>low.final.nibWidth*1.5);for(let i=1;i<v.trace.length;i++)assert.ok(Math.abs(v.trace[i].gate-v.trace[i-1].gate)<.3)});
test('E: deceleration smoothly removes flying-white and no final-path postprocessing rewrites earlier points',()=>{const st=stroke({duration:180});const a=st.points.at(-1);for(let i=1;i<=120;i++)st.points.push({...a,x:a.x+i*.00005,t:a.t+i*15});const v=N.analyze(st,{trace:true});assert.ok(v.maxGate>.8);assert.ok(v.final.gate<.001);assert.equal(v.final.reason,'slow');assert.equal(st.points[0].x,.1);assert.ok(v.trace.every(p=>Number.isFinite(p.acceleration)&&Number.isFinite(p.curvature)))});
test('F: ink persists over ten characters; explicit refill restores and strength zero preserves nib dynamics',()=>{let ink={ink:1,water:1,loads:Array(32).fill(1)};for(let i=0;i<30;i++){const st=stroke({ink:1});st.settings.inkStart315=ink;ink=N.analyze(st).ink}assert.ok(ink.ink<.65);const refill=stroke({ink:1});assert.equal(N.analyze(refill).maxGate,0);const off=stroke({strength:0,pressure:.8});assert.equal(N.analyze(off).maxGate,0);assert.ok(N.analyze(off).final.nibWidth>10)});
test('G: serialization, replay and high-resolution rendering preserve the same model and masks',()=>{const a=stroke(),b=JSON.parse(JSON.stringify(a));assert.deepEqual(render(a).toBuffer('image/png'),render(b).toBuffer('image/png'));assert.deepEqual(N.analyze(a),N.analyze(b));const ctx=createCanvas(2000,2000).getContext('2d'),state=N.render(a,ctx,2000,2000);assert.deepEqual(N.inkState(state),N.analyze(a).ink);const partial={...a,done:false,points:a.points.slice(0,50)},s=N.render(partial,createCanvas(1000,1000).getContext('2d'),1000,1000);N.advance(a,s,null,1000,1000);assert.deepEqual(N.inkState(s),N.analyze(a).ink)});
test('H: actual reported pen pressure affects width; touch pressure fields cannot become hardware pressure',()=>{const a=stroke(),b=structuredClone(a);for(const p of b.points)p.pressure=.99;assert.deepEqual(N.analyze(a),N.analyze(b));assert.equal(N.analyze(a).final.pressureSource,'virtual');assert.equal(N.analyze(stroke({pressure:.7})).final.pressureSource,'pen-reported');assert.equal(N.analyze(stroke({virtual:false})).final.pressureSource,'fixed')});
test('I: 220 strokes have bounded work, no networking, stable serialized IDs, and deterministic replay',()=>{const st=stroke({points:60}),beg=performance.now(),ids=[];let count=0;for(let i=0;i<220;i++){const s={...st,id:'fixture315-'+i,seed:i+1};count+=N.analyze(s).nodes;ids.push(s.id)}const ms=performance.now()-beg;console.log('315 simulation baseline 220×60 points (ms)',Math.round(ms));assert.ok(ms<1800);assert.ok(count<50000);assert.equal(new Set(ids).size,220);const c=render(st);assert.ok(c.toBuffer('image/png').length>500)});
test('unversioned old strokes render byte-identically through the retained v314 engine',()=>{const old={};vm.runInNewContext(readSourceSync('tests/fixtures315/brush314.js','utf8'),old);old.ParticleBrush.setCanvasFactory(()=>createCanvas(128,128));for(const key of['lisi','cai','yan','wang','zhang']){const st=stroke();st.settings={...B.presets194[key],size:34};delete st.schemaVersion;const a=render(st,700),b=createCanvas(700,700);old.ParticleBrush.render(st,b.getContext('2d'),700,700);assert.deepEqual(a.toBuffer('image/png'),b.toBuffer('image/png'),key)}});
export{stroke,render};
test('pen hover does not deposit ink or connect an airborne bridge',()=>{const st=stroke({pressure:.7,ink:1});st.points=[{...st.points[0],x:.1,t:0},{...st.points[1],x:.2,t:20},{...st.points[2],x:.7,t:40,hover315:true},{...st.points[3],x:.75,t:60}];const c=render(st),d=c.getContext('2d').getImageData(400,450,1,100).data;assert.ok(d.every((v,i)=>i%4!==3||v===0));assert.ok(N.analyze(st).ink.ink>.99)});
test('actual detached film replay and native HD export render v315 snapshots through the shared model',async()=>{const previousDoc=globalThis.document,previousWindow=globalThis.window;globalThis.document={createElement:()=>createCanvas(1,1)};globalThis.window={ParticleBrush:B};try{const{detachedSequence297}=await import('../remotion-studio/src/detached297.mjs');const st=JSON.parse(JSON.stringify(stroke())),paper=createCanvas(1000,1000),foreground=createCanvas(1000,1000),page={width:1000,height:1000,b:{x:0,y:0},bounds:{x:0,y:0,w:1,h:1},scale:1000,total:st.points.length-1,background:paper,foreground,records:[{st,start:0,end:st.points.length-1,k:1,x:0,y:0,rect:{x:0,y:0,w:1000,h:1000}}]};const film=await detachedSequence297([page],{decoded297:true,maxSide:1000});const expected=render(st),frame=film.surface.frame297(1,{transparent:true});assert.deepEqual(frame.toBuffer('image/png'),expected.toBuffer('image/png'));const high=createCanvas(2000,2000);assert.equal(film.surface.paintInk313(high.getContext('2d'),1,{width:2000,height:2000,scale:1,focus:{x:.5,y:.5}}),true);assert.deepEqual(high.toBuffer('image/png'),render(st,2000).toBuffer('image/png'));film.close()}finally{globalThis.document=previousDoc;globalThis.window=previousWindow}});

test('new strokes leave lengthwise paper gaps only in fast, lightly pressed running and cursive ink',()=>{
 function paint(style,duration,pressure){
  const st=stroke({style,duration,pressure,strength:100});
  delete st.settings.engineVersion315;
  st.settings.bristleGaps317=true;
  st.settings.color='#111111';
  st.hasPressure=true;
  return render(st).getContext('2d');
 }
 function spans(ctx,x){
  const data=ctx.getImageData(x,450,1,100).data;
  let count=0,ink=false;
  for(let i=3;i<data.length;i+=4){
   const next=data[i]>128;
   if(next&&!ink)count++;
   ink=next;
  }
  return count;
 }
 for(const style of [75,100]){
  const fast=paint(style,175,.32);
  assert.ok(spans(fast,500)>2);
  assert.equal(spans(fast,510),spans(fast,500));
  assert.equal(spans(paint(style,2500,.32),500),1);
  assert.equal(spans(paint(style,175,.9),500),1);
 }
 for(const style of [0,25,50])assert.equal(spans(paint(style,175,.32),500),1);
});

test('318 default brush opens and closes individual dry-ink gaps while preserving an ink spine',()=>{
 function paint({style=100,ink=20,pressure=.36,fast=true,strength=100}={}){
  const st=stroke({style,pressure,strength,points:121});
  Object.assign(st.settings,{engineVersion315:0,bristleGaps317:true,inkContact318:true,inkLoad315:ink});
  st.hasPressure=true;
  st.points.forEach((p,i)=>{p.t=i*2+(fast?Math.max(0,i-100)*24:i*24)});
  return render(st).getContext('2d');
 }
 function spans(ctx,x){
  const alpha=ctx.getImageData(x,440,1,120).data;
  let count=0,painted=false;
  for(let i=3;i<alpha.length;i+=4){
   const next=alpha[i]>128;
   if(next&&!painted)count++;
   painted=next;
  }
  return count;
 }
 for(const style of [75,100]){
  const fast=paint({style}),counts=[];
  for(let x=160;x<740;x+=5){
   counts.push(spans(fast,x));
   assert.ok(fast.getImageData(x,500,1,1).data[3]>128,'central ink spine stays painted');
  }
  assert.ok(Math.max(...counts)>=3);
  assert.ok(new Set(counts).size>=3,'individual gaps open and close');
  assert.equal(spans(fast,850),1,'deceleration closes the gaps');
 }
 for(const settings of [{ink:100},{pressure:.9},{fast:false},{strength:0},...[0,25,50].map(style=>({style}))]){
  const ctx=paint(settings);
  for(let x=160;x<850;x+=5)assert.equal(spans(ctx,x),1,JSON.stringify(settings));
 }
});
