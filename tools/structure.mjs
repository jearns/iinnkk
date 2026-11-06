import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
const allowed=new Set(['dist','app','docs','tools','AGENTS.md','_config.yml','CNAME','README.md','VERSION.txt','package.json','package-lock.json','index.html','404.html','sw.js']);
for(const name of fs.readdirSync('.'))if(!name.startsWith('.')&&name!=='node_modules')assert(allowed.has(name),'Unexpected root item: '+name+'; place application files in app/');
const video=JSON.parse(fs.readFileSync('app/assets/video/build-manifest.json'));const previousVideo=fs.existsSync('app/assets/video/previous-manifest.json')?JSON.parse(fs.readFileSync('app/assets/video/previous-manifest.json')):{outputs:{}};const videoLive=new Set([...Object.keys(video.outputs),...Object.keys(previousVideo.outputs)].map(p=>p.replace(/^\.\.\//,'')));
for(const name of ['assets/video']){for(const file of fs.readdirSync('app/'+name)){if(['build-manifest.json','previous-manifest.json'].includes(file)&&name==='assets/video')continue;const key=name+'/'+file;if(!videoLive.has(key)){if(process.argv.includes('--prune'))fs.unlinkSync('app/'+key);else throw Error('Unused film build: '+key);}}}
const generated=/^(?:(?:app|home)-runtime\.[a-f0-9]+\.(?:js|css)|lazy-[\w-]+\.[a-f0-9]+\.js|video-studio\.[a-f0-9]+\.css)$/;
const references=/(?:app-runtime|home-runtime|video-studio)\.[a-f0-9]+\.(?:js|css)|lazy-[\w-]+\.[a-f0-9]+\.js/g;
const history=JSON.parse(fs.readFileSync('app/runtime-history154.json'));const live=new Set([...history.current,...history.previous]);
function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','tests','maintenance','.git','source'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())scan(p);else if(/\.(?:html|js|mjs|css)$/.test(e.name)&&!generated.test(e.name))for(const m of fs.readFileSync(p,'utf8').matchAll(references))live.add(m[0]);}}
scan('app');
let removed=0;for(const name of fs.readdirSync('app'))if(generated.test(name)&&!live.has(name)){if(process.argv.includes('--prune')){fs.unlinkSync('app/'+name);removed++}else throw Error('Unreferenced build artifact: '+name+'; run npm run build:current');}
for(const file of ['index.html','writer.html','video-studio.html','lab258.html','font258.html','practice258.html','copy259.html','handwriting254.html','timeline/manifest.json'])assert(fs.existsSync('app/'+file),'Active application entry missing: '+file);
assert(history.previous.length<=2,'Keep only the immediately previous writer release');
assert(!fs.readdirSync('app').some(n=>/^(?:writer\d+|engine\d+)\.html$/.test(n)&&n!=='writer257.html'),'Historical writer pages must route to writer.html');
console.log('Structure verified: application consolidated in app/; obsolete builds removed:',removed);

// Validate each retained HTML dependency, including assets missing from disk.
const tracked=new Set(execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0'));
for(const file of fs.readdirSync('app').filter(n=>n.endsWith('.html'))){
 const html=fs.readFileSync('app/'+file,'utf8');
 for(const tag of html.matchAll(/<(?:script|link)\b[^>]*>/g)){
  if(tag[0].startsWith('<link')&&!/rel=["']stylesheet["']/.test(tag[0]))continue;
  const raw=tag[0].match(/(?:src|href)=["']([^"']+)["']/)?.[1];
  if(!raw||/^(?:https?:|data:|blob:|#)/.test(raw)||/^__[A-Z_]+__$/.test(raw))continue;
  const url=new URL(raw,'https://iinnkk.me/app/'+file),local=url.pathname.slice(1);
  assert(fs.existsSync(local)||tracked.has(local),'Page dependency missing: '+file+' -> '+raw);
 }
}
console.log('Retained HTML stylesheet and script dependencies verified.');

const retired=JSON.parse(fs.readFileSync('app/maintenance/retired-files.json'));
for(const file of retired.files)assert(!fs.existsSync('app/'+file),'Retired duplicate was recreated: '+file);
for(const name of fs.readdirSync('app'))assert(!/^video-music\d+$/.test(name),'Use music/library, not another versioned audio directory: '+name);

// Enforce functional ownership and prevent another generation of patch directories.
for(const name of fs.readdirSync('app')){
 assert(!/^(?:release|hand|fonts?|lab|guides|banners|children|characters|vendor|oracle|words|world|media|collectors|video-assets)\d+$/.test(name),'Numbered feature directory: '+name);
 assert(!/^revision.*\.(?:js|css)$/.test(name),'Edit source/writer.js or source/interface.css: '+name);
}

// Shared page CSS retains only outputs referenced by current pages/code and the previous writer.
const pageStyles=new Set();
function uiReferences(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','tests','maintenance','.git','scripts'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())uiReferences(p);else if(/\.(?:html|js|mjs|css)$/.test(e.name)&&!p.startsWith('app/assets/ui/'))for(const m of fs.readFileSync(p,'utf8').matchAll(/assets\/ui\/[a-f0-9]+\.css/g))pageStyles.add(m[0]);}}
uiReferences('app');
for(const file of fs.readdirSync('app/assets/ui'))if(!pageStyles.has('assets/ui/'+file)){if(process.argv.includes('--prune'))fs.unlinkSync('app/assets/ui/'+file);else throw Error('Unused page stylesheet: '+file);}
const sections=JSON.parse(fs.readFileSync('app/source/sections.json'));
for(const file of Object.keys(sections))assert(!fs.existsSync('app/'+file),'Consolidated source was duplicated: '+file);
