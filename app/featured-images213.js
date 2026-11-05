/* Stable work versions, one download per cache miss; signed URLs are never cache keys. */
(function(root){
 const key='home-featured158';
 function version(w){return JSON.stringify([w.id,w.image_path,w.updated_at])}
 async function load(works,{read,write,sign,fetch:download,thumbnail}){
  let cached;try{cached=await read(key)}catch{}
  const previous=new Map((cached?.rows||[]).map(w=>[version(w),w])),rows=[];
  for(const work of works.slice(0,5)){
   const hit=previous.get(version(work));
   if(hit?.thumb instanceof Blob){rows.push({...work,src:undefined,thumb:hit.thumb});continue}
   try{
    const url=await sign(work),response=await download(url);
    if(!response.ok)continue;
    const thumb=await thumbnail(await response.blob());
    if(thumb instanceof Blob)rows.push({...work,src:undefined,thumb});
   }catch{}
  }
  try{await write(key,{rows,time:Date.now()})}catch{}
  return rows;
 }
 root.FeaturedImages213={load,version};
})(window);
