import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
function vector(){const c=vm.createContext({});vm.runInContext(read('brush.js'),c);vm.runInContext(read('vector123.js'),c);return c.InkVector123;}
const stroke={seed:8,done:true,settings:{size:30,color:'#123456',dry:.8},points:[{x:1,y:1,t:0},{x:1.2,y:1.5,t:20},{x:1.5,y:2,t:40}]};
test('SVG uses closed vector shapes, colour and physical size without bitmap assets',()=>{
 const svg=vector().exportInk([stroke],{width:4,height:8});assert.match(svg,/viewBox="0 0 1560 3120"/);assert.match(svg,/width="100mm"/);assert.match(svg,/<path/);assert.match(svg,/#123456/);assert.match(svg,/ Z"/);assert.doesNotMatch(svg,/<image|data:image|NaN|Infinity/);
});
test('SVG geometry remains transformed and monochrome export leaves original untouched',()=>{
 const s={...stroke,geometry:{x:1,y:2,k:.5,r:Math.PI/2}},before=JSON.stringify(s),svg=vector().exportInk([s],{monochrome:true});assert.match(svg,/fill="#000000"/);assert.equal(JSON.stringify(s),before);assert.doesNotMatch(svg,/NaN|Infinity/);
});
test('SVG tap and empty work are valid; rejects nonfinite paper size',()=>{
 const v=vector();assert.match(v.exportInk([{...stroke,points:stroke.points.slice(0,1)}]),/<path/);assert.doesNotMatch(v.exportInk([]),/<path/);assert.throws(()=>v.exportInk([],{height:Infinity}));
});
test('v123 clears stale input state, retains watermark and removes photo cover at source',()=>{
 const app=read('app.js');assert.match(app,/loadEditableDraft\(draft\)\{resetInput123\(\)/);assert.match(app,/newBlank54\(\)\{resetInput123\(\)/);assert.match(app,/if\(photoEditing\)endPhotoEdit\(\)/);assert.match(read('revision120.js'),/双指自由拖动纸张/);assert.doesNotMatch(read('revision120.js'),/落笔即可开始/);assert.doesNotMatch(read('features106.js'),/朋友圈封面/);assert.match(read('revision120.css'),/#board #live\{pointer-events:auto!important;touch-action:none!important/);
});
test('long scroll preview precision scales down instead of imposing 128x per stroke',()=>{
 assert.match(read('app.js'),/Math\.log2\(Math\.max\(1,requested\)\)/);
});
test('input reset actually exits photo editing and removes selection blockers',()=>{
 const app=read('app.js'),source=app.slice(app.indexOf('function resetInput123()'),app.indexOf('function cancelGesture110()'));
 const elements=new Map(),calls=[],context=vm.createContext({photoEditing:true,selectedSeal:'head',photoGesture:{},writingOnPhoto:false,photoTouches:new Map([[7,{}]]),window:{inkEditor:{close:()=>calls.push('close')}},endPhotoEdit(){calls.push('photo')},$:id=>{if(!elements.has(id))elements.set(id,{hidden:false});return elements.get(id)}});
 vm.runInContext(source,context);context.resetInput123();assert.deepEqual(calls,['photo','close']);assert.equal(context.selectedSeal,null);assert.equal(context.photoTouches.size,0);assert.equal(context.photoGesture,null);assert.equal(context.writingOnPhoto,true);assert([...elements.values()].every(e=>e.hidden));
});
