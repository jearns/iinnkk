/* Owner-scoped editable cloud works. Immutable uploads + conditional row updates prevent stale-device overwrite. */
(function(root){
 function service({cloud,store,codec,app,online=()=>navigator.onLine,uuid=()=>crypto.randomUUID(),notify=()=>{},confirm=message=>typeof root.confirm==='function'&&root.confirm(message)}){
  const db=cloud.client,versions=new Map(),owner=()=>cloud.user?.id;
  const check=r=>{if(r.error)throw Error(r.error.message||String(r.error));return r.data};
  const key=(uid,id)=>'cloud-delete141:'+uid+':'+id;
  const validPath=(path,uid)=>typeof path==='string'&&path.split('/')[0]===uid&&!path.split('/').some(p=>p==='..');
  function requireOwner(uid){if(!uid||owner()!==uid)throw Error('账号已切换，操作已暂停；本机笔迹保留')}
  async function cleanup(bucket,path,uid){if(!validPath(path,uid))return;try{const field=bucket==='ink-drafts'?'draft_path':'image_path',linked=check(await db.from('ink_works').select('id').eq('owner',uid).eq(field,path).limit(1).maybeSingle());requireOwner(uid);if(linked)return;const result=await db.storage.from(bucket).remove([path]);if(result.error)console.warn('旧版本文件待清理',result.error.message)}catch(e){console.warn('文件清理已暂停，未删除共享文件',e.message)}}
  async function findLocal(id,uid=owner()){
   if(!uid)return null;const local=await store.get(id),meta=local?.cloud141;requireOwner(uid);
   if(meta&&meta.owner!==uid)throw Error('此本机作品属于另一账号，请切回原账号');
   let query=db.from('ink_works').select('id,title,owner,local_id,image_path,draft_path,published,updated_at').eq('owner',uid);
   if(meta?.id)query=query.eq('id',meta.id);else query=query.eq('local_id',cloud.cloudLocalId(id));
   let row=check(await query.maybeSingle());requireOwner(uid);
   if(!row&&!meta&&cloud.cloudLocalId(id)!==String(id))row=check(await db.from('ink_works').select('*').eq('owner',uid).eq('local_id',String(id)).maybeSingle());
   if(!row&&!meta&&/^[a-zA-Z0-9:-]+$/.test(String(id)))row=check(await db.from('ink_works').select('*').eq('owner',uid).like('local_id','%|'+id).order('updated_at',{ascending:false}).limit(1).maybeSingle());
   requireOwner(uid);return row;
  }
  async function deleted(record,uid){return !!await store.get(key(uid,record.id))}
  async function upload(record,row){
   const uid=owner();requireOwner(uid);if(record.cloud141?.owner&&record.cloud141.owner!==uid)throw Error('此作品原笔迹属于另一账号');
   if(await deleted(record,uid))return{deleted:true};
   const localId=record.cloud141?.localId||row.local_id;
   const old=check(await db.from('ink_works').select('id,owner,image_path,draft_path,published,updated_at').eq('owner',uid).eq('local_id',localId).maybeSingle());requireOwner(uid);
   if(!old&&record.cloud141?.id)throw Error('此作品云端版本已被删除；本机笔迹保留，请另存为新作品');
   const base=record.cloud141?.updatedAt;
   if(old?.draft_path&&old.updated_at!==base&&old.updated_at!==versions.get(uid+'|'+localId))throw Error('云端已有较新原笔迹，请先打开云端版本；本机修改未删除');
   const token=uuid(),folder=uid+'/'+encodeURIComponent(record.id)+'/'+token,imagePath=folder+'.jpg';
   const copy=record.copySource141||null,payload={version:141,id:record.id,title:record.title,created:record.created,date:record.date,quoteAuthor:record.quoteAuthor,quoteTitle:record.quoteTitle,copySource141:copy,draft:record.draft};
   const packed=record.draft?await codec.pack(payload):null;requireOwner(uid);const draftPath=packed?folder+'.'+packed.extension:null;
   const uploaded=[];let committed=false;
   try{
    check(await db.storage.from('ink-works').upload(imagePath,row.image,{upsert:false,contentType:'image/jpeg'}));uploaded.push(['ink-works',imagePath]);requireOwner(uid);
    if(packed){check(await db.storage.from('ink-drafts').upload(draftPath,packed.blob,{upsert:false,contentType:packed.blob.type}));uploaded.push(['ink-drafts',draftPath]);requireOwner(uid)}
    if(await deleted(record,uid))return{deleted:true};
    const values={owner:uid,local_id:localId,title:row.title,image_path:imagePath,updated_at:new Date(Math.max(Date.now(),Date.parse(old?.updated_at||'1970-01-01')+1)).toISOString(),published:row.published??old?.published??false};
    if(draftPath)values.draft_path=draftPath;
    let query;if(old){query=db.from('ink_works').update(values).eq('owner',uid).eq('id',old.id).eq('updated_at',old.updated_at)}else query=db.from('ink_works').insert(values);
    const saved=check(await query.select('id,owner,local_id,updated_at').maybeSingle());if(!saved)throw Error('另一设备刚更新了本作品，请先读取云端版本；本机笔迹保留');committed=true;requireOwner(uid);
    const meta={owner:uid,id:saved.id,localId:saved.local_id,updatedAt:saved.updated_at,draftBytes:packed?.bytes||0};versions.set(uid+'|'+localId,saved.updated_at);
    record.cloud141=meta;const latest=await store.get(record.id);if(latest){latest.cloud141=meta;if(latest.draft?.editingWork110)latest.draft.editingWork110.cloud141=meta;await store.set(record.id,latest)}
    for(const [bucket,path]of [['ink-works',old?.image_path],['ink-drafts',old?.draft_path]])if(path&&path!==imagePath&&path!==draftPath)await cleanup(bucket,path,uid);
    notify();return meta;
   }finally{if(!committed)for(const [bucket,path]of uploaded)await db.storage.from(bucket).remove([path]).catch(()=>{})}
  }
  async function load(row){
   const uid=owner();requireOwner(uid);if(row.owner!==uid)throw Error('只能继续编辑自己的作品');
   const fresh=check(await db.from('ink_works').select('*').eq('owner',uid).eq('id',row.id).single());requireOwner(uid);
   if(!validPath(fresh.image_path,uid)||fresh.draft_path&&!validPath(fresh.draft_path,uid))throw Error('作品存储路径不符合账号权限');
   let payload=null;if(fresh.draft_path){const blob=check(await db.storage.from('ink-drafts').download(fresh.draft_path));payload=await codec.unpack(blob);requireOwner(uid)}
   let id=payload?.id||String(fresh.local_id).split('|').at(-1),previous=await store.get(id);if(previous?.cloud141?.owner&&previous.cloud141.owner!==uid)throw Error('本机同编号作品属于另一账号，未覆盖');
   if(previous?.cloud141?.id&&previous.cloud141.id!==fresh.id){id='cloud141:'+fresh.id;previous=await store.get(id)}
   const pending=(await store.entries('cloud-outbox101:')).some(([,job])=>job.id===id&&(!job.owner||job.owner===uid));if(pending&&previous?.draft){const error=Error('本机此作品尚有待同步修改，请先同步或备份本机版，避免覆盖');error.code='pending141';error.localId=id;throw error}
   const blob=check(await db.storage.from('ink-works').download(fresh.image_path));requireOwner(uid);
   const meta={owner:uid,id:fresh.id,localId:fresh.local_id,updatedAt:fresh.updated_at};const record={id,title:fresh.title,date:payload?.date||new Date(fresh.updated_at).toLocaleString('zh-CN'),created:payload?.created||Date.parse(fresh.updated_at),updated:Date.parse(fresh.updated_at),blob,thumbnail:blob,draft:payload?.draft||previous?.draft||null,quoteAuthor:payload?.quoteAuthor||'',quoteTitle:payload?.quoteTitle||'',copySource141:payload?.copySource141||null,cloud141:meta};
   if(record.draft)record.draft={...record.draft,editingWork110:{id,title:record.title,date:record.date,created:record.created,cloud141:meta}};
   await store.saveWork(record);return record;
  }
  async function edit(row){if(app.isDrawing128?.())throw Error('请先完成当前笔画');let record;try{record=await load(row)}catch(e){if(e.code!=='pending141'||!confirm('本机仍有未同步修改。是否先另存一份本机原笔迹备份，再读取云端版本？'))throw e;const uid=owner(),local=await store.get(e.localId);requireOwner(uid);if(!local?.draft)throw e;const id='work:'+uuid(),draft=JSON.parse(JSON.stringify(local.draft)),backup={...local,id,title:local.title+' · 本机备份',created:Date.now(),cloud141:null,draft};draft.editingWork110={id,title:backup.title,created:backup.created,date:backup.date,cloud141:null};await store.saveWork(backup);for(const [key,job]of await store.entries('cloud-outbox101:'))if(job.id===e.localId&&(!job.owner||job.owner===uid))await store.delete(key);record=await load(row)}const opened=await app.editSavedWork(record.id);if(opened!==false&&record.copySource141&&record.draft?.referenceData111)await root.CopyAlbums38?.resumeDraft141?.(record.copySource141,record.draft,record.id);notify();return record}
  async function remove(row){
   const uid=owner();requireOwner(uid);if(!online())throw Error('删除云端作品需要联网；本机作品未删除');if(row.owner!==uid)throw Error('只能删除自己的作品');
   const fresh=check(await db.from('ink_works').select('id,owner,local_id,image_path,draft_path').eq('owner',uid).eq('id',row.id).maybeSingle());requireOwner(uid);if(!fresh)return;
   let localId=String(fresh.local_id).split('|').at(-1);const sameId=await store.get(localId);if(sameId?.cloud141?.id&&sameId.cloud141.id!==fresh.id)localId='cloud141:'+fresh.id;
   if(sameId&&!sameId.cloud141){const shared=check(await db.from('ink_works').select('id').eq('owner',uid).eq('image_path',fresh.image_path).neq('id',fresh.id).limit(1).maybeSingle());if(shared)localId='cloud141:'+fresh.id}
   for(const meta of await store.get('works-index')||[]){const local=await store.get(meta.id);if(local?.cloud141?.id===fresh.id&&local.cloud141.owner===uid){localId=meta.id;break}}
   await store.set(key(uid,localId),{at:Date.now(),cloudId:fresh.id});
   try{const removed=check(await db.from('ink_works').delete().eq('owner',uid).eq('id',fresh.id).select('id'));if(removed?.length!==1)throw Error('云端作品未删除，请刷新后重试')}catch(e){await store.delete(key(uid,localId));throw e}
   for(const [k,job]of await store.entries('cloud-outbox101:'))if(job.id===localId&&(!job.owner||job.owner===uid))await store.delete(k);
   for(const [bucket,path]of [['ink-works',fresh.image_path],['ink-drafts',fresh.draft_path]])await cleanup(bucket,path,uid);
   notify();return localId;
  }
  async function deleteLocal(id){const uid=owner(),record=await store.get(id);if(record?.cloud141?.owner&&record.cloud141.owner!==uid)throw Error('请登录作品所属账号后删除');if(!uid)return;if(!online())throw Error('请联网后删除，以同时移除云端版本');const row=await findLocal(id,uid);if(row)await remove(row);else{await store.set(key(uid,id),{at:Date.now()});for(const [k,job]of await store.entries('cloud-outbox101:'))if(job.id===id&&(!job.owner||job.owner===uid))await store.delete(k)}}
  return{upload,load,edit,remove,deleteLocal,findLocal,deleted};
 }
 root.CloudDraftService141={create:service};
 if(!root.document)return;
 (function init(){if(!root.InkCloud75?.client||!root.DraftCodec141){setTimeout(init,80);return}const cloud=root.InkCloud75,app=root.AnnotationApp;const notify=()=>document.dispatchEvent(new Event('cloud-copies83'));root.CloudDraft141=service({cloud,app,store:root.DraftStore,codec:root.DraftCodec141,notify});
  let migrating=false,migrationFailures141=0;
  async function migrate(){if(migrating||!cloud.user||!navigator.onLine||!root.OfflineSync101)return;migrating=true;migrationFailures141=0;const uid=cloud.user.id;try{for(const meta of await DraftStore.get('works-index')||[]){if(cloud.user?.id!==uid)break;while(app.writing()&&cloud.user?.id===uid)await new Promise(r=>setTimeout(r,1000));if(cloud.user?.id!==uid)break;try{const record=await DraftStore.get(meta.id);if(!Array.isArray(record?.draft?.flow?.strokes)||record.cloud141)continue;const remote=await root.CloudDraft141.findLocal(record.id,uid);if(remote?.draft_path)continue;await root.OfflineSync101.enqueue(record,undefined,true)}catch(e){migrationFailures141++;console.warn('旧作品原笔迹等待补传',e.message)}await new Promise(r=>setTimeout(r,0))}}catch(e){migrationFailures141++;console.warn('旧作品原笔迹等待补传',e.message)}finally{migrating=false}}
  document.addEventListener('cloud-user84',migrate);addEventListener('online',migrate);setTimeout(migrate,2500);
  const head=document.getElementById('worksDialog')?.querySelector('.dialogHead');if(head){const button=document.createElement('button');button.type='button';button.textContent='同步原笔迹';button.onclick=async()=>{if(!cloud.user){app.toast('请先登录，再同步原笔迹');return}if(!navigator.onLine){app.toast('请联网后同步；本机原笔迹保留');return}if(migrating){app.toast('正在补传旧作品，请稍后查看同步状态');return}button.disabled=true;try{await migrate();await root.OfflineSync101?.flush();const jobs=(await root.OfflineSync101?.pending()||[]).filter(j=>!j.owner||j.owner===cloud.user?.id);app.toast(migrationFailures141?'部分原笔迹尚未补传，请保持联网后重试':jobs.length?'原笔迹仍在待同步队列，请保持联网':'可编辑原笔迹同步完成')}catch(e){app.toast(e.message)}finally{button.disabled=false}};head.append(button)}
 })();
})(typeof window==='undefined'?globalThis:window);
