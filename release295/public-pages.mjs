// Called only from an explicit recommendation. Sequential uploads bound memory/network use.
export async function publishPages295(db,store,record,owner,workId){
 if(!record?.copyBook158?.pages?.length&&!record?.collection295)return null;
 const {pageSources295}=await import('./collection.mjs'),pages=await pageSources295(store,record.id),paths=[];
 if(pages.length<2)return null;if(pages.length>200)throw Error('公开组图最多200页，请分组选集');
 const prior=await db.from('ink_works').select('pages295').eq('id',workId).eq('owner',owner).maybeSingle();if(prior.error)throw prior.error;const old=prior.data?.pages295||[];const folder=owner+'/pages295_'+crypto.randomUUID();let committed=false;
 try{for(let i=0;i<pages.length;i++){
  const source=await pages[i].load();if(!source)throw Error('本页预览暂未保存，请进入书写保存该页');
  const blob=source instanceof Blob?source:await fetch(source).then(r=>{if(!r.ok)throw Error('作品图片尚未读取');return r.blob()});const im=await createImageBitmap(blob),canvas=document.createElement('canvas'),k=Math.min(1,1920/Math.max(im.width,im.height));canvas.width=Math.max(1,Math.round(im.width*k));canvas.height=Math.max(1,Math.round(im.height*k));const t=canvas.getContext('2d');t.fillStyle='#fff';t.fillRect(0,0,canvas.width,canvas.height);t.drawImage(im,0,0,canvas.width,canvas.height);im.close();const jpeg=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('作品图片未能生成')),'image/jpeg',.88));canvas.width=canvas.height=1;
  const path=folder+'/'+i+'.jpg',r=await db.storage.from('ink-works').upload(path,jpeg,{upsert:false,contentType:'image/jpeg'});if(r.error)throw r.error;paths.push(path);
 }
 const result=await db.from('ink_works').update({pages295:paths}).eq('id',workId).eq('owner',owner).is('deleted_at144',null).select('id');if(result.error||!result.data?.length)throw Error(result.error?.message||'组图发布未完成');committed=true;const retired=old.filter(p=>p.startsWith(owner+'/pages295_')&&!paths.includes(p));if(retired.length)await db.storage.from('ink-works').remove(retired).catch(()=>{});return paths;
 }finally{if(!committed&&paths.length)await db.storage.from('ink-works').remove(paths).catch(()=>{})}
}
export function cloudPages295(row,db,gallery){const paths=row.pages295?.length?row.pages295:[row.image_path];return paths.map(path=>({load:()=>gallery.image(db,{...row,image_path:path})}));}
