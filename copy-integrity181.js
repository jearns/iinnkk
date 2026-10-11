/* A page belongs to one writing session; matching reference images alone is insufficient. */
(function(root){
 const tag=(value,book,page)=>!!value&&value.albumId179===book.id&&value.pageId179===page.id128;
 const draftOwned=(draft,book,page)=>draft?.writingMode149==='copy'&&(tag(draft.copyPage181,book,page)||draft.editingWork110?.id===book.id&&!!draft.referenceData111&&draft.referenceData111===page.image);
 async function clean(book,store){
  for(const [index,page]of (book.pages||[]).entries()){
   page.id128=page.id128||crypto.randomUUID();const key=book.id+':page:'+page.id128;
   const cached=await store.get(key),legacy=page.draft;let draft=draftOwned(cached,book,page)?cached:draftOwned(legacy,book,page)?legacy:null,ownedWork=null;const ids=[];
   for(const id of [...new Set(page.workIds||[])]){const work=await store.get(id);if(!tag(work?.copySource141,book,page))continue;ids.push(id);if(work.draft?.writingMode149==='copy'&&!draft){draft=work.draft;ownedWork=work}}
   if(!draft&&!ownedWork){if(page.preview159||legacy||cached)await store.set('copy-quarantine181:'+book.id+':'+page.id128,{draft:legacy,cached,preview159:page.preview159,workIds:page.workIds});page.preview159='';page.draft=null;page.invalid179=true;page.owned181=false;await store.delete(book.id+':art161:'+page.id128)}
   else{page.draft={...draft,copyPage181:{albumId179:book.id,pageId179:page.id128},copyFloat181:page.copyFloat181||draft.copyFloat181};page.invalid179=false;page.owned181=true;await store.set(key,page.draft);if(ownedWork?.thumbnail&&!page.preview159){page.preview159=await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>resolve('');r.readAsDataURL(ownedWork.thumbnail)})}}
   if(!tag(page.previewPage181,book,page))page.preview159='';if(!tag(page.artPage181,book,page))await store.delete(book.id+':art161:'+page.id128);page.workIds=ids;
  }return book;
 }
 root.CopyIntegrity181={clean,draftOwned,tag};
})(typeof window==='undefined'?globalThis:window);
