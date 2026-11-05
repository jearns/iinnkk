// One on-demand paper library for the film studio and all writing modes.
const tr=s=>window.I18n218?.text(s)||s;
const node=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=tr(text);return n};
let flight;
export function loadPapers312(){return flight||(flight=fetch('release313/papers.json').then(r=>{if(!r.ok)throw Error('帖纸暂未加载，请重试');return r.json()}).catch(e=>{flight=null;throw e}))}
export async function pickPaper312({catalogue}={}){
 const rows=await loadPapers312();if(!document.querySelector('link[data-papers312]')){const l=document.createElement('link');l.rel='stylesheet';l.href='release312/papers.css';l.dataset.papers312='';document.head.append(l)}
 return new Promise(resolve=>{
  const d=node('dialog');d.className='papers312';d.dataset.fixed224='true';d.dataset.noWait218='';d.ariaLabel=tr('名帖纸张');let finished=false;
  const finish=value=>{if(finished)return;finished=true;d.close();d.remove();resolve(value)};
  const header=node('header'),close=node('button','×');close.type='button';close.ariaLabel=tr('关闭');close.onclick=()=>finish(null);header.append(node('strong','名帖纸张'),close);
  const note=node('p','原纸纹与原印重新排版，小印靠边，中央留白。'),grid=node('section');grid.className='paperGrid312';d.append(header,note,grid);
  for(const row of rows){const card=node('article'),button=node('button'),image=node('img'),title=node('strong',row.title),meta=node('small',[row.era,row.work].filter(Boolean).map(tr).join(' · '));button.type='button';button.ariaLabel=tr('使用这张帖纸')+' · '+tr(row.title);image.src=row.thumbnail;image.loading='lazy';image.alt=tr(row.title);button.append(image,title,meta);button.onclick=()=>finish({data:row.image,kind:'paper312',title:row.title,source:row.sourceImage,paper312:row});const detail=node('details'),summary=node('summary','纸与印的故事'),story=node('p',row.story),source=node('a','资料来源 ↗');source.href=row.source;source.target='_blank';source.rel='noopener noreferrer';detail.append(summary,story,source);card.append(button,detail);grid.append(card)}
  if(catalogue){const all=node('button','浏览全站名帖');all.type='button';all.className='paperCatalogue312';all.onclick=()=>finish(Promise.resolve().then(catalogue));d.append(all)}
  d.oncancel=e=>{e.preventDefault();finish(null)};d.addEventListener('close',()=>finish(null),{once:true});document.body.append(d);d.showModal();window.I18n218?.apply?.(d);
 });
}
export async function applyWriterPaper312(selected){
 if(!selected)return;const row=selected.paper312;if(!row)throw Error('帖纸暂未加载，请重试');const image=await window.ReferenceIO129.load(row.image,window.location.href);
 window.FloatingPost214?.reset215?.();await window.AnnotationApp.setFloatingBackground214(image,{source222:row.image,opacity:1,exportBackground:true,originalData215:row.image,sourceTitle215:row.title,clean215:false,float215:false});
 window.AnnotationApp.toast(tr('帖纸已应用'));
}
