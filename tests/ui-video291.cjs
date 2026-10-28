const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const output=process.env.VIDEO_TEST_OUTPUT||'/tmp/shoubi-video291';fs.mkdirSync(output,{recursive:true});
const mime={'.html':'text/html','.js':'application/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);fs.readFile(path.join(process.cwd(),name),(error,bytes)=>{res.writeHead(error?404:200,{'Content-Type':mime[path.extname(name)]||'application/octet-stream'});res.end(error?'Not found':bytes)});});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,headless:true,args:['--no-sandbox','--no-zygote','--single-process','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const context=await browser.newContext({acceptDownloads:true});
  await context.addInitScript(()=>{
   const NativeSymbol=Symbol;function LegacySymbol(value){return NativeSymbol(value)}
   for(const key of Reflect.ownKeys(NativeSymbol))if(!['name','length','prototype','dispose','asyncDispose'].includes(key))Object.defineProperty(LegacySymbol,key,Object.getOwnPropertyDescriptor(NativeSymbol,key));
   LegacySymbol.prototype=NativeSymbol.prototype;window.Symbol=LegacySymbol;
  });
  const page=await context.newPage(),errors=[],cloudRequests=[];page.setDefaultTimeout(30000);page.on('pageerror',e=>{errors.push(e.message);console.error('PAGEERROR',e.message)});
  await context.route('https://www.remotion.pro/**',r=>r.abort('internetdisconnected'));
  await context.route('**/*.supabase.co/**',r=>{cloudRequests.push(r.request().url());return r.abort()});
  let draft;
  if(!process.env.VIDEO_ONLY_CLOUD){
  await page.goto(base+'/writer.html?prepare158=1&videoReplay290=1');
  await page.waitForFunction(()=>window.AnnotationApp?.ready&&window.WriterEntry154?.ready,{},{timeout:30000});
  await page.evaluate(async()=>{await WriterEntry154.navigate('?mode=letter');await AnnotationApp.configure47({size:200,brushPatch:{color:'#111111',dry:0,taper:0}});AnnotationApp.enterWriting182();});
  await page.mouse.move(360,300);await page.mouse.down();for(let x=380;x<=680;x+=20)await page.mouse.move(x,300);await page.mouse.up();
  await page.mouse.move(520,180);await page.mouse.down();for(let y=200;y<=500;y+=20)await page.mouse.move(520,y);await page.mouse.up();
  draft=await page.evaluate(async()=>{
   AnnotationApp.finish();const d=structuredClone(AnnotationApp.getState());if(d.flow.strokes.length<2)throw Error('Test pointer strokes were not captured');
   const c=document.createElement('canvas');c.width=120;c.height=160;c.getContext('2d').fillRect(20,20,80,120);const blob=await new Promise(r=>c.toBlob(r));
   await DraftStore.saveWork({id:'video290-test',title:'轨迹测试',draft:d,blob,created:Date.now(),updated:Date.now()});
   await DraftStore.saveWork({id:'video290-image',title:'只有图片的旧作',blob,created:Date.now(),updated:Date.now()});return d;
  });
  fs.writeFileSync(path.join(output,'source-draft.json'),JSON.stringify(draft));
  await page.goto(base+'/video-studio.html');await page.getByRole('button',{name:'从我的作品选择',exact:true}).click();
  const picker=page.frameLocator('.vsPicker290 iframe');
  await picker.locator('article').filter({hasText:'只有图片的旧作'}).getByRole('button',{name:'使用这幅作品',exact:true}).click();
  await page.locator('.vsStatus').filter({hasText:'没有保存笔画轨迹'}).waitFor();assert.equal(await page.getByRole('button',{name:'下载 MP4 视频',exact:true}).isEnabled(),false);
  await picker.locator('article').filter({hasText:'轨迹测试'}).getByRole('button',{name:'使用这幅作品',exact:true}).click();
  await page.locator('.vsStatus').filter({hasText:'轨迹已就绪'}).waitFor({timeout:180000});
  console.log('Actual saved draft rendered by original writing engine; no image import.');
  await page.locator('[data-poster291]').waitFor();
  assert.ok(await page.locator('[data-poster291]').isVisible());
  await page.getByLabel('影片时长').selectOption('15');
  await page.getByRole('button',{name:'Play video',exact:true}).click();
  await page.waitForFunction(()=>Number(document.querySelector('[data-frame290]')?.dataset.frame290)>=15);
  await page.getByRole('button',{name:'Pause video',exact:true}).click();
  assert.equal(await page.locator('[data-phase291]').getAttribute('data-phase291'),'intro');
  const logo=await page.locator('[data-brand291]').boundingBox(),preview=await page.locator('.vsPreview').boundingBox();
  assert.ok(logo.width/preview.width<.1);assert.ok(Math.abs(logo.x+logo.width/2-preview.x-preview.width/2)<2);
  await page.screenshot({path:path.join(output,'intro.png')});
  await page.getByRole('button',{name:'Play video',exact:true}).click();
  await page.waitForFunction(()=>Number(document.querySelector('[data-frame290]')?.dataset.frame290)>=90);
  await page.getByRole('button',{name:'Pause video',exact:true}).click();
  const early=await page.locator('[data-artwork289] img').first().getAttribute('src');
  await page.screenshot({path:path.join(output,'full-view.png')});
  await page.getByRole('button',{name:'Play video',exact:true}).click();
  await page.waitForFunction(()=>Number(document.querySelector('[data-frame290]')?.dataset.frame290)>=170);
  await page.getByRole('button',{name:'Pause video',exact:true}).click();
  assert.ok(Number(await page.locator('[data-shot291]').last().evaluate(e=>getComputedStyle(e).scale))>1.5);
  await page.screenshot({path:path.join(output,'close-up.png')});
  await page.getByRole('button',{name:'Play video',exact:true}).click();
  await page.waitForFunction(()=>Number(document.querySelector('[data-replay290]')?.dataset.replay290)>=72);
  await page.getByRole('button',{name:'Pause video',exact:true}).click();
  const late=await page.locator('[data-artwork289] img').first().getAttribute('src');assert.notEqual(late,early);
  await page.screenshot({path:path.join(output,'complete-work.png')});
  await page.getByRole('button',{name:'Play video',exact:true}).click();
  await page.waitForFunction(()=>Number(document.querySelector('[data-frame290]')?.dataset.frame290)>=410);
  await page.getByRole('button',{name:'Pause video',exact:true}).click();
  assert.equal(await page.locator('[data-slogan291]').innerText(),'以手为笔，随手写字·iinnkk.me');
  await page.screenshot({path:path.join(output,'outro.png')});
  console.log('Poster, small centered logo, full view, ink close-up, complete work and branded outro passed.');
  const cases=process.env.VIDEO_SKIP_EXPORT?[]:[['compact',15],['compact',30],['compact',60],['compact',120],['full',15]].filter(([q,s])=>!process.env.VIDEO_SKIP_FIRST_EXPORT||q!=='compact'||s!==15);
  for(const [quality,seconds] of cases){
   await page.getByLabel('影片时长').selectOption(String(seconds));
   const qualityChanged=await page.getByLabel('导出画质').inputValue()!==quality;
   await page.getByLabel('导出画质').selectOption(quality);if(qualityChanged)await page.locator('.vsStatus').filter({hasText:'轨迹已就绪'}).waitFor({timeout:180000});
   const downloaded=page.waitForEvent('download',{timeout:1200000});await page.getByRole('button',{name:'下载 MP4 视频',exact:true}).click();
   const target=path.join(output,quality+'-'+seconds+'.mp4');await(await downloaded).saveAs(target);
   const info=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-of','json',target])).streams[0];
   assert.deepEqual([info.codec_name,info.width,info.height,info.nb_frames,info.duration],['h264',quality==='compact'?540:1080,quality==='compact'?720:1440,String(seconds*30),seconds+'.000000']);execFileSync('ffmpeg',['-v','error','-i',target,'-f','null','-']);console.log('Legacy-symbol MP4 passed:',quality,seconds,fs.statSync(target).size);
  }
  const libraryFrame=page.frames().find(f=>f.url().includes('selectVideo290=1'));
  assert.deepEqual(await libraryFrame.evaluate(async()=>{const record=await DraftStore.get('video290-test');return record.draft;}),draft);
  assert.deepEqual(cloudRequests,[]);assert.deepEqual(errors.filter(e=>!e.includes('Failed to fetch')),[]);assert.equal(errors.some(e=>e.includes('disposable')),false);
  }else draft=JSON.parse(fs.readFileSync(path.join(output,'source-draft.json')));
  // Exercise the cloud ownership/download path through the real selection page,
  // with a bounded fake account; no private production data or quota is used.
  const mockSDK=`window.IInkSupabaseSDK = {createClient() {
    return {
      auth: {
        async getSession() {return {data: {session: {user: {id: 'owner290'}}}}},
        onAuthStateChange(callback) {window.testAuth290 = callback; return {data: {subscription: {unsubscribe() {}}}}}
      },
      from() {
        const query = {};
        for (const key of ['select', 'eq', 'is']) query[key] = (...args) => {(window.query290 ||= []).push([key, ...args]); return query};
        query.maybeSingle = async () => ({data: {id: 'cloud290', title: '云端轨迹', owner: 'owner290', draft_path: 'owner290/cloud290.json'}});
        return query;
      },
      storage: {from(bucket) {return {async download(file) {
        window.download290 = {bucket, file};
        return {data: new Blob([JSON.stringify({version: 141, id: 'cloud290', draft: ${JSON.stringify(draft)}})], {type: 'application/json'})};
      }}}}
    };
  }};`;
  await context.route('**/supabase51.js*', route => route.fulfill({contentType: 'application/javascript', body: mockSDK}));
  await page.goto(base+'/video-studio.html?work290=cloud290&source290=cloud');
  try{await page.locator('.vsSelected').filter({hasText:'云端轨迹'}).waitFor();}catch(error){for(const frame of page.frames())console.log('FRAME',frame.url(),await frame.locator('body').innerText().catch(()=>''));throw error;}
  const cloudFrame=page.frames().find(f=>f.url().includes('selectVideo290=1'));
  const cloudState=await cloudFrame.evaluate(()=>({query:window.query290,download:window.download290}));
  assert.ok(cloudState.query.some(x=>x[0]==='eq'&&x[1]==='owner'&&x[2]==='owner290'));assert.ok(cloudState.query.some(x=>x[0]==='eq'&&x[1]==='id'&&x[2]==='cloud290'));assert.equal(cloudState.download.file,'owner290/cloud290.json');
  await cloudFrame.evaluate(()=>window.testAuth290('SIGNED_OUT',null));
  await page.locator('.vsStatus').filter({hasText:'账号已切换'}).waitFor();assert.equal(await page.getByRole('button',{name:'下载 MP4 视频',exact:true}).isEnabled(),false);
  assert.equal(await page.getByRole('button',{name:'从我的作品选择',exact:true}).isEnabled(),true);
  console.log('Cloud single-work read, owner filters, no upload, account-switch invalidation passed.');
  await page.goto(base+'/video-studio.html');await page.setViewportSize({width:390,height:844});
  for(const lang of ['en','fr','ru','ar','es']){
   await page.evaluate(lang=>localStorage.setItem('ink.language218',lang),lang);await page.reload();
   const dictionary=JSON.parse(fs.readFileSync('locales218/'+lang+'.json'));
   await page.getByRole('button',{name:dictionary['从我的作品选择'],exact:true}).waitFor();
   assert.equal(await page.locator('.vsLayout').getAttribute('dir'),lang==='ar'?'rtl':'ltr');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  }
  console.log('Five languages and Arabic direction passed at phone width.');
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1});
