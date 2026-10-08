/* Batch mutations are constrained to the signed-in owner, including every selected ID. */
(function init(){if(!window.Revision95?.ready||!window.WorkAlbums84){setTimeout(init,70);return}
const E=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n};
async function attach(host,works){if(!InkCloud75.user)return;const owner=InkCloud75.user.id,selected=new Set(),bar=E('section');bar.className='cloudBatch95';bar.setAttribute('aria-label','批量管理云端作品');const status=E('small');status.className='batchStatus95';status.setAttribute('role','status');let working=false;
const cards=[...host.querySelectorAll('.cloudWork75[data-cloud-id95]')],pickers=[];
function sync(){for(const [id,input]of pickers)input.checked=selected.has(id);for(const b of bar.querySelectorAll('button'))b.disabled=working||(b.dataset.needsSelection==='true'&&!selected.size);status.textContent='已选 '+selected.size+' / '+works.length+' 幅';}
function button(text,fn,needs=false){const b=E('button',text);b.type='button';b.dataset.needsSelection=String(needs);b.onclick=async()=>{if(working||InkCloud75.user?.id!==owner)return;working=true;sync();try{await fn()}catch(e){status.textContent='操作未完成：'+(e.message||e);AnnotationApp.toast(status.textContent)}finally{working=false;for(const b of bar.querySelectorAll('button'))b.disabled=b.dataset.needsSelection==='true'&&!selected.size}};bar.append(b);return b}
button('全选',()=>{for(const card of cards)if(!card.hidden)selected.add(card.dataset.cloudId95);sync()});button('取消',()=>{selected.clear();sync()});
async function publish(value){const result=await InkCloud75.client.from('ink_works').update({published:value}).in('id',[...selected]).eq('owner',owner).select('id');if(result.error)throw result.error;if(result.data?.length!==selected.size)throw Error('部分作品未更新，请刷新后检查');await InkCloud75.showMine();await InkCloud75.renderGallery();document.dispatchEvent(new Event('cloud-copies83'));document.dispatchEvent(new Event('work-featured54'))}
button('批量发布',()=>publish(true),true);button('批量私藏',()=>publish(false),true);
button('批量删除',async()=>{if(!confirm('永久删除选中的 '+selected.size+' 幅作品及云端版本？无法撤销。'))return;for(const row of works.filter(w=>selected.has(w.id))){const id=await CloudDraft141.remove(row);if(id)await DraftStore.deleteWorks([id])}await InkCloud75.showMine();document.dispatchEvent(new Event('cloud-copies83'));document.dispatchEvent(new Event('work-featured54'));await InkCloud75.renderGallery()},true);
const album=E('select');album.setAttribute('aria-label','批量作品分类');const loadAlbums=()=>album.replaceChildren(new Option('未分类',''),...Object.keys(WorkAlbums84.get()).map(name=>new Option(name,name)));loadAlbums();bar.append(album);
button('批量分类',async()=>{const ids=works.filter(w=>selected.has(w.id)).map(w=>w.local_id?.split('|').at(-1)||w.local_id);await WorkAlbums84.assignMany(ids,album.value);await InkCloud75.showMine()},true);
button('新分类',async()=>{const name=prompt('新分类名称（1—36字）');if(!name)return;await WorkAlbums84.create(name.trim());loadAlbums();album.value=name.trim();status.textContent='分类已创建；选择作品后点批量分类'});
bar.append(status);host.querySelector('h3')?.after(bar);
for(const card of cards){const label=E('label');label.className='cloudPick95';const input=E('input');input.type='checkbox';input.setAttribute('aria-label','选择作品 '+(works.find(w=>w.id===card.dataset.cloudId95)?.title||''));input.onchange=()=>{input.checked?selected.add(card.dataset.cloudId95):selected.delete(card.dataset.cloudId95);sync()};label.append(input,document.createTextNode('选择'));card.prepend(label);pickers.push([card.dataset.cloudId95,input])}sync();
}
window.CloudTools95={attach};
})();
