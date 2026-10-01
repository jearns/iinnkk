const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{const file=path.join(root,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);try{res.setHeader('Content-Type',({js:'application/javascript',css:'text/css',html:'text/html',png:'image/png',svg:'image/svg+xml'})[path.extname(file).slice(1)]||'application/octet-stream');res.end(fs.readFileSync(file))}catch{res.statusCode=404;res.end()}});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
  for(const width of [320,390,768,1280]){
   const page=await browser.newPage({viewport:{width,height:900},serviceWorkers:'block'}),errors=[];
   page.on('pageerror',e=>{errors.push(e.message);console.error(e.stack)});
   await page.route(/https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
   await page.goto(`http://127.0.0.1:${server.address().port}`);
   await page.waitForFunction(()=>window.Revision94?.ready);
   for(const theme of ['stars','river']){
    await page.evaluate(theme=>{document.body.dataset.homeTheme=theme},theme);
    const colours=await page.locator('.annotationIntro strong,.annotationIntro small').evaluateAll(nodes=>nodes.map(node=>({colour:getComputedStyle(node).color,fill:getComputedStyle(node).webkitTextFillColor})));
    assert(colours.every(c=>c.colour===(width<=600?'rgb(255, 247, 233)':'rgb(25, 58, 66)')&&c.fill===c.colour),`${width}: readable headline in ${theme}`);
   }
   await page.locator('#homeQuick47 button').filter({hasText:/^大字$/}).click();
   await page.waitForFunction(()=>!document.body.classList.contains('home-open'));
   const sizes=await page.evaluate(()=>({logo:document.querySelector('#annotationHomeButton img').getBoundingClientRect().width,icon:document.querySelector('#myWorks svg').getBoundingClientRect().width,overflow:document.documentElement.scrollWidth>innerWidth}));
   assert.equal(sizes.logo,28);assert(sizes.logo>sizes.icon);assert(!sizes.overflow,`${width}: no horizontal overflow`);
   await page.locator('#menuToggle').click();
   assert(await page.locator('#brushDialog').isVisible(),`${width}: menu opens visible settings`);
   assert.equal(await page.locator('#brushDialog .dialogHead h2').textContent(),'本站全局设置');
   await page.locator('#brushDialog [data-open="paperDialog"]').click();
   assert(await page.locator('#paperDialog').isVisible(),`${width}: paper settings work`);
   await page.locator('#paperDialog [data-close]').click();
   await page.locator('#menuToggle').click();
   assert(await page.locator('#brushDialog').isVisible(),`${width}: settings reopen`);
   assert.deepEqual(errors,[],`${width}: no runtime errors`);
   await page.close();console.log(`PASS ${width}: themes, larger logo, menu and settings navigation`);
  }
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1});
