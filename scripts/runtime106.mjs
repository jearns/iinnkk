import{readFile,writeFile,readdir,unlink}from'node:fs/promises';
import{createHash}from'node:crypto';
import{transform}from'esbuild';
const{scripts,styles}=JSON.parse(await readFile('runtime-sources106.json','utf8'));
const sources=await Promise.all(scripts.map(p=>readFile(p,'utf8'))),groups=[];let group=[],size=0;
for(const [index,source] of sources.entries()){if(group.length&&(scripts[index-1]==='writer-entry154.js'||size+source.length>450000)){groups.push(group);group=[];size=0}group.push(source);size+=source.length}
if(group.length)groups.push(group);
const chunks=await Promise.all(groups.map(async items=>(await transform(items.map(source=>'try {\n'+source+'\n} catch(error) { window.StartupErrors106?.push(String(error?.message||error)); console.error("Startup module",error); }').join('\n;\n'),{minify:true,target:['safari13','chrome79'],charset:'utf8',legalComments:'none'})).code));
const css=(await transform((await Promise.all(styles.map(p=>readFile(p,'utf8')))).join('\n')+'\ndialog.fallbackDialog106{position:fixed!important;z-index:2000!important;max-height:85vh;overflow:auto}dialog.fallbackDialog106:not([open]){display:none!important}',{loader:'css',minify:true,target:['safari13','chrome79'],charset:'utf8'})).code;
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,16),names=chunks.map(js=>'app-runtime.'+hash(js)+'.js'),cn='app-runtime.'+hash(css)+'.css';
const release=(await readFile('VERSION.txt','utf8')).match(/网页版\s*(\d+(?:\.\d+)?)/)?.[1],history=JSON.parse(await readFile('runtime-history154.json','utf8').catch(()=>'{}')),previous=history.release===release?history.previous||[]:history.current||[];
for(const p of await readdir('.'))if(/^app-runtime\.[a-f0-9]+\.(js|css)$/.test(p)&&!names.includes(p)&&p!==cn&&!previous.includes(p))await unlink(p);
await writeFile('runtime-history154.json',JSON.stringify({release,current:[...names,cn],previous},null,2)+'\n');
for(let i=0;i<chunks.length;i++)await writeFile(names[i],chunks[i]);await writeFile(cn,css);
const bootCount=groups.findIndex(items=>items.some(source=>source.includes('window.WriterEntry154={ready:')))+1,bootNames=names.slice(0,bootCount),laterNames=names.slice(bootCount);
const tags='<script>InkBoot146.setTotal('+bootCount+')</script>'+bootNames.map(name=>'<script defer src="'+name+'" onload="InkBoot146.part()" onerror="InkBoot146.failed()"></script>').join('')+laterNames.map(name=>'<link rel="preload" as="script" href="'+name+'">').join('')+'<script>document.addEventListener("DOMContentLoaded",function(){var names='+JSON.stringify(laterNames)+';function next(){var name=names.shift();if(!name)return;var s=document.createElement("script");s.src=name;s.onload=function(){setTimeout(next,0)};s.onerror=function(){console.error("Optional writer module failed",name);setTimeout(next,0)};document.head.appendChild(s)}setTimeout(next,60)},{once:true})</script>';
await writeFile('writer.html',(await readFile('index-source106.html','utf8')).replace('<script defer src="__RUNTIME_JS__"></script>',tags).replace('__RUNTIME_CSS__',cn));
await writeFile('engine158.html',await readFile('writer.html','utf8'));
await writeFile('engine159.html',await readFile('writer.html','utf8'));
await writeFile('engine160.html',await readFile('writer.html','utf8'));
await writeFile('engine161.html',await readFile('writer.html','utf8'));
console.log('Complete runtime:',names.join(' '),cn);

await import('./home154.mjs');
