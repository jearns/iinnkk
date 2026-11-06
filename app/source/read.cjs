// Source sections keep former module boundaries without retaining duplicate patch files.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');let index;const cache=new Map();
function sourceIndex(){return index??=JSON.parse(fs.readFileSync(path.join(__dirname,'sections.json'),'utf8'));}
function locate(file){if(typeof file!=='string')return null;const local=path.relative(root,path.resolve(file)).replaceAll('\\','/');return sourceIndex()[local]&&{...sourceIndex()[local],local};}
function readSourceSync(file,options){const section=locate(file);if(!section)return fs.readFileSync(file,options);let text=cache.get(section.file);if(text===undefined){text=fs.readFileSync(path.join(root,section.file),'utf8');cache.set(section.file,text);}const start='/* @section '+section.key+' '+section.local+' */\n',end='\n/* @endsection '+section.key+' */\n',a=text.indexOf(start),b=text.indexOf(end,a+start.length);if(a<0||b<0)throw Error('Missing source section: '+section.local);const body=text.slice(a+start.length,b);return typeof options==='string'||options?.encoding?body:Buffer.from(body);}
module.exports={readSourceSync,readSource:async(file,options)=>readSourceSync(file,options),hasSource:file=>!!locate(file)||fs.existsSync(file),sourceFiles:()=>Object.keys(sourceIndex())};
