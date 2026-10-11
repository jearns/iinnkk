// One compositor powers current-preview and saved-copy exports.
export {layout} from './copy-download180.js';
import {layout} from './copy-download180.js';
export async function artwork(book,index,store=globalThis.DraftStore,options={}){
 const page=book.pages[index];if(!page||page.invalid179)return null;
 const draft=page.draft||await store.get(book.id+':page:'+(page.id128||index));if(draft&&!book.quick179&&!CopyIntegrity181.draftOwned(draft,book,page))return null;
 if(draft?.flow?.strokes?.length&&globalThis.AnnotationApp?.renderSavedDraft179)return AnnotationApp.renderSavedDraft179(draft,{guide:false,...options});
 // No cross-work fallback; only files admitted by the ownership migration are shown.
 if(!page.owned181&&!book.quick179)return null;
 return await store.get(book.id+':art161:'+(page.id128||index))||page.preview159||null;
}
async function load(source){const blob=source instanceof Blob,url=blob?URL.createObjectURL(source):source;try{return await new Promise((resolve,reject)=>{const image=new Image();image.crossOrigin='anonymous';image.onload=()=>resolve(image);image.onerror=()=>reject(Error('图片加载失败，请检查网络后重试'));image.src=url})}finally{if(blob)URL.revokeObjectURL(url)}}
export async function compose(book,indices,mode,settings={},status={textContent:''}){
 if(!indices.length)throw Error('请至少选择一页临写');const sources=[];
 for(const i of indices){status.textContent='读取第 '+(i+1)+' 页…';let art=await artwork(book,i,DraftStore,mode==='overlay'?{guide:true}:{});if(!art)throw Error('第 '+(i+1)+' 页尚无临写笔迹');if(mode==='compare'){if(!book.pages[i].image)throw Error('本页原帖不可用');sources.push(book.pages[i].image)}sources.push(art)}
 const sizes=[];for(const source of sources){const im=await load(source);sizes.push({width:im.naturalWidth,height:im.naturalHeight});im.src=''}
 const plan=layout(sizes,mode),canvas=document.createElement('canvas');canvas.width=plan.width;canvas.height=plan.height;const ctx=canvas.getContext('2d');ctx.fillStyle='#f3ead8';ctx.fillRect(0,0,canvas.width,canvas.height);
 try{for(let i=0;i<sources.length;i++){status.textContent='拼合 '+(i+1)+' / '+sources.length;const im=await load(sources[i]),b=plan.boxes[i];ctx.drawImage(im,b.x,b.y,b.width,b.height);im.src=''}const pad=Math.min(plan.width,plan.height)*.012;ctx.strokeStyle='#b49a70';ctx.lineWidth=Math.max(1,pad*.12);ctx.strokeRect(pad,pad,plan.width-pad*2,plan.height-pad*2);if(settings.qr!==false||settings.credit!==false){if(!(await SealEngine.ensureFont('yishan','手'))&&!globalThis.yiShanBeiSealReady)throw Error('篆书字体加载失败，请重试');BrandCredit180.draw(ctx,{x:pad*2,y:plan.footerY,width:plan.width-pad*4,height:plan.footerHeight*(settings.palette===false?1:.76)-pad,qr:settings.qr!==false,credit:settings.credit!==false,paper:'#f3ead8'})}if(settings.palette!==false){const credit=book.pages[indices[0]]?.draft?.paletteCredit96||book.base?.paletteCredit96;if(credit?.name){ctx.fillStyle='#594c3a';ctx.textAlign='center';ctx.font=Math.max(8,plan.footerHeight*.048)+'px serif';ctx.fillText('设计理念 · '+credit.name,plan.width/2,plan.height-plan.footerHeight*.1,plan.width*.86)}}return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('图片生成失败')),'image/png'))}finally{canvas.width=canvas.height=1}
}
export function open(book,current){if(!globalThis.ExportStudio181)throw Error('导出界面仍在准备，请稍后重试');return ExportStudio181.openSaved(book,current)}
