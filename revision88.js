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
 const introSmall=intro?.querySelector('small');
 if(introSmall)introSmall.textContent='在数字的赛博空间，你我一起来结网记字！';
 function alignBrandSubtitle88(){
   const box=home.querySelector('.annotationBrand>div'),title=box?.querySelector('h1'),sub=box?.querySelector('p');
   if(!title||!sub)return;
   sub.textContent='见墨·iinnkk.me·如我';
   sub.style.letterSpacing='0px';
   sub.style.width='auto';
   const target=title.getBoundingClientRect().width;
   const cs=getComputedStyle(sub),canvas=alignBrandSubtitle88.canvas||(alignBrandSubtitle88.canvas=document.createElement('canvas')),ctx=canvas.getContext('2d');
   ctx.font=cs.font;
   const chars=Array.from(sub.textContent),base=ctx.measureText(sub.textContent).width;
   const spacing=chars.length>1?Math.max(0,Math.min(7,(target-base)/(chars.length-1))):0;
   sub.style.width=target+'px';
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
 }
 // Override public palette API so V86 preview-random uses the infinite generator.
 if(window.Revision85){Revision85.palette=infinitePalette;Revision85.applyPalette=applyInfinite}
 document.addEventListener('quote-changed',e=>{const q=e.detail||{};applyInfinite(infinitePalette((q.id||'')+'|'+(q.q||'')+'|'+(q.author||'')+'|'+performance.now()))});
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
     backBtn.title='返回首页';
     backBtn.setAttribute('aria-label','返回首页');
     backBtn.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 8 12l7 7"/><path d="M8 12h11"/></svg>';
     backBtn.onclick=()=>window.AnnotationHome?.show?.();
   }
   const fit=$('fitView'),clear=$('clear'),undo=$('undo'),menu=$('menuToggle');
   for(const el of [guideBtn,fit,clear,undo,backBtn,menu])if(el)actionBar.append(el);
   // Redo remains available in the full toolbar, but not in the right-most core strip.
   const redo=$('redo');if(redo&&redo.nextElementSibling===menu)actionBar.insertBefore(redo,guideBtn);
 }

 document.documentElement.classList.add('v88-ready');
 window.Revision88={ready:true,palette:infinitePalette,applyPalette:applyInfinite};
})();