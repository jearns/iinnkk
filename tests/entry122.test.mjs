import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../revision53.js',import.meta.url),'utf8');
const logic=source.slice(source.indexOf('window.ModeEntry122=true;'),source.indexOf("document.addEventListener('reference-loaded47'"));
function setup(){
 const drafts=new Map(),calls=[];let state={values:{ratio:'0.04',rows:'100',columns:'10'},flow:{strokes:[{id:'creation'}]}},preview=false;
 const controls={photoMode:{options:['split','left','right','bottom','editorial'].map(value=>({value}))},fitView:{click(){preview=true}}};
 const A={getState:()=>structuredClone(state),finish(){},cancelGesture110(){},showWriter(){},refresh(){},toast(){},persist(){},getReference:()=>null,setReference(){},
  async newBlank54(){calls.push('blank');state={values:{},flow:{strokes:[]}}},
  async resumeModeDraft120(d){calls.push('restore');state=structuredClone(d)},
  async configure47(c){state.values={...state.values,...c.values}},isOverview55:()=>preview};
 const context=vm.createContext({window:{},current:'letter',switching:false,A,U:{config:{nav:[]}},$:id=>controls[id],console,
  document:{body:{classList:{add(){},remove(){}}},dispatchEvent(){}},CustomEvent:class{},Revision39:{syncLock(){}},modeButtons(){},
  localStorage:{getItem:()=>null,setItem(){}},DraftStore:{get:async k=>drafts.get(k),set:async(k,v)=>drafts.set(k,structuredClone(v))},
  CopyAlbums38:{pause:async()=>calls.push('pause'),resume:async()=>false},fitReference:async()=>calls.push('reference'),loadImage:async()=>({})});
 vm.runInContext(logic,context);
 return {context,drafts,calls,state:()=>state};
}
test('v124 preserves single/copy drafts but photo and creation open fresh templates',async()=>{
 const s=setup(),M=s.context.window.Modes53;
 s.drafts.set('mode53:single',{values:{rows:'8',columns:'8'},flow:{strokes:[{id:'single'}]}});
 await M.activate({id:'single',layout:'single'},async()=>assert.fail('saved single should resume'));
 assert.equal(s.state().values.rows,'1');assert.equal(s.state().values.columns,'1');assert.equal(s.state().flow.strokes[0].id,'single');
 assert.equal(s.drafts.get('mode53:letter').flow.strokes[0].id,'creation');
 assert(s.calls.indexOf('pause')<s.calls.indexOf('blank'));
 await M.activate({id:'photo'},async()=>{});
 assert.equal(s.state().values.ratio,'0.75');assert(['split','left','right','bottom','editorial'].includes(s.state().values.photoMode));
 s.drafts.set('mode53:copy',{values:{ratio:'.5',rows:'12'},flow:{strokes:[{id:'copy'}]}});
 await M.activate({id:'copy'},async()=>assert.fail('saved copy should resume'));
 assert.equal(s.state().flow.strokes[0].id,'copy');assert.equal(s.state().values.rows,'12');
 await M.activate({id:'letter'},async()=>{});
 assert.equal(s.state().flow.strokes.length,0);assert.equal(s.state().values.ratio,'0.538889');assert.equal(s.state().values.stationery,'scroll');
 await M.activate({id:'photo'},async()=>{});assert.equal(s.state().flow.strokes.length,0);assert.equal(s.state().values.ratio,'0.75');
});
