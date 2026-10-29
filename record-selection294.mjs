// Only metadata is queued. Each page's original strokes are read when that scene is prepared.
export async function localItems294(store,id,choice='current'){
 const record=await store.get(id);if(!record)throw Error('作品暂未读取，请返回我的作品重新选择。');
 const book=record.copyBook158,pages=book?.pages||[];
 if(!pages.length)return[{id,title:record.title||'我的手写作品',source:'local',page:null}];
 const indices=choice==='all'?pages.map((_,i)=>i):Array.isArray(choice)?choice:[Math.min(pages.length-1,book.index||0)];
 const result=indices.filter((i,n)=>Number.isInteger(i)&&i>=0&&i<pages.length&&indices.indexOf(i)===n).filter(i=>pages[i].draftRef192||pages[i].draft||pages[i].owned181||i===(book.index||0)&&record.draft).map(i=>({id,title:record.title||'我的手写作品',source:'local',page:i,pageCount:pages.length,draftRef:pages[i].draftRef192||(pages[i].owned181?id+':page:'+(pages[i].id128||i):null)}));if(!result.length)throw Error('所选页面没有保存笔迹，请先保存临写页。');return result;
}
export async function loadDraft294(store,item){
 if(item.owner){let owner=null;try{owner=JSON.parse(localStorage.getItem('sb-mymubscofhvnjixdupbh-auth-token')||'null')?.user?.id}catch{}if(owner!==item.owner)throw Error('账号已切换，请重新选择作品。');}if(item.draft)return item.draft;if(item.draftRef){const draft=await store.get(item.draftRef);if(draft)return draft;}
 const record=await store.get(item.id);if(!record)throw Error('所选作品已不存在，请重新选择。');
 if(item.page!=null){const page=record.copyBook158?.pages?.[item.page];if(!page)throw Error('所选临写页已不存在。');return page.draft||(page.draftRef192?await store.get(page.draftRef192):null)||(item.page===(record.copyBook158.index||0)?record.draft:null);}
 return record.draft;
}
export async function scopeDialog294(store,id){
 const items=await localItems294(store,id,'all');if(!items[0].pageCount||items[0].pageCount<2)return items;
 return new Promise(resolve=>{
  const d=document.createElement('dialog');d.className='recordScope294';d.dataset.fixed224='true';d.setAttribute('aria-label','选择纪录页面');
  const text=s=>window.I18n218?.text(s)||s;
  const title=document.createElement('h2');title.textContent=text('选择纪录页面');d.append(title);const hint=document.createElement('p');hint.textContent=text('仅纪录已保存笔迹的页面。');d.append(hint);
  const tools=document.createElement('nav'),pages=document.createElement('div');pages.className='recordPages294';d.append(tools,pages);const boxes=[];
  items.forEach((item,i)=>{const label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.checked=false;box.ariaLabel='第 '+(item.page+1)+' 页';boxes.push(box);label.append(box,document.createTextNode(text('第 {page} 页').replace('{page}',item.page+1)));pages.append(label)});
  const button=(text,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=window.I18n218?.text(text)||text;b.onclick=fn;tools.append(b);return b};
  button('纪录当前临写页',async()=>{finish(await localItems294(store,id))});button('纪录全部临写组图',()=>finish(items));
  button('纪录勾选页面',()=>{const chosen=items.filter((_,i)=>boxes[i].checked);if(chosen.length)finish(chosen)});button('取消',()=>finish(null));
  let done=false;function finish(value){if(done)return;done=true;d.close();d.remove();resolve(value)}d.addEventListener('cancel',e=>{e.preventDefault();finish(null)});document.body.append(d);d.showModal();
 });
}
export async function saveSelection294(store,items){const key='record-selection294:'+crypto.randomUUID();await store.set(key,{items,created:Date.now()});return key;}
export function filmFilename294(title){return (String(title||'手筆纪录').replace(/[\\/:*?"<>|\u0000-\u001f]/g,' ').trim().slice(0,90)||'手筆纪录')+'.mp4';}
