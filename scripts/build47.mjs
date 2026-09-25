import {build} from 'esbuild';
import {mkdir,copyFile,rm,cp,readFile,writeFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

const root=process.cwd();
const excluded=new Set(['.git','.env','.openai','.sites-runtime','dist','downloads','updates','apple','wechat','node_modules','.wrangler']);
async function files(dir=''){
 const result=[];
 for(const entry of await readdir(path.join(root,dir),{withFileTypes:true})){
  if(!dir&&(excluded.has(entry.name)||entry.name.startsWith('.sites-checkout')))continue;
  const name=path.posix.join(dir,entry.name);
  if(entry.isDirectory())result.push(...await files(name));
  else if(entry.isFile()&&!name.endsWith('.zip')&&!name.endsWith('.tar.gz'))result.push(name);
 }
 return result.sort();
}
async function assetFiles(){
 const names=JSON.parse(await readFile('site-assets.json','utf8')),out=[];
 for(const name of names){const entry=await stat(name).catch(()=>null);if(!entry)continue;
  const paths=entry.isDirectory()?await files(name):[name];
  for(const p of paths)if(/\.(js|html|css|woff2?|png|webp|jpg|mp3|json)$/.test(p)&&!p.startsWith('downloads/')&&!['sw.js','offline-assets.json'].includes(p))out.push(p);
 }
 return out;
}
await build({entryPoints:['scripts/qr-entry47.js'],outfile:'qr47.js',bundle:true,minify:true,platform:'browser',format:'iife'});
const assets=await assetFiles(),core=assets.filter(x=>!x.includes('/')||x==='fonts/shuowen-core45.woff');
await writeFile('offline-assets.json',JSON.stringify(assets));
await writeFile('sw.js',`const CACHE='annotation-core59',ASSETS='annotation-assets59',CORE=${JSON.stringify(core)};
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const key of await caches.keys())if((key.startsWith('annotation-core')&&key!==CACHE)||(key.startsWith('annotation-assets')&&key!==ASSETS))await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/')||u.pathname.startsWith('/signin-')||u.pathname.startsWith('/signout-')||u.pathname.includes('/downloads/')||u.pathname.endsWith('/download.html'))return;e.respondWith((async()=>{const code=e.request.mode==='navigate'||/\\.(js|css|html|json)$/.test(u.pathname);if(code){const c=await caches.open(CACHE);try{const r=await fetch(e.request,{cache:'no-cache'});if(r.ok)await c.put(e.request.mode==='navigate'?'index.html':e.request,r.clone());return r}catch{const hit=await c.match(e.request.mode==='navigate'?'index.html':e.request,{ignoreSearch:e.request.mode==='navigate'});return hit||Response.error()}}const c=await caches.open(ASSETS),hit=await c.match(e.request,{ignoreSearch:true});if(hit)return hit;const r=await fetch(e.request);if(r.ok)await c.put(e.request,r.clone());return r})())});
`);
const source=await files(),parts=[];
for(const name of source){const data=await readFile(name);parts.push({name,url:name,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});}
const manifest={filename:'iinnkk-web-v59.zip',bytes:parts.reduce((n,p)=>n+p.bytes,0),parts};
await mkdir('downloads',{recursive:true});await writeFile('downloads/manifest.json',JSON.stringify(manifest));
await rm('dist',{recursive:true,force:true});await mkdir('dist/client',{recursive:true});
for(const name of [...source,'downloads/manifest.json']){const dest=path.join('dist/client',name);await mkdir(path.dirname(dest),{recursive:true});await copyFile(name,dest);}
await build({entryPoints:['server/worker47.mjs'],outfile:'dist/server/index.js',bundle:true,minify:false,platform:'browser',format:'esm',target:'es2022'});
await mkdir('dist/.openai',{recursive:true});await writeFile('dist/.openai/hosting.json',await readFile('.openai/hosting.json','utf8').catch(()=>JSON.stringify({d1:'DB',r2:'BUCKET'})));await cp('drizzle','dist/.openai/drizzle',{recursive:true});
console.log('Web + online service build complete');
