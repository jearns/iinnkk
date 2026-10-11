// One compositor powers current-preview and saved-copy exports.
export function layout(sizes,mode){
 if(!sizes.length||sizes.some(s=>!(s.width>0&&s.height>0)))throw Error('图片尺寸无效');
 const height=3600,gap=64,margin=128,footer=700,widths=sizes.map(s=>height*s.width/s.height);
 const rawWidth=widths.reduce((a,b)=>a+b,0)+gap*(sizes.length-1)+margin*2,rawHeight=height+margin*2+footer;
 const scale=4096/Math.max(rawWidth,rawHeight);
 let x=margin*scale;const boxes=widths.map(width=>{const b={x,y:margin*scale,width:width*scale,height:height*scale};x+=(width+gap)*scale;return b});
 return{width:Math.max(1,Math.round(rawWidth*scale)),height:Math.max(1,Math.round(rawHeight*scale)),boxes,footerY:(height+margin*2)*scale,footerHeight:footer*scale};
}

export async function artwork(book,index,store=globalThis.DraftStore,options={}){
 const page=book.pages[index];if(!page||page.invalid179)return null;
 const draft=page.draft||await store.get(book.id+':page:'+(page.id128||index));if(draft&&!book.quick179&&!CopyIntegrity181.draftOwned(draft,book,page))return null;
 if((draft?.flow?.strokes?.length||draft?.signatureStrokes?.length)&&globalThis.AnnotationApp?.renderSavedDraft179)return AnnotationApp.renderSavedDraft179(draft,{guide:false,...options});
 // No cross-work fallback; only files admitted by the ownership migration are shown.
 if(!page.owned181&&!book.quick179)return null;
 return await store.get(book.id+':art161:'+(page.id128||index))||page.preview159||null;
}
async function load(source){const blob=source instanceof Blob,url=blob?URL.createObjectURL(source):source;try{return await new Promise((resolve,reject)=>{const image=new Image();image.crossOrigin='anonymous';image.onload=()=>resolve(image);image.onerror=()=>reject(Error('图片加载失败，请检查网络后重试'));image.src=url})}finally{if(blob)URL.revokeObjectURL(url)}}
export async function compose(book,indices,mode,settings={},status={textContent:''}){
 if(!indices.length)throw Error('请至少选择一页临写');const sources=[];
 for(const i of indices){status.textContent='读取第 '+(i+1)+' 页…';let art=await artwork(book,i,DraftStore,{seals:settings.seals!==false,lines:settings.lines!==false,pattern:settings.pattern!==false,background185:settings.background185!==false,guide:settings.original184===true,original184:settings.original184===true});if(!art)throw Error('第 '+(i+1)+' 页尚无临写笔迹');if(mode==='compare'){if(!book.pages[i].image)throw Error('本页原帖不可用');sources.push(book.pages[i].image)}sources.push(art)}
 const sizes=[];for(const source of sources){const im=await load(source);sizes.push({width:im.naturalWidth,height:im.naturalHeight});im.src=''}
 const plan=layout(sizes,mode),canvas=document.createElement('canvas');canvas.width=plan.width;canvas.height=plan.height;const ctx=canvas.getContext('2d');ctx.fillStyle='#f3ead8';if(!(book.pages[indices[0]]?.draft||book.base)?.values?.papercolor?.includes('transparent'))ctx.fillRect(0,0,canvas.width,canvas.height);
 try{for(let i=0;i<sources.length;i++){status.textContent='拼合 '+(i+1)+' / '+sources.length;const im=await load(sources[i]),b=plan.boxes[i];ctx.drawImage(im,b.x,b.y,b.width,b.height);im.src=''}const pad=Math.min(plan.width,plan.height)*.012;ctx.strokeStyle='#b49a70';ctx.lineWidth=Math.max(1,pad*.12);ctx.strokeRect(pad,pad,plan.width-pad*2,plan.height-pad*2);await footer182(ctx,plan,settings,book.pages[indices[0]]?.draft||book.base);return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('图片生成失败')),'image/png'))}finally{canvas.width=canvas.height=1}
}
export function open(book,current){if(!globalThis.ExportStudio181)throw Error('导出界面仍在准备，请稍后重试');return DownloadStudio182.openSaved(book,current)}

async function footer182(ctx,plan,settings,draft){let idea=draft?.paletteCredit96||globalThis.Revision94?.current||globalThis.Revision94?.palettes?.[0]||globalThis.HeritagePalettes102?.[0];if(idea&&globalThis.Revision110?.designIdea)idea={...idea,idea:Revision110.designIdea(idea,draft)};if(!idea)idea={name:'文化遗产配色',idea:'以世界文化遗产的材质与光影，诠释纸色、墨色与印色的相映。'};if(settings.backgroundNote186&&settings.backgroundCaption185?.trim())idea={...idea,backgroundCaption186:settings.backgroundCaption185.trim()};BrandCredit182.draw(ctx,{x:plan.width*.025,y:plan.footerY,width:plan.width*.95,height:plan.footerHeight,qr:settings.qr!==false,credit:settings.credit!==false,idea:settings.palette!==false?idea:idea.backgroundCaption186?{name:'',idea:'',backgroundCaption186:idea.backgroundCaption186}:null})}
export async function composeCurrent(settings={},status={textContent:''}){status.textContent='生成高清正片…';const draft=AnnotationApp.getState(),source=await AnnotationApp.renderCurrent182({seals:settings.seals!==false,lines:settings.lines!==false,pattern:settings.pattern!==false,background185:settings.background185!==false,guide:settings.original184===true,original184:settings.original184===true}),plan=layout([{width:source.width,height:source.height}],'single'),canvas=document.createElement('canvas');canvas.width=plan.width;canvas.height=plan.height;try{const ctx=canvas.getContext('2d');ctx.fillStyle='#f3ead8';if(draft.values?.papercolor!=='transparent')ctx.fillRect(0,0,canvas.width,canvas.height);const b=plan.boxes[0];ctx.drawImage(source,b.x,b.y,b.width,b.height);await footer182(ctx,plan,settings,draft);return await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('PNG 生成失败')),'image/png'))}finally{source.width=source.height=1;canvas.width=canvas.height=1}}
