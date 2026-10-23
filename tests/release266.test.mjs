import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
test('portrait preloads the actual input surface and uses direct invocation for dashed words',()=>{
 const html=read('self-portrait257.html'),js=read('hand255/photo.js');
 assert.match(html,/<script defer src="hand266\/input-surface.js"><\/script>/);
 assert.match(html,/id="portraitMissing255"[^>]+data-no-handwriting254/);
 assert.doesNotMatch(html,/id="portraitMissing255"[^>]+ hidden/);
 assert.match(js,/b\.dataset\.missing==='true'[\s\S]+openWriting266\('fill',word\)/);
 assert.match(js,/HandInputSurface254\.open\(field\)/);
 assert.doesNotMatch(js,/HandInput254\.handwrite\(field\)/);
 assert.match(html,/id="qualityNew265"><svg/);
});
test('portrait handwriting enters the real glyph ledger and ark displays only handwritten samples',()=>{
 const surface=read('hand266/input-surface.js'),ledger=read('handwriting-ledger254.js'),ark=read('hand254/workshop.js'),html=read('handwriting254.html');
 const root={},context={window:root,crypto:{randomUUID:()=> 'test266'},localStorage:{getItem:()=>null},document:{addEventListener(){}}};vm.runInNewContext(surface,context,{filename:'hand266/input-surface.js'});
 assert.equal(typeof root.HandInputSurface254.open,'function');
 assert.match(surface,/source:field\.id==='portraitMissing255'\?'portrait':'input'/);
 assert.match(ledger,/portrait:'相由字生'/);
 assert.match(ark,/source:\['large','crossword','input','portrait'\]/);
 assert.doesNotMatch(html,/qualityArchive265|qualities265/);
});
