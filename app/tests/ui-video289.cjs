const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=process.cwd(),output=process.env.VIDEO_TEST_OUTPUT||'/tmp/shoubi-video289';
fs.mkdirSync(output,{recursive:true});
const mime={'.js':'application/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 fs.readFile(path.join(root,name),(error,bytes)=>{res.writeHead(error?404:200,{'Content-Type':mime[path.extname(name)]||'text/html'});res.end(error?'Not found':bytes);});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try {
  const page=await browser.newPage({acceptDownloads:true}),errors=[],usage=[],cloud=[];
  page.setDefaultTimeout(15000);
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://www.remotion.pro/**',r=>{usage.push(JSON.parse(r.request().postData()));return r.abort('internetdisconnected');});
  await page.route('**/*.supabase.co/**',r=>{cloud.push(r.request().url());return r.abort();});
  await page.goto(base+'/video-studio.html');
  await page.getByRole('heading',{name:'让作品，慢慢入镜。'}).waitFor();
  const picker=page.locator('input[type=file]'),downloadButton=()=>page.getByRole('button',{name:'下载 MP4 视频',exact:true});
  await picker.setInputFiles({name:'broken.png',mimeType:'image/png',buffer:Buffer.from('not a png')});
  await page.getByRole('status').filter({hasText:'图片已损坏'}).waitFor();
  assert.equal(await downloadButton().isDisabled(),true);
  const png=await page.evaluate(async()=>{
   const image=new Image();image.src='remotion-studio/public/sample-paper.svg';await image.decode();
   const c=document.createElement('canvas');c.width=852;c.height=970;c.getContext('2d').drawImage(image,0,0);
   return c.toDataURL('image/png').split(',')[1];
  });
  const fixture={name:'sample.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')};
  await picker.setInputFiles(fixture);await page.getByRole('status').filter({hasText:'作品已装载'}).waitFor();
  const original=await page.locator('.vsPreview img').getAttribute('src');
  await picker.setInputFiles({name:'broken.png',mimeType:'image/png',buffer:Buffer.from('not a png')});
  await page.getByRole('status').filter({hasText:'图片已损坏'}).waitFor();
  assert.equal(await page.locator('.vsPreview img').getAttribute('src'),original);
  assert.equal(await downloadButton().isEnabled(),true);
  for(const type of ['jpeg','webp']){
   const bytes=await page.evaluate(async type=>{const image=document.querySelector('.vsPreview img'),c=document.createElement('canvas');await image.decode();c.width=image.naturalWidth;c.height=image.naturalHeight;c.getContext('2d').drawImage(image,0,0);return c.toDataURL('image/'+type).split(',')[1];},type);
   await picker.setInputFiles({name:'sample.'+type,mimeType:'image/'+type,buffer:Buffer.from(bytes,'base64')});
   await page.getByRole('status').filter({hasText:'作品已装载'}).waitFor();
   assert.deepEqual(await page.locator('.vsPreview img').evaluate(e=>[e.naturalWidth,e.naturalHeight]),[852,970]);
  }
  await page.getByLabel('作品标题').fill('一二三四五六七八九十一二三四五六七八');
  await page.getByLabel('落款',{exact:true}).fill('一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五');
  await page.getByRole('button',{name:'Play video',exact:true}).click();
  await page.waitForFunction(()=>Number(document.querySelector('[data-caption289]').style.opacity)>0.99);
  const layout=await page.evaluate(()=>{
   const box=s=>document.querySelector(s).getBoundingClientRect().toJSON();
   return {image:box('[data-artwork289]'),caption:box('[data-caption289]'),lines:['[data-title289]','[data-signature289]'].map(s=>{const e=document.querySelector(s);return {width:e.clientWidth,scroll:e.scrollWidth};})};
  });
  assert.ok(layout.image.bottom<layout.caption.top,JSON.stringify(layout));
  for(const line of layout.lines)assert.ok(line.scroll<=line.width+1,JSON.stringify(layout));
  await page.screenshot({path:path.join(output,'long-title.png')});
  for(const viewport of [{width:390,height:844},{width:820,height:1180},{width:768,height:1024}]){
   await page.setViewportSize(viewport);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  }
  await page.getByLabel('作品标题').fill('作品成影验证');await page.getByLabel('落款',{exact:true}).fill('手筆 · 本机合成验证');
  for(const quality of ['compact','full']){
   await page.getByLabel('导出画质').selectOption(quality);
   const downloaded=page.waitForEvent('download',{timeout:240000});await downloadButton().click();
   const target=path.join(output,quality+'.mp4');await(await downloaded).saveAs(target);
   const info=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-of','json',target]).toString()).streams[0];
   assert.deepEqual([info.codec_name,info.width,info.height,info.nb_frames,info.r_frame_rate,info.duration],['h264',quality==='compact'?540:1080,quality==='compact'?720:1440,'240','30/1','8.000000']);
   execFileSync('ffmpeg',['-v','error','-i',target,'-f','null','-']);
   console.log('MP4 passed',quality,fs.statSync(target).size);
  }
  await downloadButton().click();await page.getByRole('button',{name:'取消合成',exact:true}).click();
  await page.getByRole('status').filter({hasText:'已取消合成'}).waitFor();assert.equal(await downloadButton().isEnabled(),true);
  // SDK retries are unchanged. Let their rejected telemetry promises settle.
  await page.waitForTimeout(16000);
  assert.ok(usage.length>0);for(const event of usage)assert.equal('artwork' in event,false);
  assert.deepEqual(errors,[]);assert.deepEqual(cloud,[]);
  for(const lang of ['en','fr','ru','ar','es']){
   await page.evaluate(lang=>localStorage.setItem('ink.language218',lang),lang);await page.reload();
   const dict=JSON.parse(fs.readFileSync('locales218/'+lang+'.json'));
   await page.getByRole('heading',{name:dict['让作品，慢慢入镜。'],exact:true}).waitFor();
   assert.equal(await page.locator('.vsLayout').getAttribute('dir'),lang==='ar'?'rtl':'ltr');
   assert.equal(await page.getByRole('button',{name:dict['下载 MP4 视频'],exact:true}).count(),1);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  }
  console.log('Image decode, previous-artwork recovery, PNG/JPEG/WebP, long captions, mobile widths, cancellation, failed telemetry, five locales and Arabic direction passed.');
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
