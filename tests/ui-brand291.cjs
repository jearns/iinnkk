// A one-frame export catches differences between the Player and Web Renderer.
const {chromium}=require('playwright'),{build}=require('esbuild'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
(async()=>{
 const output='/tmp/shoubi-brand291';fs.mkdirSync(output,{recursive:true});
 const {disposalPrelude}=await import('../remotion-studio/scripts/disposal-prelude.mjs');
 const {containTelemetryRejection}=await import('../remotion-studio/scripts/telemetry-compat.mjs');
 const built=await build({stdin:{contents:`import React from 'react';import {ShoubiShowcase} from './src/showcase.jsx';import {renderMediaOnWeb} from '@remotion/web-renderer';window.exportBrand291=async({scale,frame})=>{const {getBlob}=await renderMediaOnWeb({composition:{id:'Brand291',component:ShoubiShowcase,durationInFrames:450,fps:30,width:1080,height:1440},inputProps:{title:'',signature:'',paperColor:'#eee'},container:'mp4',videoCodec:'h264',muted:true,scale,frameRange:[frame,frame],pageResponsiveness:'high'});const b=await getBlob();return Array.from(new Uint8Array(await b.arrayBuffer()));};`,resolveDir:path.resolve('remotion-studio'),loader:'jsx'},bundle:true,minify:true,platform:'browser',format:'iife',target:['es2022','safari26'],write:false,banner:{js:disposalPrelude},plugins:[{name:'compat',setup(b){b.onLoad({filter:/@remotion\/web-renderer\/dist\/esm\/index\.mjs$/},async({path:p})=>({contents:containTelemetryRejection(fs.readFileSync(p,'utf8')),loader:'js'}))}}]});
 const server=http.createServer((req,res)=>{const name=new URL(req.url,'http://localhost').pathname;if(name==='/brand-check291.html'){res.setHeader('Content-Type','text/html');return res.end('<script src="/brand-check291.js"></script>')}if(name==='/brand-check291.js'){res.setHeader('Content-Type','application/javascript');return res.end(built.outputFiles[0].contents)}fs.readFile(path.join(process.cwd(),name),(e,b)=>{res.writeHead(e?404:200,{'Content-Type':name.endsWith('.png')?'image/png':'application/octet-stream'});res.end(e?'Not found':b)})});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,headless:true,args:['--no-sandbox','--no-zygote','--single-process','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage();await page.route('https://www.remotion.pro/**',r=>r.abort());await page.goto('http://127.0.0.1:'+server.address().port+'/brand-check291.html');await page.waitForFunction(()=>window.exportBrand291);
  for(const scale of [.5,1])for(const [phase,frame]of [['intro',30],['outro',420]]){
   const target=path.join(output,phase+'-'+scale+'.mp4');fs.writeFileSync(target,Buffer.from(await page.evaluate(options=>window.exportBrand291(options),{scale,frame})));
   execFileSync('ffmpeg',['-v','error','-i',target,'-frames:v','1','-y',target+'.png']);
   const script=`from PIL import Image\nim=Image.open(${JSON.stringify(target+'.png')}).convert('RGB')\ns=${scale}\nx=540*s;y=(720 if ${JSON.stringify(phase)}=='intro' else 679)*s\nr=19*s\npixels=list(im.crop((int(x-r),int(y-r),int(x+r),int(y+r))).getdata())\ncream=sum(1 for r,g,b in pixels if r>180 and g>170 and b>130 and abs(r-g)<50)\nprint(cream)`;
   const cream=Number(execFileSync('python',['-c',script],{encoding:'utf8'}));assert.ok(cream>10*scale*scale,'Missing hand glyph: '+phase+' '+scale+' '+cream);console.log('Exported brand hand glyph passed:',phase,scale,cream);
  }
 }finally{await browser?.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
