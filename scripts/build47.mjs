import {build} from 'esbuild';
import {mkdir,copyFile,rm,cp,readFile,writeFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

const root=process.cwd();
const release=(await readFile('VERSION.txt','utf8')).match(/网页版\s*(\d+)/)?.[1];
if(!release)throw Error('Missing release version');
const excluded=new Set(['.git','.env','.openai','.sites-runtime','dist','downloads','updates','apple','wechat','node_modules','.wrangler']);
async function files(dir=''){
 const result=[];
 for(const entry of await readdir(path.join(root,dir),{withFileTypes:true})){
  if(!dir&&(excluded.has(entry.name)||entry.name==='.gitignore'||entry.name.startsWith('.sites-checkout')))continue;
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
  for(const p of paths)if(/\.(js|html|css|woff2?|png|webp|jpg|svg|mp3|json)$/.test(p)&&!p.startsWith('downloads/')&&!['sw.js','offline-assets.json'].includes(p))out.push(p);
 }
 return out;
}
await build({entryPoints:['scripts/qr-entry47.js'],outfile:'qr47.js',bundle:true,minify:true,platform:'browser',format:'iife'});
const assets=await assetFiles(),core=assets.filter(x=>!x.includes('/')||x==='fonts/shuowen-core45.woff');
await writeFile('offline-assets.json',JSON.stringify(assets));
const worker=await readFile('sw.js','utf8');
await writeFile('sw.js',worker.replace(/annotation-core\d+/g,'annotation-core'+release).replace(/annotation-assets\d+/g,'annotation-assets'+release).replace(/CORE=\[[^;]+;/,'CORE='+JSON.stringify(core)+';'));
const source=await files(),parts=[];
for(const name of source){const data=await readFile(name);parts.push({name,url:name,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});}
const manifest={filename:'iinnkk-web-v'+release+'.zip',bytes:parts.reduce((n,p)=>n+p.bytes,0),parts};
await mkdir('downloads',{recursive:true});await writeFile('downloads/manifest.json',JSON.stringify(manifest));
await rm('dist',{recursive:true,force:true});await mkdir('dist/client',{recursive:true});
for(const name of [...source,'downloads/manifest.json']){const dest=path.join('dist/client',name);await mkdir(path.dirname(dest),{recursive:true});await copyFile(name,dest);}
await build({entryPoints:['server/worker47.mjs'],outfile:'dist/server/index.js',bundle:true,minify:false,platform:'browser',format:'esm',target:'es2022'});
await mkdir('dist/.openai',{recursive:true});await writeFile('dist/.openai/hosting.json',await readFile('.openai/hosting.json','utf8').catch(()=>JSON.stringify({d1:'DB',r2:'BUCKET'})));await cp('drizzle','dist/.openai/drizzle',{recursive:true});
console.log('Web + online service build complete');
