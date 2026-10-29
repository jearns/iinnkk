const{chromium}=require('playwright'),fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const out='/tmp/video293';fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname;fs.readFile(path.join(process.cwd(),p),(e,b)=>{res.writeHead(e?404:200,{'Content-Type':p.endsWith('.js')||p.endsWith('.mjs')?'application/javascript':p.endsWith('.html')?'text/html':p.endsWith('.css')?'text/css':p.endsWith('.json')?'application/json':'application/octet-stream'});res.end(e?'Not found':b)})});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;const browser=await chromium.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox','--no-zygote','--single-process','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const page=await browser.newPage();page.on('pageerror',e=>console.error('PAGEERROR',e.message));await page.goto(base+'/writer.html?prepare158=1&videoReplay293=1');await page.waitForFunction(()=>window.AnnotationApp?.ready,{},{timeout:60000});
 const record=await page.evaluate(async()=>{
  const d=structuredClone(AnnotationApp.getState());d.values.ratio=String(16/9);d.values.paperExtent='fixed';d.values.inkMode='raw';d.values.sceneChoice='none';d.mountKey='bare';d.photos=[];d.referenceData111='';d.signatureStrokes=[];d.sheetBounds194={x:0,y:0,w:4,h:2.25};
  d.flow={strokes:Array.from({length:198},(_,i)=>{const cell=Math.floor(i/2),col=cell%11,row=Math.floor(cell/11)%9,x=.24+col*.32,y=.2+row*.21;return{id:'stress'+i,done:true,hasPressure:true,inkMode:'raw',settings:{...d.brush,size:14,color:'#111111',dry:.1},points:Array.from({length:42},(_,j)=>({x:x+(i%2?0:j*.005),y:y+(i%2?j*.0035:0),pressure:.4+.2*Math.sin(j/12),t:j*16}))}})};
  await DraftStore.saveWork({id:'stress293',title:'198笔横幅',draft:d,created:Date.now(),updated:Date.now()});
  const portrait=structuredClone(d);portrait.values.ratio=String(9/16);portrait.sheetBounds194={x:0,y:0,w:4,h:4/(9/16)};for(const st of portrait.flow.strokes)for(const p of st.points){p.y*=2.9;p.x*=.96;}
  await DraftStore.saveWork({id:'portrait293',title:'198笔竖幅',draft:portrait,created:Date.now(),updated:Date.now()});return d;
 });
 const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/video-studio.html');await page.getByRole('button',{name:'从我的作品选择',exact:true}).waitFor();
 const meta=JSON.parse(fs.readFileSync('video-assets293/build-manifest.json'));
 const exporter=Object.entries(meta.outputs).find(([p,v])=>v.entryPoint==='src/export-engine.mjs')[0].replace('../','');
 assert.equal(requests.some(u=>u.includes(exporter)),false);console.log('Fast entry does not load the export engine.');
 await page.goto(base+'/video-studio.html?work290=stress293&source290=local');await page.locator('.vsStatus').filter({hasText:'原始笔迹已就绪'}).waitFor({timeout:90000});
 const frame=page.frames().find(f=>f.url().includes('videoReplay293=1'));
 await page.getByLabel('影片时长').selectOption('30');await page.getByRole('button',{name:'Play video',exact:true}).click();await page.waitForFunction(()=>Number(document.querySelector('[data-frame290]')?.dataset.frame290)>=200);await page.getByRole('button',{name:'Pause video',exact:true}).click();
 assert.ok(await page.locator('[data-canvas293]').isVisible());
 for(const mode of ['shadow','push','pull','dolly','dissolve','fade','match','mixed']){await page.getByLabel('镜头转场').selectOption(mode);await page.waitForTimeout(70);const pixels=await page.locator('[data-canvas293]').evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;return d.some((v,i)=>i%4!==3&&v>30)});assert.ok(pixels,mode);await page.screenshot({fullPage:true,path:out+'/'+mode+'.png'});}
 console.log('All eight stable transition choices painted successfully.');
 const identity=await frame.evaluate(()=>AnnotationApp.getState().flow.strokes.length);
 for(const [quality,seconds,music]of [['compact',8,'none'],['full',30,'yangguan'],['full',120,'satie']]){
  await page.getByLabel('影片时长').selectOption(String(seconds));await page.getByLabel('导出画质').selectOption(quality);await page.getByLabel('背景音乐').selectOption(music);await page.getByLabel('镜头转场').selectOption('mixed');
  assert.equal(page.frames().find(f=>f.url().includes('videoReplay293=1')),frame);assert.equal(await frame.evaluate(()=>AnnotationApp.getState().flow.strokes.length),identity);
  const download=page.waitForEvent('download',{timeout:1200000});await page.getByRole('button',{name:'下载 MP4 视频',exact:true}).click();const target=out+'/'+quality+'-'+seconds+'-landscape.mp4';await(await download).saveAs(target);
  const{execFileSync}=require('node:child_process');const streams=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-of','json',target])).streams,v=streams.find(s=>s.codec_name==='h264');assert.deepEqual([v.width,v.height,v.nb_frames],[quality==='full'?1920:960,quality==='full'?1080:540,String(seconds*30)]);assert.ok(streams.some(s=>s.disposition?.attached_pic));if(music!=='none')assert.ok(streams.some(s=>s.codec_name==='aac'));
  execFileSync('ffmpeg',['-v','error','-i',target,'-map','0:v:0','-map','0:a?','-f','null','-']);console.log('Export and full decode passed:',quality,seconds,'landscape',fs.statSync(target).size);
 }
 await page.goto(base+'/video-studio.html?work290=portrait293&source290=local');await page.locator('.vsStatus').filter({hasText:'原始笔迹已就绪'}).waitFor({timeout:90000});await page.getByLabel('导出画质').selectOption('full');await page.getByLabel('影片时长').selectOption('15');await page.getByLabel('镜头转场').selectOption('push');
 const download=page.waitForEvent('download',{timeout:600000});await page.getByRole('button',{name:'下载 MP4 视频',exact:true}).click();const target=out+'/full-15-portrait.mp4';await(await download).saveAs(target);const{execFileSync}=require('node:child_process');const v=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-of','json',target])).streams.find(s=>s.codec_name==='h264');assert.deepEqual([v.width,v.height,v.nb_frames],[1080,1920,'450']);execFileSync('ffmpeg',['-v','error','-i',target,'-map','0:v:0','-f','null','-']);console.log('Portrait 9:16 HD export/decode passed.');
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/source-draft.json',JSON.stringify(record));

 }finally{await browser.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
