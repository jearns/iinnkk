/* V88 — polish homepage, infinite palette, and writer top actions. */
(function init88(){
 if(!window.Revision87?.ready||!window.AnnotationApp?.ready||!document.getElementById('annotationHome')){setTimeout(init88,45);return}
 const $=id=>document.getElementById(id),A=AnnotationApp,home=$('annotationHome');

 // 1. Ensure no duplicate seal remains before the homepage title.
 home.querySelectorAll('.homeLogo85,.homeLogo86,.homeLogo87').forEach(e=>e.remove());

 // 2. Theme switch: compact, refined, and placed immediately left of the calendar/reminder pill.
 const theme=home.querySelector('.homeTheme78');
 if(theme){
   theme.classList.add('homeTheme88');
   const brand=home.querySelector('.annotationBrand');
   const buttons=[...brand?.querySelectorAll('button')||[]];
   const reminder=buttons.find(b=>/天后|今天|明天|国庆|中秋|元旦|春节|提醒|日历|倒计时/.test((b.textContent||'')+' '+(b.title||'')+' '+(b.getAttribute('aria-label')||'')));
   for(const b of theme.querySelectorAll('button')){
     const t=(b.textContent||'').trim();
     b.classList.toggle('riverSeal88',/浅色河流/.test(t));
     b.classList.toggle('starSeal88',/深色星空/.test(t));
   }
   if(reminder?.parentElement)reminder.parentElement.insertBefore(theme,reminder);
   else if($('continueWriting')?.parentElement)$('continueWriting').parentElement.insertBefore(theme,$('continueWriting'));
 }

 // 3. Homepage intro wording + exact equal-width subtitle under the brand.
 const intro=home.querySelector('.annotationIntro');
 if(intro){
   let strong=intro.querySelector('strong');
   if(!strong){
     const oldText=(intro.childNodes[0]?.nodeType===3?intro.childNodes[0].textContent:'').trim();
     intro.textContent='';
     strong=document.createElement('strong');
     strong.textContent=oldText||'人类群星闪耀时';
     const small=document.createElement('small');
     small.textContent='在数字的赛博空间，你我一起来结网记字！';
     intro.append(strong,small);
   }else{
     strong.textContent='人类群星闪耀时';
     let small=intro.querySelector('small');
     if(!small){small=document.createElement('small');intro.append(small)}
     small.textContent='在数字的赛博空间，你我一起来结网记字！';
   }
   intro.classList.add('introHead88');
   const brand=home.querySelector('.annotationBrand');
   const nav=home.querySelector('#homeQuick47');
   if(brand){
     // Original head visual area: below brand/actions, above the fixed category nav.
     if(nav?.parentElement===home)home.insertBefore(intro,nav);
     else if(brand.nextSibling!==intro)brand.after(intro);
   }
 }
 function alignBrandSubtitle88(){
   const box=home.querySelector('.annotationBrand>div'),title=box?.querySelector('h1'),sub=box?.querySelector('p');
   if(!title||!sub)return;
   sub.textContent='见墨·iinnkk.me·如我';
   sub.style.letterSpacing='0px';
   sub.style.width='auto';
   sub.style.fontSize='';
   const target=Math.min(title.getBoundingClientRect().width,box.getBoundingClientRect().width);
   const cs=getComputedStyle(sub),canvas=alignBrandSubtitle88.canvas||(alignBrandSubtitle88.canvas=document.createElement('canvas')),ctx=canvas.getContext('2d');
   let size=parseFloat(cs.fontSize)||12;
   ctx.font=cs.font;
   let base=ctx.measureText(sub.textContent).width;
   if(base>target&&target>0){
     size=Math.max(8,size*(target/base)*.97);
     sub.style.fontSize=size+'px';
     const cs2=getComputedStyle(sub);ctx.font=cs2.font;base=ctx.measureText(sub.textContent).width;
   }
   const chars=Array.from(sub.textContent),spacing=chars.length?Math.max(0,Math.min(innerWidth<560?3.2:6,(target-base)/chars.length)):0;
   sub.style.width=target+'px';
   sub.style.maxWidth='100%';
   sub.style.letterSpacing=spacing+'px';
 }
 requestAnimationFrame(()=>requestAnimationFrame(alignBrandSubtitle88));
 document.fonts?.ready?.then(alignBrandSubtitle88);
 addEventListener('resize',alignBrandSubtitle88,{passive:true});

 // 4. Infinite harmonious colour generator — no fixed palette count.
 const frac=x=>x-Math.floor(x);
 const hash=s=>{let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
 const hsl=(h,s,l)=>{h=((h%360)+360)%360;s=Math.max(0,Math.min(100,s));l=Math.max(0,Math.min(100,l));const a=s*Math.min(l,100-l)/100,f=n=>{const k=(n+h/30)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1))},x=n=>Math.round(255*f(n)/100).toString(16).padStart(2,'0');return '#'+x(0)+x(8)+x(4)};
 const lum=hex=>{const x=hex.replace('#','');if(x.length!==6)return .5;const r=parseInt(x.slice(0,2),16),g=parseInt(x.slice(2,4),16),b=parseInt(x.slice(4,6),16);return (.2126*r+.7152*g+.0722*b)/255};
 const contrast=hex=>lum(hex)>.56?'#171716':'#faf6ec';
 function infinitePalette(seed){
   const n=hash(seed),u=frac(n*.618033988749895),v=frac((n^0x9e3779b9)*.41421356237),w=frac((n^0x85ebca6b)*.73205080757);
   const base=u*360;
   // paper can move from porcelain-light to lacquer-dark; ink always creates strong tonal separation.
   const darkPaper=v<.24;
   const paperH=base+(w-.5)*26;
   const paperS=darkPaper?14+v*30:10+v*38;
   const paperL=darkPaper?13+v*24:88+v*9;
   const paper=hsl(paperH,paperS,paperL);
   const relation=120+frac(u+v)*120+(w-.5)*28;
   const inkH=base+relation;
   const inkS=darkPaper?18+48*w:28+55*w;
   const inkL=darkPaper?82+12*frac(v+w):12+18*frac(v+w);
   const ink=hsl(inkH,inkS,inkL);
   const sealH=base+28+frac(w+u)*74;
   const sealS=55+34*frac(v+w);
   const sealL=darkPaper?48+18*frac(u+v):31+18*frac(u+w);
   const seal=hsl(sealH,sealS,sealL);
   const pick=['paper','ink','seal'][n%3];
   return {paper,ink,seal,bookmark:{source:pick,color:{paper,ink,seal}[pick]}};
 }
 function applyInfinite(p){
   if(!p)return;
   A.applyLiteraryPalette61?.(p);
   for(const item of A.sealItems?.()||[])if(item?.extra)A.editSeal?.(item.key,{config:{color:p.seal}});
   const bookmark=p.bookmark?.color||p.ink;
   document.documentElement.style.setProperty('--bookmark-bg88',bookmark);
   document.documentElement.style.setProperty('--bookmark-fg88',contrast(bookmark));
   document.documentElement.style.setProperty('--reader-bg88',p.ink);
   document.documentElement.style.setProperty('--reader-fg88',contrast(p.ink));
 }
 // Override public palette API so V86 preview-random uses the infinite generator.
 if(window.Revision85){Revision85.palette=infinitePalette;Revision85.applyPalette=applyInfinite}
 function recolorQuote88(q,reason='quote'){
   q=q||window.currentQuote||{};
   const p=infinitePalette((q.cat||'all')+'|'+(q.id||'')+'|'+(q.q||'')+'|'+(q.author||'')+'|'+reason+'|'+Date.now());
   applyInfinite(p);
   syncReaderInk88?.();
 }
 document.addEventListener('quote-changed',e=>recolorQuote88(e.detail||{},'change'));
 document.addEventListener('click',e=>{const b=e.target.closest('[data-quote-category],#dailyQuote,.bookmarkNav81 button');if(b)setTimeout(()=>recolorQuote88(window.currentQuote,'nav'),0)},true);
 setTimeout(()=>recolorQuote88(window.currentQuote,'init'),120);
 // Opening the bookmark never recolours the artwork; it only reuses one colour from the latest paper/ink/seal family.
 let lastPalette=null;
 const baseApply=applyInfinite;
 applyInfinite=p=>{lastPalette=p;baseApply(p)};
 if(window.Revision85){Revision85.applyPalette=applyInfinite}
 const daily=$('dailyDialog');
 if(daily)new MutationObserver(()=>{if(daily.open){const p=lastPalette;if(p){const chosen=p.bookmark?.color||p.ink;document.documentElement.style.setProperty('--bookmark-bg88',chosen);document.documentElement.style.setProperty('--bookmark-fg88',contrast(chosen))}else{const ink=A.getState?.()?.brush?.color||'#563b34';document.documentElement.style.setProperty('--bookmark-bg88',ink);document.documentElement.style.setProperty('--bookmark-fg88',contrast(ink))}}}).observe(daily,{attributes:true,attributeFilter:['open']});

 // 5. Writer top-right keeps: undo, redo(返回/恢复), clear, download, preview/write.
 // Remove only the home button and remove-all-pictures button from this top-right strip.
 $('annotationHomeButton')?.remove();
 $('topRemove')?.remove();
 const top=$('topActions'),quick=$('writingQuick73'),group=$('writerFixed85');
 if(top&&group){
   // V85 moved undo inside this wrapper. Move it back BEFORE removing the wrapper,
   // otherwise core historyState() loses #undo and the whole app/navigation crashes.
   const undoInGroup=group.querySelector('#undo');if(undoInGroup)top.append(undoInGroup);
   group.remove();
 }
 if(top){
   const order=['undo','redo','clear','export','fitView'];
   for(const id of order){const el=$(id);if(el)top.append(el)}
   // Keep the existing hamburger and all other tools unchanged after these core actions.
   const menu=$('menuToggle');if(menu)top.append(menu);
 }
 // Remove text shortcut duplicates now that the same actions remain as icons.
 if(quick)quick.hidden=true;

 // 6. Writer top-right core strip:
 // 文字引导 → 预览/书写 → 清屏 → 撤销 → 返回 → 三横菜单.
 const actionBar=$('topActions');
 if(actionBar){
   let guideBtn=$('textGuide88');
   if(!guideBtn){
     guideBtn=document.createElement('button');
     guideBtn.id='textGuide88';
     guideBtn.type='button';
     guideBtn.title='文字引导';
     guideBtn.setAttribute('aria-label','文字引导');
     guideBtn.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14M12 4v16M7 9h10M8 14h8"/><path d="M4 20h16"/></svg>';
     guideBtn.onclick=()=>{
       const dialog=$('controlDialog');
       if(dialog){A.openDialog?.(dialog);setTimeout(()=>{$('guideMode')?.focus()},80)}
     };
   }
   let backBtn=$('writerBack88');
   if(!backBtn){
     backBtn=document.createElement('button');
     backBtn.id='writerBack88';
     backBtn.type='button';
     backBtn.title='返回上一步';
     backBtn.setAttribute('aria-label','返回上一步');
     backBtn.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 8 12l7 7"/><path d="M8 12h11"/></svg>';
     backBtn.onclick=()=>document.dispatchEvent(new CustomEvent('writer-back88',{detail:{source:'toolbar-init'}}));
   }
   const fit=$('fitView'),clear=$('clear'),undo=$('undo'),menu=$('menuToggle');
   for(const el of [guideBtn,fit,clear,undo,backBtn,menu])if(el)actionBar.append(el);
   // Redo remains available in the full toolbar, but not in the right-most core strip.
   const redo=$('redo');if(redo&&redo.nextElementSibling===menu)actionBar.insertBefore(redo,guideBtn);
 }

 // 7. V88f: theme + reminder + my works are one dedicated row, never inside the logo area.
 if(theme){
   const brand=home.querySelector('.annotationBrand');
   const reminder=[...brand?.querySelectorAll('button')||[]].find(b=>/天后|今天|明天|国庆|中秋|元旦|春节|提醒|日历|倒计时/.test((b.textContent||'')+' '+(b.title||'')+' '+(b.getAttribute('aria-label')||'')));
   const works=$('continueWriting');
   let actions=$('homeActions88');
   if(!actions){
     actions=document.createElement('div');
     actions.id='homeActions88';
     brand?.append(actions);
   }
   const account=$('account47');
   const river=[...theme.querySelectorAll('button')].find(b=>/浅色河流|浅色/.test(b.textContent||''));
   const star=[...theme.querySelectorAll('button')].find(b=>/深色星空|深色/.test(b.textContent||''));
   if(river){river.textContent='浅色';river.title='浅色河流 · 阳刻';river.setAttribute('aria-label','浅色河流')}
   if(star){star.textContent='深色';star.title='深色星空 · 阴刻';star.setAttribute('aria-label','深色星空')}
   if(theme)actions.append(theme);
   if(reminder)actions.append(reminder);
   if(works)actions.append(works);
   if(account)actions.append(account);
   function autoTheme88(){
     const hour=new Date().getHours();
     const target=(hour>=18||hour<6)?star:river;
     if(target&&target.getAttribute('aria-pressed')!=='true')target.click();
     document.documentElement.dataset.autoTheme88=(hour>=18||hour<6)?'dark':'light';
   }
   autoTheme88();
   clearInterval(window.autoThemeTimer88);
   window.autoThemeTimer88=setInterval(autoTheme88,60*1000);
 }

 // Account seal glyph stays white in both themes, including late auth rendering.
 const account=$('account47');if(account)account.classList.add('accountWhite88e');
 new MutationObserver(()=>{$('account47')?.classList.add('accountWhite88e')}).observe(home,{childList:true,subtree:true});

 // 8. Writer toolbar: left tools | 加纸加字  ...  撤销 / 返回(Redo) / 清屏 / 预览或书写 / 下载 / 菜单.
 const actionBar88=$('topActions');
 if(actionBar88){
   const guide=$('textGuide88');if(guide)guide.hidden=true;
   const legacyBack=$('writerBack88');if(legacyBack)legacyBack.hidden=true;

   const undo=$('undo'),redo=$('redo'),clear=$('clear'),fit=$('fitView'),download=$('export'),menu=$('menuToggle');
   if(redo){redo.hidden=false;redo.classList.remove('hideRedo88f')}

   // Move real “加纸加字” into the left functional zone.
   const sourceAdd=document.querySelector('#bigPaper62 button');
   let addPaper=$('topAddPaper88');
   if(sourceAdd){
     sourceAdd.hidden=true;
     if(!addPaper){
       addPaper=document.createElement('button');addPaper.id='topAddPaper88';addPaper.type='button';
       addPaper.title='加纸加字';addPaper.setAttribute('aria-label','加纸加字');
       addPaper.onclick=()=>sourceAdd.click();
     }
     addPaper.className='writerAddPaper88';
     addPaper.dataset.symbol='＋';
   }

   // Remove old SVG/text content from the 5 common buttons: only one icon layer + one text layer remains.
   const decorate=(el,label,symbol)=>{
     if(!el)return;
     el.replaceChildren();
     el.classList.remove('writerText88e');
     el.classList.add('writerIconText88');
     el.dataset.label=label;el.dataset.symbol=symbol;
     el.title=label;el.setAttribute('aria-label',label);
   };
   decorate(undo,'撤销','↶');
   decorate(redo,'返回','↷'); // actual Redo: cancel the previous undo
   decorate(clear,'清屏','⌫');
   decorate(download,'下载','⇩');
   function syncFitLabel88(){if(!fit)return;decorate(fit,A.isOverview55?.()?'书写':'预览',A.isOverview55?.()?'✎':'▣')}
   syncFitLabel88();
   fit?.addEventListener('click',()=>requestAnimationFrame(()=>requestAnimationFrame(syncFitLabel88)));
   document.getElementById('board')?.addEventListener('pointerup',()=>setTimeout(syncFitLabel88,40),{passive:true});

   // Split point: Undo is the first button of the right group.
   let split=$('writerSplit88');if(!split){split=document.createElement('span');split.id='writerSplit88';split.setAttribute('aria-hidden','true')}
   if(addPaper)actionBar88.append(addPaper);
   actionBar88.append(split);
   for(const el of [undo,redo,clear,fit,download,menu])if(el)actionBar88.append(el);
   if(menu){menu.classList.remove('writerText88e','writerIconText88');menu.title='菜单';menu.setAttribute('aria-label','菜单')}
 }
 // Reader background always follows the CURRENT ink, including manual ink changes.
 function syncReaderInk88(){
   const ink=A.getState?.()?.brush?.color||$('freeInk')?.value||'#563b34';
   if(!/^#[0-9a-f]{6}$/i.test(ink))return;
   document.documentElement.style.setProperty('--reader-bg88',ink);
   document.documentElement.style.setProperty('--reader-fg88',contrast(ink));
 }
 syncReaderInk88();
 document.addEventListener('quote-changed',()=>setTimeout(syncReaderInk88,0));
 document.addEventListener('input',e=>{if(['freeInk','quickInk','color'].includes(e.target?.id))setTimeout(syncReaderInk88,0)},true);
 document.addEventListener('change',e=>{if(['freeInk','quickInk','color','colorPair'].includes(e.target?.id))setTimeout(syncReaderInk88,0)},true);
 if(daily)new MutationObserver(()=>{if(daily.open){syncReaderInk88();recolorQuote88(window.currentQuote,'read')}}).observe(daily,{attributes:true,attributeFilter:['open']});

 // 9. Full-paper preview uses one fixed two-line watermark; all random opening copy stays hidden.
 const board=$('board'),fit88=$('fitView');
 let wm=$('previewWatermark88');
 if(board&&!wm){
   wm=document.createElement('div');wm.id='previewWatermark88';wm.innerHTML='<strong>单指双击，即刻书写</strong><small>见墨·iinnkk.me·如我</small>';wm.hidden=true;board.append(wm);
 }
 function syncPreviewWatermark88(){if(wm)wm.hidden=!A.isOverview55?.()}
 syncPreviewWatermark88();
 if(fit88)new MutationObserver(syncPreviewWatermark88).observe(fit88,{attributes:true,attributeFilter:['aria-label']});
 fit88?.addEventListener('click',()=>requestAnimationFrame(()=>requestAnimationFrame(syncPreviewWatermark88)));
 board?.addEventListener('pointerup',()=>setTimeout(syncPreviewWatermark88,40),{passive:true});

 document.documentElement.classList.add('v88-ready');
 window.Revision88={ready:true,palette:infinitePalette,applyPalette:applyInfinite};
})();

/* V88j — single day/night seal, source metadata cleanup, preview action bar and sticky brand polish. */
(function init88j(){
 if(!window.Revision88?.ready||!window.AnnotationApp?.ready||!window.DailyQuotes38){setTimeout(init88j,60);return}
 const $=id=>document.getElementById(id),A=AnnotationApp,D=DailyQuotes38,home=$('annotationHome');

 // One square replaces the old two-button light/dark pair. Existing buttons stay as hidden state engines.
 const theme=home?.querySelector('.homeTheme78.homeTheme88');
 if(theme&&!$('themeSwitch88j')){
   const river=[...theme.querySelectorAll('button')].find(b=>/浅色|河流/.test(b.textContent||''));
   const star=[...theme.querySelectorAll('button')].find(b=>/深色|星空/.test(b.textContent||''));
   for(const b of [river,star])if(b)b.classList.add('themeSource88j');
   const one=document.createElement('button');
   one.id='themeSwitch88j';one.type='button';
   one.innerHTML='<span aria-hidden="true">浅</span>';
   const sync=()=>{
     const dark=star?.getAttribute('aria-pressed')==='true';
     one.dataset.mode=dark?'dark':'light';
     one.querySelector('span').textContent=dark?'深':'浅';
     one.title=dark?'当前深色 · 阴刻；点击切换浅色':'当前浅色 · 阳刻；点击切换深色';
     one.setAttribute('aria-label',one.title);
   };
   one.onclick=()=>{const dark=one.dataset.mode==='dark';(dark?river:star)?.click();sync()};
   theme.prepend(one);
   new MutationObserver(sync).observe(theme,{attributes:true,subtree:true,attributeFilter:['aria-pressed']});
   sync();
 }

 // Remove the old house glyph. The nav already has the real seal canvas + title; animate only after hero disappears.
 $('homeTop86')?.remove();
 const navBrand=$('homeBrand79');
 if(navBrand){navBrand.classList.add('navSeal88j');navBrand.title='今日亲笔 · 回到顶部';navBrand.onclick=()=>home?.scrollTo({top:0,left:0,behavior:'smooth'})}

 // Correct country metadata before every category/source picker renders.
 const countries={
  '鲁迅':'中国','老舍':'中国','朱自清':'中国','钱钟书':'中国','张爱玲':'中国','史铁生':'中国','路遥':'中国','余华':'中国','陈忠实':'中国','刘震云':'中国','金庸':'中国','莫言':'中国','刘慈欣':'中国','苏轼':'中国',
  '吉卜林':'英国','罗素':'英国','石黑一雄':'英国','奈保尔':'英国','高尔斯华绥':'英国','艾略特':'英国','戈尔丁':'英国','品特':'英国',
  '莎士比亚':'英国','简·奥斯汀':'英国','夏洛蒂·勃朗特':'英国','艾米莉·勃朗特':'英国','狄更斯':'英国','伍尔夫':'英国','奥威尔':'英国','赫胥黎':'英国',
  '叶芝':'爱尔兰','萧伯纳':'爱尔兰','贝克特':'爱尔兰','希尼':'爱尔兰',
  '歌德':'德国','黑塞':'德国','托马斯·曼':'德国','君特·格拉斯':'德国','海泽':'德国','豪普特曼':'德国',
  '托尔斯泰':'俄罗斯','陀思妥耶夫斯基':'俄罗斯','普希金':'俄罗斯','高尔基':'俄罗斯','帕斯捷尔纳克':'俄罗斯','肖洛霍夫':'俄罗斯','索尔仁尼琴':'俄罗斯','布罗茨基':'俄罗斯',
  '罗曼·罗兰':'法国','加缪':'法国','萨特':'法国','纪德':'法国','莫迪亚诺':'法国','勒克莱齐奥':'法国','安妮·埃尔诺':'法国','圣琼·佩斯':'法国','普吕多姆':'法国','苏利·普吕多姆':'法国',
  '泰戈尔':'印度','川端康成':'日本','大江健三郎':'日本',
  '海明威':'美国','福克纳':'美国','斯坦贝克':'美国','辛克莱·刘易斯':'美国','奥尼尔':'美国','赛珍珠':'美国','鲍勃·迪伦':'美国','托妮·莫里森':'美国','塞林格':'美国','菲茨杰拉德':'美国','梭罗':'美国','阿西莫夫':'美国','赫伯特':'美国','勒古恩':'美国',
  '马尔克斯':'哥伦比亚','加西亚·马尔克斯':'哥伦比亚',
  '聂鲁达':'智利','米斯特拉尔':'智利',
  '辛波斯卡':'波兰','显克维奇':'波兰','米沃什':'波兰','托卡尔丘克':'波兰',
  '帕慕克':'土耳其','若泽·萨拉马戈':'葡萄牙','库切':'南非','纳丁·戈迪默':'南非',
  '博尔赫斯':'阿根廷','帕斯':'墨西哥','沃尔科特':'圣卢西亚','门罗':'加拿大','阿列克谢耶维奇':'白俄罗斯','赫塔·米勒':'德国','特朗斯特罗姆':'瑞典','拉格洛夫':'瑞典','拉格奎斯特':'瑞典',
  '皮兰德娄':'意大利','卡尔杜齐':'意大利','夸西莫多':'意大利','蒙塔莱':'意大利',
  '梅特林克':'比利时','辛格':'美国','伯尔':'德国','古尔纳':'英国','彼得·汉德克':'奥地利','耶利内克':'奥地利','纪伯伦':'黎巴嫩','卡夫卡':'奥地利','昆德拉':'法国','尼采':'德国','帕斯卡':'法国','卢梭':'法国','培根':'英国','塞万提斯':'西班牙','雨果':'法国','大仲马':'法国','圣埃克苏佩里':'法国','狄兰·托马斯':'英国'
 };
 const rows=D.all();
 let changed=false;
 const fixed=rows.map(q=>{
   const country=countries[q.author];
   if(country&&q.country!==country){changed=true;return {...q,country}}
   return q
 });
 if(changed)D.setAll(fixed);
 const label=q=>[q.country||q.era||q.dynasty||'',q.author||'',q.title||String(q.source||q.s||'').match(/《([^》]+)》/)?.[1]||''].filter(Boolean).join('·');
 document.addEventListener('quote-changed',e=>{
   const q=e.detail||window.currentQuote||{},txt=label(q);
   const src=$('quoteSource'),head=document.querySelector('.bookmarkSource79');
   if(src&&txt)src.textContent=txt;if(head&&txt)head.textContent=txt;
 },true);
 D.refresh?.();

 // Preview reset restores the paper/ink/seal state before the first random press, without touching handwriting.
 const actions=document.querySelector('#previewEffects55 .previewActions56'),random=$('previewRandom79');
 if(actions&&random&&!$('previewReset88j')){
   let before=null;
   random.addEventListener('pointerdown',()=>{
     if(before)return;
     const s=A.getState?.()||{},v=s.values||{};
     before={paper:v.papercolor||$('papercolor')?.value||'#f5f1e6',ink:s.brush?.color||$('freeInk')?.value||'#050505',seal:v.headColor||v.tailColor||'#b62118'};
   },true);
   const reset=document.createElement('button');reset.id='previewReset88j';reset.type='button';reset.textContent='重置';
   reset.onclick=e=>{e.preventDefault();e.stopPropagation();if(before){A.applyLiteraryPalette61?.(before);A.refresh?.();before=null}};
   random.after(reset);
   actions.classList.add('previewActions88j');
 }

 // Make the header the dedicated drag handle; content itself remains smooth vertical scroll.
 const dialog=$('dailyDialog'),headBar=dialog?.querySelector('.dialogHead');
 if(dialog&&headBar&&!headBar.dataset.drag88j){
   headBar.dataset.drag88j='1';let drag=null;
   headBar.addEventListener('pointerdown',e=>{
     if(e.button!==0||e.target.closest('button,select,a,input'))return;
     const r=dialog.getBoundingClientRect();drag={id:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top};
     headBar.setPointerCapture(e.pointerId);e.preventDefault();e.stopPropagation();
   },true);
   headBar.addEventListener('pointermove',e=>{
     if(!drag||e.pointerId!==drag.id)return;
     dialog.style.setProperty('left',Math.max(4,Math.min(innerWidth-dialog.offsetWidth-4,e.clientX-drag.dx))+'px','important');
     dialog.style.setProperty('top',Math.max(4,Math.min(innerHeight-dialog.offsetHeight-4,e.clientY-drag.dy))+'px','important');
   },true);
   const end=e=>{if(drag?.id===e.pointerId)drag=null};
   headBar.addEventListener('pointerup',end,true);headBar.addEventListener('pointercancel',end,true);
 }
 document.documentElement.classList.add('v88j-ready');
})();

/* V88k — unify writer modes, reader colour, sticky brand and deep/light slider. */
(function init88k(){
 if(!window.Revision88?.ready||!window.AnnotationApp?.ready){setTimeout(init88k,60);return}
 const $=id=>document.getElementById(id),A=AnnotationApp,home=$('annotationHome');
 if(!home)return;

 // Exact homepage editorial line requested for the hero intro.
 const intro=home.querySelector('.annotationIntro');
 if(intro){
   let strong=intro.querySelector('strong'),small=intro.querySelector('small');
   if(!strong){strong=document.createElement('strong');intro.prepend(strong)}
   if(!small){small=document.createElement('small');intro.append(small)}
   strong.textContent='人类群星闪耀时';
   small.textContent='在数字赛博空间，你我一起结网记字！';
 }

 // Replace the v88j square seal with one black/white segmented slider: 深 | 浅.
 const theme=home.querySelector('.homeTheme78.homeTheme88');
 if(theme){
   $('themeSwitch88j')?.remove();
   const river=[...theme.querySelectorAll('button')].find(b=>b.classList.contains('riverSeal88')||/浅色|河流/.test(b.textContent||''));
   const star=[...theme.querySelectorAll('button')].find(b=>b.classList.contains('starSeal88')||/深色|星空/.test(b.textContent||''));
   for(const b of [river,star])if(b)b.classList.add('themeSource88k');
   let slider=$('themeSwitch88k');
   if(!slider){
     slider=document.createElement('button');slider.id='themeSwitch88k';slider.type='button';
     slider.innerHTML='<span class="themeThumb88k" aria-hidden="true"></span><span class="themeDark88k">深</span><span class="themeLight88k">浅</span>';
     theme.prepend(slider);
   }
   const syncTheme=()=>{
     const dark=star?.getAttribute('aria-pressed')==='true';
     slider.dataset.mode=dark?'dark':'light';
     slider.title=dark?'当前深色 · 阴刻；点击切换浅色':'当前浅色 · 阳刻；点击切换深色';
     slider.setAttribute('aria-label',slider.title);
   };
   slider.onclick=()=>{const dark=slider.dataset.mode==='dark';(dark?river:star)?.click();syncTheme()};
   if(!theme.dataset.observe88k){
     theme.dataset.observe88k='1';
     new MutationObserver(syncTheme).observe(theme,{attributes:true,subtree:true,attributeFilter:['aria-pressed']});
   }
   syncTheme();
 }

 // Robust sticky brand visibility: only show after the large hero brand has actually left view.
 const navBrand=$('homeBrand79'),hero=home.querySelector('.annotationBrand h1')||home.querySelector('.annotationBrand');
 if(navBrand&&hero){
   navBrand.classList.add('navSeal88k');
   const syncSticky=()=>{
     const hr=hero.getBoundingClientRect(),rr=home.getBoundingClientRect();
     navBrand.classList.toggle('visible85',hr.bottom<=rr.top+3);
   };
   try{
     const io=new IntersectionObserver(entries=>navBrand.classList.toggle('visible85',!entries[0].isIntersecting),{root:home,threshold:.01});
     io.observe(hero);
   }catch{}
   home.addEventListener('scroll',syncSticky,{passive:true});addEventListener('resize',syncSticky,{passive:true});syncSticky();
 }

 // Every writing mode starts from the same true default head-seal anchor at the paper's upper-right edge.
 const resetHead=()=>{try{A.resetSealPosition?.('head')}catch{}};
 document.addEventListener('mode-changed54',()=>setTimeout(resetHead,40));
 document.addEventListener('writing-scenario47',()=>setTimeout(resetHead,60));

 // Split the old combined button into two permanent left-side controls.
 const bar=$('topActions'),sourceAdd=document.querySelector('#bigPaper62 button'),bigDialog=$('bigDialog62');
 if(bar&&sourceAdd&&bigDialog){
   $('topAddPaper88')?.remove();
   let addPaper=$('topAddPaper88k'),addChar=$('topAddChar88k');
   const openBig=which=>{
     sourceAdd.click();
     requestAnimationFrame(()=>{
       const nums=[...bigDialog.querySelectorAll('input[type="number"]')];
       const target=which==='char'?nums[0]:nums[1]||nums[0];
       target?.focus();target?.select?.();
     });
   };
   if(!addPaper){addPaper=document.createElement('button');addPaper.id='topAddPaper88k';addPaper.type='button';addPaper.onclick=()=>openBig('paper')}
   if(!addChar){addChar=document.createElement('button');addChar.id='topAddChar88k';addChar.type='button';addChar.onclick=()=>openBig('char')}
   for(const [b,label,symbol] of [[addPaper,'加纸','＋'],[addChar,'加字','字']]){
     b.className='writerIconText88 writerAdd88k';b.dataset.label=label;b.dataset.symbol=symbol;b.title=label;b.setAttribute('aria-label',label);
   }
   bar.prepend(addChar);bar.prepend(addPaper);
 }

 // Keep the common action set identical in every mode and give icon controls a two-character caption.
 const labels={undo:'撤销',redo:'返回',clear:'清屏',fitView:A.isOverview55?.()?'书写':'预览',export:'下载',menuToggle:'菜单'};
 for(const [id,label] of Object.entries(labels)){
   const b=$(id);if(!b)continue;b.dataset.label=label;b.title=label;b.setAttribute('aria-label',label);
   if(id==='menuToggle')b.classList.add('writerMenuText88k');
 }
 const fit=$('fitView');fit?.addEventListener('click',()=>setTimeout(()=>{fit.dataset.label=A.isOverview55?.()?'书写':'预览'},40));

 // Full reader is one continuous colour surface: no dark header ribbon or sectional fills.
 const reader=$('dailyDialog');
 if(reader){
   const unify=()=>{
     if(!reader.open)return;
     const ink=A.getState?.()?.brush?.color||$('freeInk')?.value||'#563b34';
     document.documentElement.style.setProperty('--reader-bg88',ink);
   };
   new MutationObserver(unify).observe(reader,{attributes:true,attributeFilter:['open']});
   document.addEventListener('quote-changed',unify);unify();
 }

 document.documentElement.classList.add('v88k-ready');
 window.Revision88k={ready:true,resetHead};
})();