from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
assets=[p.relative_to(root).as_posix() for p in (p for name in json.loads((root/'site-assets.json').read_text()) for p in ((root/name).rglob('*') if (root/name).is_dir() else [root/name])) if p.is_file() and p.suffix in ['.js','.html','.css','.woff','.woff2','.png','.webp','.jpg','.mp3','.json'] and 'downloads' not in p.parts and p.name not in ['sw.js','offline-assets.json']]
core=[x for x in assets if '/' not in x or x=='fonts/shuowen-core45.woff']
(root/'offline-assets.json').write_text(json.dumps(assets))
(root/'sw.js').write_text('''const CACHE='annotation-core58-merge',ASSETS='annotation-assets58-merge',CORE='''+json.dumps(core)+''';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const key of await caches.keys())if((key.startsWith('annotation-core')&&key!==CACHE)||(key.startsWith('annotation-assets')&&key!==ASSETS))await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/')||u.pathname.startsWith('/signin-')||u.pathname.startsWith('/signout-')||u.pathname.includes('/downloads/')||u.pathname.endsWith('/download.html'))return;e.respondWith((async()=>{const code=e.request.mode==='navigate'||/\\.(js|css|html|json)$/.test(u.pathname);if(code){const c=await caches.open(CACHE);try{const r=await fetch(e.request,{cache:'no-cache'});if(r.ok)await c.put(e.request.mode==='navigate'?'index.html':e.request,r.clone());return r}catch{const hit=await c.match(e.request.mode==='navigate'?'index.html':e.request,{ignoreSearch:e.request.mode==='navigate'});return hit||Response.error()}}const c=await caches.open(ASSETS),hit=await c.match(e.request,{ignoreSearch:true});if(hit)return hit;const r=await fetch(e.request);if(r.ok)await c.put(e.request,r.clone());return r})())});
''')
