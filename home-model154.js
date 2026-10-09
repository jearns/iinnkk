/* Shared route and data rules; no editor, canvas, observers, or auth initialization. */
(function(root){
const routes=['mode','post','panel','feature','maintain','edit','work','manage','account','code'];
function handoff(href){const u=new URL(href);if(!routes.some(k=>u.searchParams.has(k))&&!/(?:access_token|refresh_token|error_description|type=signup)=/.test(u.hash))return '';const target=new URL('writer.html',u);target.search=u.search;target.hash=u.hash;return target.href}
function writer(params,href){const u=new URL('writer.html',href);for(const [key,value]of Object.entries(params))if(value!==undefined&&value!==null)u.searchParams.set(key,String(value));return u.href}
function chapters(base,manifest){const entries=manifest?.entries||{},map=new Map(base.map(c=>[c.id,{...c,...entries[c.id]}]));for(const [id,c]of Object.entries(entries))if(!map.has(id))map.set(id,{id,...c});return [...map.values()].filter(c=>!c.deleted).sort((a,b)=>(Number(b.year)||0)-(Number(a.year)||0)||a.id.localeCompare(b.id))}
function safeImage(path,href){try{const u=new URL(path,href);if(u.origin===new URL(href).origin&&/^timeline\/pages\//.test(String(path))&&!String(path).split('/').some(p=>p==='..'||p==='.')||u.protocol==='https:'&&/\.(?:supabase\.co|github\.io)$/.test(u.hostname))return u.href}catch{}return ''}
function navigationKey(requestURL,scope){const u=new URL(requestURL),base=new URL(scope);if(u.origin!==base.origin||!u.pathname.startsWith(base.pathname))return '';return u.pathname===base.pathname?new URL('index.html',base).href:u.origin+u.pathname}
root.HomeModel154={handoff,writer,chapters,safeImage,navigationKey};
})(typeof window==='undefined'?globalThis:window);
