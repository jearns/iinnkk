import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// Exercise the production renderInk body with canvas shims. The brush call is
// the expensive operation, so count it over repeated viewport scale changes.
test('completed strokes are not rebuilt for every zoom frame',()=>{
 const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 const code=source.slice(source.indexOf('const strokeRasters=new Map()'),source.indexOf('function toggleInkMode()'));
 const canvas=()=>({width:0,height:0,getContext(){return{translate(){},drawImage(){},fillRect(){},save(){},restore(){},getTransform(){return{a:1,b:0}}}}});
 const surface=canvas();let brushCalls=0;
 const ctx={Map,WeakMap,JSON,Math,performance:{now:()=>0},setTimeout:()=>1,clearTimeout(){},document:{createElement:canvas},paper:surface,ink:canvas(),live:canvas(),historySurface:canvas(),strokeSurface:canvas(),compositionOptions:null,window:{annotationInkOpacity:1},displayStroke:st=>st,inkBounds:()=>({x:0,y:0,w:.24,h:.3}),ParticleBrush:{render:()=>{brushCalls++}},gesturing:false,active:null};
 vm.createContext(ctx);vm.runInContext(code+';globalThis.paintStroke=renderInk',ctx);
 const strokes=Array.from({length:160},(_,i)=>({done:true,points:[{x:i%10,y:i/10,t:0}],settings:{color:'#050505'}}));
 const target={canvas:surface,getTransform(){return{a:1,b:0}},save(){},restore(){},drawImage(){},globalAlpha:1};
 for(const scale of [180,220,280,350,420,510,380,240])for(const stroke of strokes)ctx.paintStroke(stroke,target,scale,scale);
 assert.equal(brushCalls,strokes.length,'zoom must reuse each completed stroke raster');
});

test('heritage names presented in the design concept are localized',()=>{
 const source=readFileSync(new URL('../heritage102-data.js',import.meta.url),'utf8');
 const context={window:{}};vm.runInNewContext(source,context);
 const names=context.window.HeritageSites102.map(row=>row[1]);
 assert.equal(names.filter(name=>!/[\u4e00-\u9fff]/.test(name)).length,0);
});
