import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../collaboration128.js',import.meta.url),'utf8');
function harness(owner='me'){
 const actions=[],calls=[],room={id:'room',owner,title:'墨缘'},page={id:'page',title:'纸页'};
 const node=()=>({append(){},replaceChildren(){},setAttribute(){},add(){}});
 const c={room,page,cached:{pages:{room:[page]}},uid:()=> 'me',navigator:{onLine:false},body:node(),document:{createElement:node},Option:function(text,value){this.value=value},roomHeading141:async()=>{},button:(host,label,run)=>actions.push({label,run}),lifecycle142:async r=>calls.push(['dissolve',r.id]),handoff144:async()=>calls.push('handoff'),dialog:{open:false,showModal(){this.open=true},close(){this.open=false;calls.push('close')}},A:{showWriter:()=>calls.push('writer')},persistCache133:async()=>{},mark:()=>{},openPage:async p=>calls.push(['page',p.id])};
 vm.createContext(c);
 vm.runInContext(source.slice(source.indexOf(' function lifecycleButtons142('),source.indexOf('\n',source.indexOf(' function lifecycleButtons142('))),c);
 vm.runInContext(source.slice(source.indexOf(' async function dashboard145('),source.indexOf(' async function open(){')),c);
 return {c,actions,calls};
}
test('shared owner dashboard has Enter and Dissolve; Enter hands off before returning to paper',async()=>{
 const {c,actions,calls}=harness();await c.dashboard145();assert.deepEqual(actions.map(a=>a.label),['进入','解散']);await actions[0].run();assert.deepEqual(calls,['handoff','close','writer']);await actions[1].run();assert.deepEqual(calls.at(-1),['dissolve','room']);
});
test('invited participant can enter but cannot dissolve the owner’s room',async()=>{
 const {c,actions}=harness('other');await c.dashboard145();assert.deepEqual(actions.map(a=>a.label),['进入']);
});
