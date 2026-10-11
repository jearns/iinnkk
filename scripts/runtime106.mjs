import{readFile,writeFile,readdir,unlink}from'node:fs/promises';
import{createHash}from'node:crypto';
import{transform}from'esbuild';
const{scripts,styles}=JSON.parse(await readFile('runtime-sources106.json','utf8'));
const sources=await Promise.all(scripts.map(p=>readFile(p,'utf8'))),groups=[];let group=[],size=0;
for(const [index,source] of sources.entries()){if(group.length&&(scripts[index-1]==='writer-entry154.js'||size+source.length>120000)){groups.push(group);group=[];size=0}group.push(source);size+=source.length}
if(group.length)groups.push(group);
const chunks=await Promise.all(groups.map(async items=>(await transform(items.map(source=>'{const started173=performance.now();try {\n'+source+'\n} catch(error) { window.StartupErrors106?.push(String(error?.message||error)); console.error("Startup module",error); }finally{window.WriterStartup173?.module('+JSON.stringify(scripts[sources.indexOf(source)])+',performance.now()-started173)}}').join('\n;\n'),{minify:true,target:['safari13','chrome79'],charset:'utf8',legalComments:'none'})).code));
const css=(await transform((await Promise.all(styles.map(p=>readFile(p,'utf8')))).join('\n')+'\ndialog.fallbackDialog106{position:fixed!important;z-index:2000!important;max-height:85vh;overflow:auto}dialog.fallbackDialog106:not([open]){display:none!important}',{loader:'css',minify:true,target:['safari13','chrome79'],charset:'utf8'})).code;
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,16),names=chunks.map(js=>'app-runtime.'+hash(js)+'.js'),cn='app-runtime.'+hash(css)+'.css';
const release=(await readFile('VERSION.txt','utf8')).match(/网页版\s*(\d+(?:\.\d+)?)/)?.[1],history=JSON.parse(await readFile('runtime-history154.json','utf8').catch(()=>'{}')),previous=[];
for(const p of await readdir('.'))if(/^app-runtime\.[a-f0-9]+\.(js|css)$/.test(p)&&!names.includes(p)&&p!==cn&&!previous.includes(p))await unlink(p);
await writeFile('runtime-history154.json',JSON.stringify({release,current:[...names,cn],previous},null,2)+'\n');
for(let i=0;i<chunks.length;i++)await writeFile(names[i],chunks[i]);await writeFile(cn,css);
const bootCount=groups.findIndex(items=>items.some(source=>source.includes('window.WriterEntry154={ready:')))+1,bootNames=names.slice(0,bootCount),laterNames=names.slice(bootCount);
const tags='<script>InkBoot146.setTotal('+bootCount+');(function(){var remaining='+names.length+',timers={},core='+JSON.stringify(bootNames)+';window.WriterModules173=new Promise(function(resolve,reject){window.WriterPart177=function(name,failed){clearTimeout(timers[name]);if(failed){var message="书写模块未能加载："+name;if(core.indexOf(name)>=0)window.WriterStartupFailure163=message;else (window.RuntimeWarnings181||(window.RuntimeWarnings181=[])).push(message);reject(new Error(message));return}if(--remaining===0)resolve()};'+JSON.stringify(names)+'.forEach(function(name){timers[name]=setTimeout(function(){window.WriterPart177(name,true)},120000)});});window.WriterModules173.catch(function(error){console.error(error)})})();</script>'+names.map((name,i)=>'<script defer src="'+name+'" onload="'+(i<bootCount?'InkBoot146.part();':'')+"WriterPart177('"+name+"',false)"+'" onerror="InkBoot146.failed();'+"WriterPart177('"+name+"',true)"+'"></script>').join('');
await writeFile('writer.html',(await readFile('index-source106.html','utf8')).replace('<script defer src="__RUNTIME_JS__"></script>',tags).replace('__RUNTIME_CSS__',cn));


















 




await writeFile('engine187.html',await readFile('writer.html','utf8'));
console.log('Complete runtime:',names.join(' '),cn);

await import('./home154.mjs');


// A changed release always gets a fresh code cache, including follow-up fixes within one round.
const cacheFingerprint182=hash((await readFile('writer.html','utf8'))+(await readFile('index.html','utf8'))+(await readFile('brand.svg','utf8'))+(await readFile('favicon.svg','utf8')));
const worker182=await readFile('sw.js','utf8');await writeFile('sw.js',worker182.replace(/annotation-core[\w.]+/g,'annotation-core'+release+'.'+cacheFingerprint182));
