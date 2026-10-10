const CACHE='annotation-core175',ASSETS='annotation-assets',CORE=["index.html","apple-touch-icon.png","banners146/hello-world.svg","brand148.svg","favicon151.svg","home-data154.json","home-runtime.15b75228bd3f8fae.css","home-runtime.a8c61977373a6d4b.js"];
const publicReference133=u=>['https:','http:'].includes(u.protocol)&&(/\.(?:png|jpe?g|webp|gif|avif|svg)$/i.test(u.pathname))&&(/^(?:raw\.githubusercontent\.com|jearns\.github\.io)$/.test(u.hostname)||/\.supabase\.co$/.test(u.hostname)&&u.pathname.includes('/storage/v1/object/public/'));
const codeURL=u=>/\.(js|css|html|json)$/.test(u.pathname);
async function fetchFresh(path){const response=await fetch(path,{cache:'reload'});if(!response.ok)throw Error('Offline resource unavailable');return response}
self.addEventListener('install',e=>e.waitUntil((async()=>{const cache=await caches.open(CACHE);let index=0;async function run(){while(index<CORE.length){const path=CORE[index++],response=await fetchFresh(path);await cache.put(path,response)}}await Promise.all([run(),run(),run()]);await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('annotation-core')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('message',e=>{if(e.data?.type==='CACHE_NAMES101')e.ports[0]?.postMessage({core:CACHE,assets:ASSETS})});
async function freshOrCached154(load,hit,event){if(!hit)return await load();let timer;const flight=load().catch(()=>hit);event.waitUntil(flight.finally(()=>clearTimeout(timer)));return await Promise.race([flight,new Promise(resolve=>{timer=setTimeout(()=>resolve(hit),1200)})])}
// Cache navigation without fetching its dependencies a second time. The document owns loading.
async function prepareNavigation(response,cache,key){if(!response.ok)throw Error('Page unavailable');const html=await response.clone().text();if(!/(?:app|home)-runtime\.[a-f0-9]+\.(?:js|css)/.test(html))throw Error('Incomplete release');await cache.put(key,response.clone());return response}
const resourceFlights165=new Map();
function immutableRuntime165(u){return /\/(?:app|home)-runtime\.[a-f0-9]+\.(?:js|css)$/.test(u.pathname)}
function resource165(request,cache,key,event){
 const identity=request.url+'|'+(request.headers.get('range')||'');let flight=resourceFlights165.get(identity);
 if(!flight){const response=fetch(request),done=response.then(r=>{if(r.ok&&!request.headers.has('range')&&request.headers.get('X-Ink-Prepare156')!=='1')return cache.put(key,r.clone())}).catch(()=>{}).finally(()=>{if(resourceFlights165.get(identity)===flight)resourceFlights165.delete(identity)});flight={response,done};resourceFlights165.set(identity,flight)}
 event.waitUntil(flight.done);return flight.response.then(r=>r.clone());
}
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin&&!publicReference133(u)||u.pathname.startsWith('/api/')||u.pathname.startsWith('/signin-')||u.pathname.startsWith('/signout-')||u.pathname.includes('/downloads/')||u.pathname.endsWith('/download.html'))return;
 let complete;const background=new Promise(resolve=>complete=resolve);e.waitUntil(background);
 e.respondWith((async()=>{try{
 const core=await caches.open(CACHE),assets=await caches.open(ASSETS),nav=e.request.mode==='navigate',key=nav?(u.pathname===new URL(self.registration.scope).pathname?new URL('index.html',self.registration.scope).href:u.origin+u.pathname):e.request;
 let hit=await core.match(key,{ignoreSearch:true})||await assets.match(key,{ignoreSearch:true});
 if(!hit&&!codeURL(u)){for(const name of await caches.keys())if(name.startsWith('annotation-assets')){hit=await(await caches.open(name)).match(key,{ignoreSearch:true});if(hit)break}}
 const load=async()=>{if(!nav)return resource165(e.request,immutableRuntime165(u)||!codeURL(u)?assets:core,key,e);const response=await fetch(e.request,{cache:'no-store'});e.waitUntil(prepareNavigation(response.clone(),core,key).catch(()=>{}));return response};
 if(nav&&u.pathname.endsWith('/writer.html')&&hit){e.waitUntil(load().catch(()=>{}));complete();return hit}if(nav||u.pathname.endsWith('/timeline/manifest.json')){try{return await freshOrCached154(load,hit,e)}catch{return hit||Response.error()}finally{complete()}}if(hit&&e.request.cache!=='reload'){complete();if(e.request.headers.has('range')){const data=await hit.arrayBuffer(),match=/bytes=(\d+)-(\d*)/.exec(e.request.headers.get('range')||'');if(match){const start=+match[1],end=Math.min(data.byteLength-1,match[2]?+match[2]:data.byteLength-1);if(start>end)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+data.byteLength}});return new Response(data.slice(start,end+1),{status:206,headers:{'Content-Type':hit.headers.get('Content-Type')||'application/octet-stream','Content-Range':`bytes ${start}-${end}/${data.byteLength}`,'Content-Length':String(end-start+1),'Accept-Ranges':'bytes'}})}}return hit}
 try{return await load()}catch{return Response.error()}finally{complete()}
 }catch{complete();return Response.error()}})());
});

