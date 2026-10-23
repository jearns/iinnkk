import{readFile,writeFile,readdir}from'node:fs/promises';
import{createHash}from'node:crypto';
const aliases=[];
async function alias(source,label){const body=await readFile(source,'utf8'),name=`lazy-${label}.${createHash('sha256').update(body).digest('hex').slice(0,16)}.js`;await writeFile(name,body);aliases.push({source,name});return name}
async function change(path,pattern,value){await writeFile(path,(await readFile(path,'utf8')).replace(pattern,value))}
const copy=await alias('copy-download218.js','copy');
await change('export-studio182.js',/(?:copy-download218|lazy-copy\.[a-f0-9]+)\.js(?:\?[^'"\s]*)?/g,copy);
const exporter=await alias('export-studio182.js','export');
await change('export-host255.js',/(?:export-studio182|lazy-export\.[a-f0-9]+)\.js(?:\?[^'"\s]*)?/g,exporter);
await alias('export-host255.js','host');
const print=await alias('hand254/print-runtime254.js','print3d');
await change('hand257/print-page.js',/(?:hand254\/print-runtime254|lazy-print3d\.[a-f0-9]+)\.js(?:\?[^'"\s]*)?/g,print);
await alias('hand257/print-page.js','printpage');
for(const [source,label]of [['hand255/photo.js','photo'],['hand254/portrait.js','portrait'],['hand254/workshop.js','workshop'],['works206.js','works'],['manage234.js','manage'],['lab242/game.js','game'],['lab242/artwork250.js','artwork'],['i18n218.js','i18n']])await alias(source,label);
const old=JSON.parse(await readFile('lazy-assets257.json','utf8').catch(()=> '[]'));const previous=Array.isArray(old)?old:Object.values(old);
for(const path of ['index.html','index-source106.html','atlas223.html','crossword242.html','hall206.html','handwriting254.html','ink-person254.html','lab240.html','learning242.html','manage234.html','works206.html','self-portrait257.html','print257.html','random-copy257.html','lab258.html','font258.html','practice258.html','copy259.html','writer.html','writer257.html']){let body=await readFile(path,'utf8');for(const {source,name}of aliases){const label=name.match(/^lazy-(.+)\.[a-f0-9]+\.js$/)[1];const escaped=source.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');body=body.replace(new RegExp(`(?<=["'])(${escaped}|lazy-${label}\\.[a-f0-9]+\\.js)(?:\\?[^"']*)?(?=["'])`,'g'),name)}body=body.replace(/href="lab240.html"/g,'href="lab257.html"');await writeFile(path,body)}
await writeFile('lab257.html',await readFile('lab240.html'));
let offline=await readFile('scripts/offline198.mjs','utf8');for(const {source,name}of aliases){offline=offline.replaceAll(source,name);for(const prior of previous)if(prior.source===source)offline=offline.replaceAll(prior.name,name)}if(!offline.includes("'lab257.html'"))offline=offline.replace("'lab240.html'","'lab240.html','lab257.html'");await writeFile('scripts/offline198.mjs',offline);
await writeFile('lazy-assets257.json',JSON.stringify(aliases,null,2)+'\n');
