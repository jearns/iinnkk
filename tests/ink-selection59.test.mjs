import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

test('preview recolors the whole work with one undo step and keeps stroke geometry',()=>{
  const createElement=()=>({style:{},children:[],append(...children){this.children.push(...children)},setAttribute(){},addEventListener(){},contains(){return false}});
  const sandbox={document:{createElement},globalThis:null};
  sandbox.globalThis=sandbox;
  vm.runInNewContext(readFileSync(new URL('../ink-selection.js',import.meta.url),'utf8'),sandbox);
  const original=[
    {points:[{x:1,y:2}],settings:{color:'#050505',size:35,particle:'round'},geometry:{x:1,y:0,k:1}},
    {points:[{x:3,y:4}],settings:{color:'#aabbcc',size:12,particle:'square'}}
  ];
  let strokes=original,commits=0;
  const editor=sandbox.InkSelection.create({board:createElement(),button:createElement(),presets:{zhang:{name:'张旭'}},prepare:()=>({dynamics:.7,size:90,color:'#000000'}),getStrokes:()=>strokes,bounds:()=>null,view:()=>({x:0,y:0,scale:1}),grid:()=>({}),commit:()=>commits++,replace:next=>strokes=next,toast:()=>{}});
  assert.equal(editor.effect('color','#c62820'),true);
  assert.equal(commits,1);
  assert.deepEqual(strokes.map(s=>s.settings.color),['#c62820','#c62820']);
  assert.equal(strokes[0].geometry.x,1);
  assert.equal(strokes[1].settings.size,12);
  assert.equal(editor.effect('style','zhang'),true);
  assert.equal(commits,2);
  assert.equal(strokes[0].settings.dynamics,.7);
  assert.equal(strokes[1].settings.color,'#c62820');
  assert.equal(strokes[1].settings.size,12);
  assert.throws(()=>editor.effect('color','red'),/墨色格式/);
});
