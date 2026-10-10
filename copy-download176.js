// Loaded only when a saved copy album is downloaded.
export async function artwork(book,index,store=globalThis.DraftStore){
 const page=book.pages[index];if(!page)return null;
 const art=await store.get(book.id+':art161:'+(page.id128||index));if(art)return art;
 for(const id of [...page.workIds||[]].reverse()){const work=await store.get(id);if(work?.blob)return work.blob}
 if(page.preview159)return page.preview159;
 return null;
}
export function layout(sizes,mode){
 if(!sizes.length||sizes.some(s=>!(s.width>0&&s.height>0)))throw Error('图片尺寸无效');
 if(mode==='single'){const s=sizes[0],scale=Math.min(1,16384/Math.max(s.width,s.height),Math.sqrt(16000000/(s.width*s.height))),width=Math.max(1,Math.floor(s.width*scale)),height=Math.max(1,Math.floor(s.height*scale));return{width,height,boxes:[{x:0,y:0,width,height}]}}
 const height=1600,gap=24,margin=32;
 const widths=sizes.map(s=>height*s.width/s.height);
 const rawWidth=widths.reduce((a,b)=>a+b,0)+gap*(sizes.length-1)+margin*2,rawHeight=height+margin*2;
 const scale=Math.min(1,16384/rawWidth,Math.sqrt(16000000/(rawWidth*rawHeight)));
 let x=margin*scale;const boxes=widths.map(width=>{const b={x,y:margin*scale,width:width*scale,height:height*scale};x+=(width+gap)*scale;return b});
 return{width:Math.max(1,Math.floor(rawWidth*scale)),height:Math.max(1,Math.floor(rawHeight*scale)),boxes};
}
async function load(source){const url=source instanceof Blob?URL.createObjectURL(source):source;try{return await new Promise((resolve,reject)=>{const image=new Image();image.crossOrigin='anonymous';image.onload=()=>resolve(image);image.onerror=()=>reject(Error('图片加载失败，请检查网络后重试'));image.src=url})}finally{if(source instanceof Blob)URL.revokeObjectURL(url)}}
async function compose(book,indices,mode,status){
 const sources=[];
 for(const i of indices){status.textContent='读取第 '+(i+1)+' 页…';const art=await artwork(book,i);if(!art)throw Error('第 '+(i+1)+' 页尚无已保存临作');if(mode==='compare'){if(!book.pages[i].image)throw Error('本页原帖不可用');sources.push(book.pages[i].image)}sources.push(art)}
 if(mode==='single'&&sources[0] instanceof Blob)return sources[0];
 // Read dimensions sequentially; decode only one image at a time during composition.
 const sizes=[];for(const source of sources){const im=await load(source);sizes.push({width:im.naturalWidth,height:im.naturalHeight});im.src=''}
 const plan=layout(sizes,mode),canvas=document.createElement('canvas');canvas.width=plan.width;canvas.height=plan.height;const ctx=canvas.getContext('2d');ctx.fillStyle='#f3ead8';ctx.fillRect(0,0,canvas.width,canvas.height);
 try{for(let i=0;i<sources.length;i++){status.textContent='拼合 '+(i+1)+' / '+sources.length;const im=await load(sources[i]),b=plan.boxes[i];ctx.drawImage(im,b.x,b.y,b.width,b.height);im.src=''}return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('图片生成失败')),'image/jpeg',.94))}finally{canvas.width=canvas.height=1}
}
export function open(book,current){
 const d=document.createElement('dialog');d.className='cloud75-dialog';d.style.cssText='width:min(94vw,760px);max-height:88vh;overflow:auto';
 d.innerHTML='<div class="dialogHead"><h2>临作下载</h2><button data-close>关闭 ×</button></div><p>单张临作，或左原帖、右临作对照；勾选多页可拼成长卷。</p><select aria-label="下载方式"><option value="single">当前页临作</option><option value="compare">当前页原帖与临作并排</option><option value="scroll">多页临作长卷</option></select><div data-pages></div><p data-status role="status"></p><button data-generate>生成图片</button><img data-preview alt="下载图片预览" hidden style="width:100%;height:auto"><div data-save hidden><button data-share>保存到相册 / 系统分享</button><button data-download>下载图片</button><p>iPhone / iPad 可在系统分享中选择“存储图像”，也可长按预览图保存。</p></div>';
 document.body.append(d);const find=s=>d.querySelector(s),select=find('select'),pages=find('[data-pages]'),status=find('[data-status]'),preview=find('[data-preview]'),save=find('[data-save]');let chosen=[current],blob=null,url='',working=false;
 const available=book.pages.map((p,i)=>({p,i})).filter(({p,i})=>p.preview159||p.workIds?.length||p.draft?.flow?.strokes?.length||i===current);
 function draw(){pages.replaceChildren();pages.hidden=select.value!=='scroll';for(const{p,i}of available){const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;gap:8px;padding:6px';const input=document.createElement('input');input.type='checkbox';input.checked=chosen.includes(i);const name=document.createElement('span');name.textContent='第 '+(i+1)+' 页'+(chosen.includes(i)?' · 顺序 '+(chosen.indexOf(i)+1):'');input.onchange=()=>{chosen=chosen.filter(n=>n!==i);if(input.checked)chosen.push(i);draw()};row.append(input,name);if(p.preview159){const thumb=document.createElement('img');thumb.src=p.preview159;thumb.alt='第 '+(i+1)+' 页临作';thumb.style.cssText='width:42px;height:42px;object-fit:contain';row.prepend(thumb)}for(const[label,delta]of [['前移',-1],['后移',1]]){const b=document.createElement('button');b.textContent=label;const pos=chosen.indexOf(i);b.disabled=pos<0||pos+delta<0||pos+delta>=chosen.length;b.onclick=()=>{[chosen[pos],chosen[pos+delta]]=[chosen[pos+delta],chosen[pos]];draw()};row.append(b)}pages.append(row)}}
 select.onchange=draw;draw();find('[data-close]').onclick=()=>{if(!working)d.close()};d.addEventListener('cancel',e=>{if(working)e.preventDefault()});
 find('[data-generate]').onclick=async()=>{if(working)return;working=true;find('[data-generate]').disabled=true;select.disabled=true;pages.inert=true;save.hidden=true;preview.hidden=true;try{const indices=select.value==='scroll'?[...chosen]:[current];if(!indices.length)throw Error('请至少选择一页临作');blob=await compose(book,indices,select.value,status);if(!d.isConnected)return;if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);preview.src=url;preview.hidden=false;save.hidden=false;status.textContent='图片已生成，可预览并保存'}catch(e){status.textContent=e.message}finally{working=false;find('[data-generate]').disabled=false;select.disabled=false;pages.inert=false}};
 const filename=()=>String(book.title||'临作').replace(/[\\/:*?"<>|]/g,'_')+'-'+select.value+'.'+(blob?.type==='image/png'?'png':'jpg');
 find('[data-download]').onclick=()=>{const a=document.createElement('a');a.href=url;a.download=filename();a.click();status.textContent='已请求下载；也可长按预览图片保存'};
 find('[data-share]').onclick=async()=>{const file=new File([blob],filename(),{type:blob.type});try{if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:book.title});else{status.textContent='此浏览器请使用下载图片，或长按预览保存到相册'}}catch(e){if(e.name!=='AbortError')status.textContent='系统分享未完成，请下载图片或长按预览保存'}};
 d.addEventListener('close',()=>{if(url)URL.revokeObjectURL(url);d.remove()},{once:true});d.showModal();
}

