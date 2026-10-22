import fs from 'node:fs';import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8'),places=JSON.parse(read('calligraphy-places224.json'));let keys;
for(const lang of ['en','fr','ru','ar','es']){const dict=JSON.parse(read('locales218/'+lang+'.json'));const current=Object.keys(dict).sort();if(keys)assert.deepEqual(current,keys);keys=current;for(const row of places)for(const k of ['name','country','city','institution','address','note'])if(row[k])assert.ok(dict[row[k]],lang+': '+row[k]);for(const v of Object.values(dict))assert.ok(v.trim());}
for(const p of ['index.html','writer.html','atlas223.html','works206.html','hall206.html']){const s=read(p);assert.match(s,/i18n218.js\?v=256/);assert.doesNotMatch(s.match(/<title>(.*?)<\/title>/)?.[1]||'',/手笔|亲笔/)}
const inventory=process.argv[2]?JSON.parse(read(process.argv[2])):{};for(const p of JSON.parse(read('offline-assets.json')))assert.ok(fs.existsSync(p)||inventory[p],'Missing offline asset: '+p);
console.log('Release text, language parity, place coverage and offline resources verified.');
