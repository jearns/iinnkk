import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
test('work-list animation uses saved draft environment and progressively reveals strokes',async()=>{
 let created=0,removed=0;const rendered=[];
 const app={ready:true,async renderSavedDraft179(draft,options){rendered.push({draft,options});return 'frame'}};
 const root={InkStickers279:{partial(strokes,f){return strokes.map(s=>({...s,points:s.points.slice(0,Math.max(1,Math.ceil(s.points.length*f)))}))}}};
 const doc={createElement(){created++;return{style:{},setAttribute(){},contentWindow:{AnnotationApp:app},remove(){removed++},set src(v){this.address=v}}},body:{append(frame){queueMicrotask(()=>frame.onload())}}};
 vm.runInNewContext(readFileSync(new URL('../release281/work-renderer.js',import.meta.url),'utf8'),{window:root,document:doc,structuredClone,setTimeout,clearTimeout,Date,Error,Math});
 const source={values:{papercolor:'#abc',ratio:'3:4'},photos:[{id:'photo'}],mountKey:'gold',flow:{strokes:[{points:[{x:0},{x:.5},{x:1}],settings:{color:'#ad0000'}}]},signatureStrokes:[]};const original=JSON.stringify(source);
 const frame=root.WorkStickerRenderer281.frameFactory(source);assert.equal(created,0);await frame(0);await frame(1);await frame(.5,{style:'blue',inkChanged:true,color:'#005500'});
 assert.equal(created,1);assert.equal(rendered[0].draft.flow.strokes.length,0);assert.equal(rendered[1].draft.flow.strokes[0].points.length,3);assert.equal(rendered[2].draft.flow.strokes[0].points.length,2);assert.equal(rendered[2].draft.values.papercolor,'#2367a1');assert.equal(rendered[2].draft.flow.strokes[0].settings.color,'#005500');assert.equal(rendered[1].draft.mountKey,'gold');assert.equal(rendered[1].draft.photos[0].id,'photo');assert.equal(JSON.stringify(source),original);frame.close();assert.equal(removed,1);await assert.rejects(frame(1),/关闭/);
});
