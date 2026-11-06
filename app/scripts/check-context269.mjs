import{readSourceSync}from'../source/read.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';
const writing=['writer.html','writer257.html','self-portrait257.html','crossword242.html','word-duel241.html','copy259.html','practice258.html','font258.html','handwriting254.html','wish283.html','sticker281.html'];
for(const file of writing){const html=readSourceSync(file,'utf8');assert.match(html,/context-guard269\.js/,'Writing selection guard missing: '+file)}
const guard=readSourceSync('context-guard269.js','utf8');for(const name of ['contextmenu','copy','dragstart','selectstart','selectionchange','webkit-touch-callout','webkit-user-select'])assert.ok(guard.includes(name),'Missing writing selection protection: '+name);
console.log('Writing-page right-click, copy and touch-selection protections verified.');
