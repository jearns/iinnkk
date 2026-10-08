import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../collaboration128.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../revision139.css',import.meta.url),'utf8');
function harness(){
  const calls=[],actions=[];
  const room={id:'room',title:'家人练字'},page={id:'page'};
  const context={listGeneration143:0,navigator:{onLine:false},room,page,backup:{editingWork110:'original'},pendingBatch:{},timer:1,generation:0,
    body:{replaceChildren(){actions.length=0},append(text){calls.push(text)}},status:{},
    document:{createTextNode:text=>text,createElement(){throw Error('active room must not create inputs')}},
    window:{Revision128:{saveOnSwitch129:async()=>calls.push('save-switch')}},
    uid:()=> 'user',flushLocal:async()=>calls.push('flush'),restoreCache133:async()=>calls.push('restore-cache'),
    persistCache133:async()=>calls.push('persist-cache'),clearInterval:()=>calls.push('stop-poll'),bar:{hidden:true},
    A:{persist:async()=>calls.push('persist'),restoreDraft:async state=>calls.push(['restore',state]),showWriter:()=>calls.push('writer'),setWorkIdentity128:id=>calls.push(['identity',id]),toast:text=>calls.push(text)},
    dialog:{open:false,showModal(){this.open=true},close(){this.open=false;calls.push('close')}},
    mark:text=>calls.push(text),roomHeading141:async()=>calls.push('room-heading'),button:(host,label,run)=>actions.push({label,run}),pages:async()=>calls.push('pages')};
  vm.createContext(context);
  const start=source.indexOf(' async function open(){');
  const end=source.indexOf(' bar.querySelector',start);
  vm.runInContext(source.slice(start,end),context);
  return {context,calls,actions};
}
test('top 共书 entry exposes page book and leave without creating or querying rooms',async()=>{
  const {context,calls,actions}=harness();
  await context.open();
  assert.deepEqual(actions.map(a=>a.label),['继续书写','共书页册','离开共书']);
  assert.equal(context.dialog.open,true);
  assert.ok(calls.includes('flush'));
  await actions.find(a=>a.label==='共书页册').run();
  assert.ok(calls.includes('pages'));
});
test('leave through top entry saves shared ink and restores previous work',async()=>{
  const {context,calls,actions}=harness();
  await context.open();await actions.find(a=>a.label==='离开共书').run();
  assert.equal(context.room,null);assert.equal(context.page,null);
  assert.equal(context.pendingBatch,null);assert.equal(context.dialog.open,false);
  assert.equal(context.bar.hidden,true);
  assert.ok(calls.includes('persist-cache'));assert.ok(calls.includes('persist'));
  assert.ok(calls.some(c=>Array.isArray(c)&&c[0]==='identity'&&c[1]==='original'));
});
test('writing never exposes lower co-writing bar and active page book retains exit',()=>{
  assert.equal(source.includes('bar.hidden=false'),false);
  assert.match(source,/if\(page\)leaveAction139\(body\)/);
  assert.match(css,/\.collabBar128\{display:none!important\}/);
});
test('reference controls have no plates in normal, pressed and hover states',()=>{
  for(const selector of ['header','footer','button:hover','button:active','button[aria-pressed=true]'])assert.ok(css.includes('.referenceFloat129.referenceFloat129 '+selector));
  assert.match(css,/background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important/);
  const styles=JSON.parse(fs.readFileSync(new URL('../runtime-sources106.json',import.meta.url),'utf8')).styles;
  assert.ok(styles.indexOf('revision139.css')>styles.indexOf('revision133.css'));
});
