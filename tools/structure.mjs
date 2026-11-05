import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const allowed=new Set(['dist','app','docs','tools','AGENTS.md','CNAME','README.md','VERSION.txt','package.json','package-lock.json','index.html','404.html','sw.js']);
for(const name of fs.readdirSync('.'))if(!name.startsWith('.')&&name!=='node_modules')assert(allowed.has(name),'Unexpected root item: '+name+'; place application files in app/');
const video=JSON.parse(fs.readFileSync('app/video-assets297/build-manifest.json'));const videoLive=new Set(Object.keys(video.outputs).map(p=>p.replace(/^\.\.\//,'')));
for(const name of fs.readdirSync('app').filter(n=>/^video-assets\d+$/.test(n))){for(const file of fs.readdirSync('app/'+name)){if(file==='build-manifest.json'&&name==='video-assets297')continue;const key=name+'/'+file;if(!videoLive.has(key)){if(process.argv.includes('--prune'))fs.unlinkSync('app/'+key);else throw Error('Unused film build: '+key);}}}
const generated=/^(?:(?:app|home)-runtime\.[a-f0-9]+\.(?:js|css)|lazy-[\w-]+\.[a-f0-9]+\.js|video-studio\.[a-f0-9]+\.css)$/;
const references=/(?:app-runtime|home-runtime|video-studio)\.[a-f0-9]+\.(?:js|css)|lazy-[\w-]+\.[a-f0-9]+\.js/g;
const history=JSON.parse(fs.readFileSync('app/runtime-history154.json'));const live=new Set([...history.current,...history.previous]);
function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','tests','maintenance','.git','release316'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())scan(p);else if(/\.(?:html|js|mjs|css)$/.test(e.name)&&!generated.test(e.name))for(const m of fs.readFileSync(p,'utf8').matchAll(references))live.add(m[0]);}}
scan('app');
let removed=0;for(const name of fs.readdirSync('app'))if(generated.test(name)&&!live.has(name)){if(process.argv.includes('--prune')){fs.unlinkSync('app/'+name);removed++}else throw Error('Unreferenced build artifact: '+name+'; run npm run build:current');}
for(const file of ['index.html','writer.html','video-studio.html','lab258.html','font258.html','practice258.html','copy259.html','handwriting254.html','timeline/manifest.json'])assert(fs.existsSync('app/'+file),'Active application entry missing: '+file);
assert(history.previous.length<=2,'Keep only the immediately previous writer release');
assert(!fs.readdirSync('app').some(n=>/^(?:writer\d+|engine\d+)\.html$/.test(n)&&n!=='writer257.html'),'Historical writer pages must route to writer.html');
console.log('Structure verified: application consolidated in app/; obsolete builds removed:',removed);
