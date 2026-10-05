import{readFile,writeFile,readdir,unlink}from'node:fs/promises';
import{createHash}from'node:crypto';
import{transform}from'esbuild';
const{scripts,styles}=JSON.parse(await readFile('runtime-sources106.json','utf8'));
const sources=await Promise.all(scripts.map(p=>readFile(p,'utf8'))),groups=[];let group=[],size=0;
for(const source of sources){if(group.length&&size+source.length>450000){groups.push(group);group=[];size=0}group.push(source);size+=source.length}
if(group.length)groups.push(group);
const chunks=await Promise.all(groups.map(async items=>(await transform(items.join('\n;\n'),{minify:true,target:['safari14'],charset:'utf8',legalComments:'none'})).code));
const css=(await transform((await Promise.all(styles.map(p=>readFile(p,'utf8')))).join('\n')+'\ndialog.fallbackDialog106{position:fixed!important;z-index:2000!important;max-height:85vh;overflow:auto}dialog.fallbackDialog106:not([open]){display:none!important}',{loader:'css',minify:true,target:['safari14'],charset:'utf8'})).code;
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,16),names=chunks.map(js=>'app-runtime.'+hash(js)+'.js'),cn='app-runtime.'+hash(css)+'.css';
for(const p of await readdir('.'))if(/^app-runtime\.[a-f0-9]+\.(js|css)$/.test(p)&&!names.includes(p)&&p!==cn)await unlink(p);
for(let i=0;i<chunks.length;i++)await writeFile(names[i],chunks[i]);await writeFile(cn,css);
await writeFile('index.html',(await readFile('index-source106.html','utf8')).replace('<script defer src="__RUNTIME_JS__"></script>',names.map(name=>'<script defer src="'+name+'"></script>').join('')).replace('__RUNTIME_CSS__',cn));
console.log('Complete runtime:',names.join(' '),cn);
