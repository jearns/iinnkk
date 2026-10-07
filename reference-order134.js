/* Shared catalogue page order. A fresh remote ordering supersedes its old local base. */
(function(root){
 const records=new Map(),key=id=>'reference-order134:'+id,same=(a,b)=>a.length===b.length&&a.every((p,i)=>p===b[i]);
 function read(id){if(records.has(id))return records.get(id);let r=null;try{r=JSON.parse(root.localStorage?.getItem(key(id))||'null')}catch{}if(!Array.isArray(r?.base)||!Array.isArray(r?.order))r=null;records.set(id,r);return r}
 function resolve(id,pages){const r=read(id);if(!r)return pages.slice();if(!same(r.base,pages)){records.delete(id);try{root.localStorage?.removeItem(key(id))}catch{}return pages.slice()}return r.order.slice()}
 function remember(id,base,order){if(base.length!==order.length||new Set(order).size!==order.length||order.some(p=>!base.includes(p)))throw Error('组图顺序与原帖不一致');const r={base:base.slice(),order:order.slice()};records.set(id,r);try{root.localStorage?.setItem(key(id),JSON.stringify(r))}catch{}root.document?.dispatchEvent(new CustomEvent('reference-order134',{detail:{id}}));return order.slice()}
 function mergePages(previous,pages){return pages.map(page=>{const old=previous.find(p=>p.image===page.image);return old?{...old,...page,id128:old.id128,workIds:old.workIds||[],analysis129:old.analysis129}:page})}
 root.ReferenceOrder134={resolve,remember,mergePages};
})(typeof window==='undefined'?globalThis:window);
