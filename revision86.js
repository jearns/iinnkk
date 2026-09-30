/* V86 — navigation, preview random, toolbar refinements. */
(function init86(){
 if(!window.Revision85?.ready||!window.AnnotationApp?.ready||!document.getElementById('homeQuick47')){setTimeout(init86,50);return}
 const $=id=>document.getElementById(id),A=AnnotationApp,nav=$('homeQuick47'),home=$('annotationHome');

 // Artistic home icon at the far left of the fixed nav.
 let house=$('homeTop86');
 if(!house){
   house=document.createElement('button');house.id='homeTop86';house.type='button';house.title='回到主页顶部';house.setAttribute('aria-label','回到主页顶部');
   house.innerHTML='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 32C17 26 23 18 32 12c9 6 15 14 24 20" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><path d="M17 29v21c0 3 2 5 5 5h20c3 0 5-2 5-5V29" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><path d="M26 55V40c0-3 2-5 5-5h2c3 0 5 2 5 5v15" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><path d="M13 28c7-3 11-9 17-14" fill="none" stroke="currentColor" stroke-width="1.3" opacity=".55"/></svg>';
   house.onclick=()=>home?.scrollTo({top:0,left:0,behavior:'smooth'});nav.prepend(house);
 }

 // Keep the real hamburger as the right-most writer control; never add a text “书写” label.
 document.querySelectorAll('.writerLabel85,.writerText86').forEach(e=>e.remove());
 const quick=$('writingQuick73'),menu=$('menuToggle'),group=$('writerFixed85');
 if(quick?.parentElement){
   if(group)quick.parentElement.insertBefore(group,quick);
   if(menu){menu.classList.add('writerMenu86');quick.parentElement.insertBefore(menu,quick.nextSibling)}
 }

 // Preview random changes only paper / ink / seal. It must not bubble to fitView or show “查看整张纸”.
 const random=$('previewRandom79');
 if(random){
   random.addEventListener('click',e=>{
     e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
     const p=Revision85.palette(Date.now()+'|'+Math.random()+'|preview');Revision85.applyPalette(p);
     const hint=$('iconHint');if(hint){hint.hidden=true;try{hint.hidePopover?.()}catch{}}
     const toast=$('toast');if(toast&&/查看整张纸/.test(toast.textContent||''))toast.style.display='none';
   },true);
 }
 window.Revision86={ready:true};
})();