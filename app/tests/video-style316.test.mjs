import{readSourceSync}from'../source/read.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('documentary HTML always has its real stylesheet, with the current complete layout',()=>{
 const html=readSourceSync('video-studio.html','utf8');
 const name=html.match(/href="(video-studio\.[a-f0-9]+\.css)(?:\?[^" ]*)?"/)?.[1];
 assert.ok(name,'Documentary stylesheet is linked');
 assert.ok(fs.existsSync(name),'Documentary stylesheet must not be pruned');
 const css=readSourceSync(name,'utf8');assert.equal(css,readSourceSync('video-studio.css','utf8'));
 for(const selector of ['.vsLayout','.vsPreview','.vsTools301','.vsPanel301'])assert.ok(css.includes(selector),selector);
});
