const CACHE='annotation-core141',ASSETS='annotation-assets',CORE=["dragon-paper.png","fonts/YiShanBeiZhuanTi.woff2","fonts/shuowen-core45.woff","index.html","favicon90.png","apple-touch-icon.png","hero-wide94.webp","hero-mobile94.webp","app-runtime.8ca060e5000a3340.js","app-runtime.8fc10a834583245f.js","app-runtime.9b90063fcfe9cf7b.js","app-runtime.f198f0ce8d28d402.css","app-runtime.f2e3280fb9213bb5.js","app-runtime.f9a6e6a628435baa.js"];
const publicReference133=u=>['https:','http:'].includes(u.protocol)&&(/\.(?:png|jpe?g|webp|gif|avif|svg)$/i.test(u.pathname))&&(/^(?:raw\.githubusercontent\.com|jearns\.github\.io)$/.test(u.hostname)||/\.supabase\.co$/.test(u.hostname)&&u.pathname.includes('/storage/v1/object/public/'));
const codeURL=u=>/\.(js|css|html|json)$/.test(u.pathname);
async function fetchFresh(path){const response=await fetch(path,{cache:'reload'});if(!response.ok)throw Error('Offline resource unavailable');return response}
self.addEventListener('install',e=>e.waitUntil((async()=>{const cache=await caches.open(CACHE);let index=0;async function run(){while(index<CORE.length){const path=CORE[index++],response=await fetchFresh(path);await cache.put(path,response)}}await Promise.all([run(),run(),run()]);await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('annotation-core')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('message',e=>{if(e.data?.type==='CACHE_NAMES101')e.ports[0]?.postMessage({core:CACHE,assets:ASSETS})});
async function prepareNavigation(response,cache){if(!response.ok)throw Error('Page unavailable');const html=await response.clone().text(),files=[...html.matchAll(/(?:src|href)="(app-runtime\.[a-f0-9]+\.(?:js|css))"/g)].map(m=>m[1]);if(files.length<2)throw Error('Incomplete release');for(const path of files){if(!await cache.match(path)){const r=await fetchFresh(path);await cache.put(path,r)}}await cache.put(new URL('index.html',self.registration.scope).href,response.clone());return response}
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin&&!publicReference133(u)||u.pathname.startsWith('/api/')||u.pathname.startsWith('/signin-')||u.pathname.startsWith('/signout-')||u.pathname.includes('/downloads/')||u.pathname.endsWith('/download.html'))return;
 let complete;const background=new Promise(resolve=>complete=resolve);e.waitUntil(background);
 e.respondWith((async()=>{try{
 const core=await caches.open(CACHE),assets=await caches.open(ASSETS),nav=e.request.mode==='navigate',key=nav?new URL('index.html',self.registration.scope).href:e.request;
 let hit=await core.match(key,{ignoreSearch:true})||await assets.match(key,{ignoreSearch:true});
 if(!hit&&!codeURL(u)){for(const name of await caches.keys())if(name.startsWith('annotation-assets')){hit=await(await caches.open(name)).match(key,{ignoreSearch:true});if(hit)break}}
 const load=async()=>{const response=await fetch(e.request,{cache:nav?'no-store':'default'});if(nav)return prepareNavigation(response,core);if(response.ok&&!e.request.headers.has('range'))await(codeURL(u)?core:assets).put(key,response.clone());return response};
 if(hit){if(nav)load().catch(()=>{}).finally(complete);else complete();if(e.request.headers.has('range')){const data=await hit.arrayBuffer(),match=/bytes=(\d+)-(\d*)/.exec(e.request.headers.get('range')||'');if(match){const start=+match[1],end=Math.min(data.byteLength-1,match[2]?+match[2]:data.byteLength-1);if(start>end)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+data.byteLength}});return new Response(data.slice(start,end+1),{status:206,headers:{'Content-Type':hit.headers.get('Content-Type')||'application/octet-stream','Content-Range':`bytes ${start}-${end}/${data.byteLength}`,'Content-Length':String(end-start+1),'Accept-Ranges':'bytes'}})}}return hit}
 try{return await load()}catch{return Response.error()}finally{complete()}
 }catch{complete();return Response.error()}})());
});

