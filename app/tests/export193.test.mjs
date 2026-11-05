import test from 'node:test';import assert from 'node:assert/strict';import{createRequire}from'node:module';import{compose}from'../copy-download182.js';
const require=createRequire(import.meta.url),{createCanvas,Image}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
test('saved descriptor-only copy exports with its own stored page values and one decode per image',async()=>{
 const sample=createCanvas(40,60).toBuffer('image/png');let loads=0,footerDraft;const draft={values:{papercolor:'transparent'},flow:{strokes:[{}]},paletteCredit96:{name:'此页配色'}};
 globalThis.Image=class extends Image{set src(value){if(!value)return;loads++;super.src=sample;queueMicrotask(()=>this.onload?.())}get naturalWidth(){return this.width}get naturalHeight(){return this.height}};
 globalThis.document={createElement:()=>{const c=createCanvas(1,1);c.toBlob=fn=>fn(new Blob([c.toBuffer('image/png')],{type:'image/png'}));return c}};
 globalThis.DraftStore={get:async key=>key==='saved-page'?draft:null};globalThis.CopyIntegrity181={draftOwned:()=>true};globalThis.AnnotationApp={renderSavedDraft179:async()=> 'art'};globalThis.Revision110={designIdea:(idea,d)=>{footerDraft=d;return d.values.papercolor}};globalThis.BrandCredit182={draw(){}};
 const blob=await compose({id:'book',pages:[{id128:'page',draftRef192:'saved-page',image:'original'}]},[0],'compare',{previewMax187:600});assert.ok(blob.size>100);assert.equal(footerDraft,draft);assert.equal(loads,2);
 // Legacy image-only work has no vector draft and must still be downloadable.
 globalThis.DraftStore={get:async key=>key.includes(':art161:')?'old-art':null};globalThis.Revision94={current:{name:'legacy'}};footerDraft=null;
 const legacy=await compose({id:'old',pages:[{id128:'p',owned181:true}]},[0],'single',{previewMax187:600});assert.ok(legacy.size>100);assert.equal(footerDraft,null);
});
