/* V85 — interaction/content changes applied cleanly on V84. */
(function init85(){
 if(!window.AnnotationApp?.ready||!window.DailyQuotes38||!document.getElementById('annotationHome')||!document.getElementById('writingQuick73')){setTimeout(init85,60);return}
 const $=id=>document.getElementById(id),A=AnnotationApp,home=$('annotationHome');

 // Disable browser context menu / accidental selection across the writing experience.
 document.addEventListener('contextmenu',e=>{e.preventDefault();e.stopImmediatePropagation()},{capture:true});
 for(const type of ['selectstart','dragstart'])document.addEventListener(type,e=>{if(!(e.target instanceof Element)||!e.target.closest('input,textarea,select,[contenteditable="true"]')){e.preventDefault();e.stopImmediatePropagation()}},{capture:true});

 // Homepage brand.
 const brand=home.querySelector('.annotationBrand'),brandBox=brand?.querySelector('div'),heroTitle=brandBox?.querySelector('h1');
 brandBox?.querySelector('.homeDomain44')?.remove();
 if(brandBox){
   const sub=brandBox.querySelector('p');if(sub)sub.textContent='手写真迹·iinnkk.me·见墨如我';
 }
 const direct=$('continueWriting');if(direct){direct.textContent='我的作品';direct.onclick=e=>{e.preventDefault();$('myWorks')?.click()}}

 // Navigation brand uses exactly the same rendered seal; only appears once the hero brand leaves view.
 const nav=$('homeQuick47'),navBrand=$('homeBrand79');
 if(navBrand){
   navBrand.replaceChildren();const c=document.createElement('canvas');c.className='homeNavLogo85';c.width=c.height=256;const n=document.createElement('span');n.textContent='今日亲笔';navBrand.append(c,n);
   const copy=()=>{const src=$('appLogo');if(!src?.width)return;const t=c.getContext('2d');t.clearRect(0,0,256,256);try{t.drawImage(src,0,0,256,256)}catch{}};copy();setTimeout(copy,450);
   navBrand.classList.remove('visible85');

 }

 // Writer top row: 返回 / 撤销 / 删除 | 预览 / 下载 / 清屏 | 三横菜单.
 const quick=$('writingQuick73'),top=quick?.parentElement;
 if(top&&quick){
   let group=$('writerFixed85');if(!group){group=document.createElement('div');group.id='writerFixed85'}
   for(const id of ['annotationHomeButton','undo','topRemove']){const el=$(id);if(el)group.append(el)}
   top.insertBefore(group,quick);
   const menu=$('menuToggle');if(menu){menu.classList.add('writerMenu85');top.insertBefore(menu,quick.nextSibling)}
 }

 // 临帖 / 创作 start from the absolute upper-right writing edge.
 let pendingMode='';
 document.addEventListener('click',e=>{const b=e.target.closest('#homeQuick47 button,#writerModes53 button');if(!b)return;const t=b.textContent.trim();if(['临帖','创作','图文'].includes(t))pendingMode=t},{capture:true});
 function focusUpperRight(){if(A.isOverview55?.())return;const g=A.writingGrid67?.();if(!g?.area)return;const a=g.area;A.focusPoint?.({x:a.x+a.w-Math.max(.01,g.dx*.35),y:a.y+Math.max(.01,g.dy*.35)})}
 const bodyObserver=new MutationObserver(()=>{if(!document.body.classList.contains('home-open')&&pendingMode){const mode=pendingMode;pendingMode='';setTimeout(()=>mode==='图文'?openPhotoPreview():focusUpperRight(),100)}});bodyObserver.observe(document.body,{attributes:true,attributeFilter:['class']});

 // 图文 defaults to 下图上文 and enters full-paper preview.
 function setBottomPhoto(){for(const id of ['photoMode','quickPhotoMode']){const el=$(id);if(!el)continue;const o=[...el.options].find(x=>x.value==='bottom'||/下图上文/.test(x.textContent));if(o){el.value=o.value;el.dispatchEvent(new Event('change',{bubbles:true}))}}}
 let previewHint=$('previewHint85');if(!previewHint){previewHint=document.createElement('div');previewHint.id='previewHint85';previewHint.textContent='单指双击屏幕，即刻亲笔书写！';$('board')?.append(previewHint)}previewHint.hidden=true;let previewTouched120=false,wasOverview120=false;document.addEventListener('preview-painted94',()=>{const on=!!A.isOverview55?.();if(on&&!wasOverview120)previewTouched120=false;previewHint.hidden=!on||previewTouched120;wasOverview120=on;const color=$('papercolor')?.value||'#f5f1e6',hex=/^#([0-9a-f]{6})$/i.exec(color);if(hex){const rgb=[0,2,4].map(i=>parseInt(hex[1].slice(i,i+2),16)),dark=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722<128;previewHint.style.background=dark?'#211b18c7':'#fffaf0d6';previewHint.style.color=dark?'#fff9e8':'#242018'}});
 function openPhotoPreview(){setBottomPhoto();previewHint.hidden=true}
 let lastTap=null,doubleTimer=0,previewPointers85=new Map(),previewMulti85=false;
 $('board')?.addEventListener('pointerdown',e=>{if(!A.isOverview55?.()||e.target!==$('live'))return;previewPointers85.set(e.pointerId,{x:e.clientX,y:e.clientY,t:Date.now(),moved:false});if(previewPointers85.size>1){previewMulti85=true;lastTap=null;clearTimeout(doubleTimer)}},true);
 $('board')?.addEventListener('pointermove',e=>{const p=previewPointers85.get(e.pointerId);if(p&&Math.hypot(e.clientX-p.x,e.clientY-p.y)>8){p.moved=true;if(doubleTimer){clearTimeout(doubleTimer);doubleTimer=0;lastTap=null}}},true);
 const previewRelease85=e=>{const p=previewPointers85.get(e.pointerId);previewPointers85.delete(e.pointerId);const valid=p&&!p.moved&&!previewMulti85&&e.type==='pointerup'&&Date.now()-p.t<300&&A.isOverview55?.();if(!previewPointers85.size)previewMulti85=false;if(!valid){lastTap=null;clearTimeout(doubleTimer);doubleTimer=0;return}if(A.previewPhotoAt106?.(e.clientX,e.clientY)){lastTap=null;clearTimeout(doubleTimer);doubleTimer=0;return}const now=Date.now(),same=lastTap&&now-lastTap.t<420&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<28;
  const count=same?lastTap.count+1:1;lastTap={x:e.clientX,y:e.clientY,t:now,count};clearTimeout(doubleTimer);
  doubleTimer=setTimeout(()=>{doubleTimer=0;const tap=lastTap;lastTap=null;if(!tap||!A.isOverview55?.())return;if(tap.count===2)A.writeAtPreview96?.(tap.x,tap.y);else if(tap.count===3)window.PreviewPaper120?.toggle?.();else if(tap.count===4)A.toggleGrid128?.();previewTouched120=true;previewHint.hidden=true},420);
 };
 for(const type of ['pointerup','pointercancel'])$('board')?.addEventListener(type,previewRelease85,{passive:true});
 $('fitView')?.addEventListener('click',()=>setTimeout(()=>{if(!A.isOverview55?.())previewHint.hidden=true},0));

 // Seal editor stays small and moves away from the seal that was touched.
 let lastPoint={x:innerWidth*.75,y:innerHeight*.25};document.addEventListener('pointerdown',e=>{if(e.target.closest('#board,#sealHandles'))lastPoint={x:e.clientX,y:e.clientY}},{capture:true,passive:true});
 const inspector=$('sealInspector');if(inspector){const place=()=>{if(inspector.hidden)return;const right=lastPoint.x<innerWidth/2,pad=10;inspector.style.left=right?'auto':pad+'px';inspector.style.right=right?pad+'px':'auto';inspector.style.top=Math.max(54,Math.min(innerHeight-220,lastPoint.y-60))+'px'};new MutationObserver(()=>requestAnimationFrame(place)).observe(inspector,{attributes:true,attributeFilter:['hidden']});addEventListener('resize',place,{passive:true})}

 // Quote categories and source data.
 $('moonRanking56')?.remove();
 const D=DailyQuotes38;
 D.manageCategory?.('liu','好风长吟');
 D.manageCategory?.('dongpo','东坡先生');
 D.manageCategory?.('nobel','诺贝尔文学');
 D.manageCategory?.('xuyuanchong','许渊冲泡');
 const originalTheory=q=>{
   if(q.cat!=='theory')return q;
   const raw=String(q.original||q.q||'').trim();
   const sentence=raw.match(/^.*?[。！？](?=|$)/)?.[0]||raw;
   let paragraph=q.paragraph||q.context||'';
   const sourceTitle=String(q.source||q.s||'').match(/《([^》]+)》/)?.[1]||'';
   if(!paragraph&&sourceTitle&&window.PracticeTexts){
     const doc=PracticeTexts.find(x=>x.name.includes(sourceTitle)||x.note?.includes(sourceTitle));
     if(doc?.text){
       const key=sentence.replace(/[，。；：、“”‘’！？s]/g,'').slice(0,8),plain=doc.text.replace(/s/g,'');
       let at=key?plain.indexOf(key):-1;if(at<0)at=0;
       const start=Math.max(0,at-90),end=Math.min(plain.length,at+220);paragraph=plain.slice(start,end);
     }
   }
   return {...q,q:sentence,paragraph:paragraph||sentence,commentary:''};
 };
 const base=D.all().map(originalTheory);
 const keys=new Set(base.map(x=>(x.id||'')+'|'+x.cat+'|'+x.q));
 const add=[];
 const push=(row)=>{const k=(row.id||'')+'|'+row.cat+'|'+row.q;if(!keys.has(k)){keys.add(k);add.push(row)}};
 // 东坡先生：只收诗词、文章、书法释文；明确排除“书法理论”，并按正文/作品名去重。
 const dongpoSeen=new Set();
 const normDongpo=row=>{
   const title=String(row.title||row.source||row.s||'').replace(/[《》【】·s]/g,'').replace(/中国|宋|苏轼/g,'');
   const body=String(row.q||'').replace(/[s，。！？；：、“”‘’（）()《》【】—…]/g,'');
   return (body.slice(0,160)||title)+'|'+title.slice(0,60);
 };
 const pushDongpo=row=>{
   if(!row||row.cat==='theory'||/书法理论|论书|书论/.test(String(row.category||'')+' '+String(row.type||'')))return;
   const k=normDongpo(row);if(!k||dongpoSeen.has(k))return;dongpoSeen.add(k);
   push({...row,cat:'dongpo',country:'中国'});
 };
 for(const q of base)if(q.author==='苏轼'&&q.cat!=='theory')pushDongpo({...q,id:'dongpo-'+(q.id||Math.random().toString(36).slice(2))});
 for(const q of window.Poetry100||[])if(q.author==='苏轼')pushDongpo({...q,id:'dongpo-poetry-'+(q.id||Math.random().toString(36).slice(2))});
 for(const p of window.PracticeTexts||[])if(p.author==='苏轼'&&!/理论|论书|书论/.test(String(p.name||'')+' '+String(p.note||'')))pushDongpo({id:'dongpo-practice-'+p.id,q:p.text,s:'中国·苏轼《'+p.name.split('·').at(-1).trim()+'》',source:'苏轼《'+p.name.split('·').at(-1).trim()+'》',author:'苏轼',title:p.name.split('·').at(-1).trim(),country:'中国',supplied:true});
 // Nobel category: only existing verified/user-supplied excerpts, no fabricated text.
 const nobelAuthors=new Set(['苏利·普吕多姆','蒙森','比昂松','米斯特拉尔','显克维奇','卡尔杜齐','吉卜林','欧肯','拉格洛夫','海泽','梅特林克','豪普特曼','泰戈尔','罗曼·罗兰','叶芝','萧伯纳','托马斯·曼','辛克莱·刘易斯','高尔斯华绥','皮兰德娄','奥尼尔','黑塞','纪德','艾略特','福克纳','罗素','拉格奎斯特','海明威','加缪','帕斯捷尔纳克','圣琼·佩斯','斯坦贝克','萨特','肖洛霍夫','川端康成','贝克特','索尔仁尼琴','聂鲁达','伯尔','辛格','米沃什','马尔克斯','戈尔丁','布罗茨基','帕斯','沃尔科特','大江健三郎','希尼','若泽·萨拉马戈','君特·格拉斯','奈保尔','库切','帕慕克','勒克莱齐奥','赫塔·米勒','特朗斯特罗姆','莫言','门罗','莫迪亚诺','阿列克谢耶维奇','石黑一雄','托卡尔丘克','彼得·汉德克','古尔纳']);
 for(const q of base)if(q.cat==='literature'&&nobelAuthors.has(q.author))push({...q,id:'nobel-'+(q.id||Math.random().toString(36).slice(2)),cat:'nobel'});
 // 许渊冲泡 only accepts already-tagged/licensed text in the local corpus; never invent translations.
 for(const q of base)if(q.translator==='许渊冲'||/许渊冲/.test(q.s||''))push({...q,id:'xuyuanchong-'+(q.id||Math.random().toString(36).slice(2)),cat:'xuyuanchong'});
 D.setAll([...base,...add]);
 D.manageCategory?.('liu','好风长吟');D.manageCategory?.('dongpo','东坡先生');D.manageCategory?.('nobel','诺贝尔文学');D.manageCategory?.('xuyuanchong','许渊冲泡');

 // Country · author · work attribution, theory full paragraph, no commentary.
 function quoteLabel(q){const title=q.title||String(q.source||q.s||'').match(/《([^》]+)》/)?.[1]||'';return [q.country||q.era||q.dynasty||'中国',q.author||'',title].filter(Boolean).join('·')}
 document.addEventListener('quote-changed',e=>{const q=e.detail||{};window.currentQuote=q;const label=quoteLabel(q);const source=$('quoteSource'),head=document.querySelector('.bookmarkSource79');if(source)source.textContent=label;if(head)head.textContent=label;if(q.cat==='theory'){if($('quoteText'))$('quoteText').textContent=q.q||'';if($('quoteExpanded'))$('quoteExpanded').textContent=q.paragraph||q.q||''}});

 // Large elegant palette family for every quote category.
 const hash=s=>{let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
 const hsl=(h,s,l)=>{h=((h%360)+360)%360;const a=s*Math.min(l,100-l)/100,f=n=>{const k=(n+h/30)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1))},x=n=>Math.round(255*f(n)/100).toString(16).padStart(2,'0');return '#'+x(0)+x(8)+x(4)};
 function palette(seed){const n=hash(seed),h=n%360,v=(n>>>7)%12,j=((n>>>17)%19)-9;if(v===0)return{paper:hsl(h,18,96),ink:hsl(h+185+j,48,18),seal:hsl(h+18,70,38)};if(v===1)return{paper:hsl(h,36,88),ink:hsl(h+145+j,58,19),seal:hsl(h+285,64,42)};if(v===2)return{paper:hsl(h,22,18),ink:hsl(h+28+j,28,92),seal:hsl(h+165,70,58)};if(v===3)return{paper:hsl(h,48,84),ink:hsl(h+205+j,60,17),seal:hsl(h+330,72,38)};if(v===4)return{paper:hsl(h,14,97),ink:hsl(h+24+j,62,21),seal:hsl(h+190,60,37)};if(v===5)return{paper:hsl(h,28,24),ink:hsl(h+178+j,24,92),seal:hsl(h+52,76,57)};if(v===6)return{paper:hsl(h,50,86),ink:hsl(h+120+j,62,18),seal:hsl(h+245,66,40)};if(v===7)return{paper:hsl(h,12,92),ink:hsl(h+225+j,48,19),seal:hsl(h+8,74,39)};if(v===8)return{paper:hsl(h,38,21),ink:hsl(h+205+j,38,90),seal:hsl(h+95,68,59)};if(v===9)return{paper:hsl(h,34,88),ink:hsl(h+300+j,52,18),seal:hsl(h+155,66,37)};if(v===10)return{paper:hsl(h,20,79),ink:hsl(h+160+j,58,15),seal:hsl(h+275,68,34)};return{paper:hsl(h,10,96),ink:hsl(h+180+j,50,16),seal:hsl(h+28,74,36)}}
 function contrast(hex){const x=hex.replace('#',''),r=parseInt(x.slice(0,2),16),g=parseInt(x.slice(2,4),16),b=parseInt(x.slice(4,6),16);return (.2126*r+.7152*g+.0722*b)/255>.56?'#181817':'#f8f4ea'}
 function applyPalette(p){if(!p)return;A.applyLiteraryPalette61?.(p);for(const item of A.sealItems?.()||[])if(item?.extra)A.editSeal?.(item.key,{config:{color:p.seal}});document.documentElement.style.setProperty('--bookmark-bg85',p.ink);document.documentElement.style.setProperty('--bookmark-fg85',contrast(p.ink));document.documentElement.style.setProperty('--bookmark-seal85',p.seal)}
 document.addEventListener('quote-changed',e=>{const q=e.detail||{};if(!window.Revision90)applyPalette(palette((q.id||'')+'|'+(q.q||'')+'|'+(q.author||'')))});
 setTimeout(()=>D.refresh?.(),0);
 window.Revision85={ready:true,palette,applyPalette,focusUpperRight};
})();
