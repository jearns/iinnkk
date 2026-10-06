import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8'),code=source.slice(source.indexOf('function exportInkColor126('),source.indexOf('function renderInk('));
function color(ink,options,bg){const s={compositionOptions:options,$:()=>({value:bg})};vm.createContext(s);vm.runInContext(code,s);return s.exportInkColor126(ink)}
test('removing white paper color cannot leave white ink on white',()=>assert.equal(color('#fffaf0',{paperColor:false,inkColor:true},'#171717'),'#050505'));
test('removing ink color selects visible neutral ink on dark paper',()=>assert.equal(color('#a52323',{inkColor:false,paperColor:true},'#121212'),'#fffaf0'));
test('removing all color toggles keeps black strokes visible',()=>assert.equal(color('#fff',{paperColor:false,inkColor:false},'#050505'),'#050505'));
test('unchanged colors preserve original brush settings',()=>assert.equal(color('#fafafa',{paperColor:true,inkColor:true},'#121212'),'#fafafa'));
