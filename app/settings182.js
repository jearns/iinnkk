(function settings182(){if(!window.ExportStudio181?.ready){setTimeout(settings182,60);return}
 const A=AnnotationApp,steps=document.querySelector('#previewEffects55 .finalSteps54');
 // Category notes never carry over; choosing a category leaves descriptions collapsed.
 const panel=document.getElementById('previewEffects55');function syncPreview182(){const hide=!A.isOverview55()||document.body.classList.contains('home-open');if(panel.hidden!==hide)panel.hidden=hide}document.addEventListener('ink-view-changed90',syncPreview182);syncPreview182();
 let timer=0,interval=0,pressed=null,repeated=false,internal=false;
 function clear(){clearTimeout(timer);clearInterval(interval);timer=interval=0;pressed=null}
 function adjustButton(target){const b=target.closest('button');if(!b||b.disabled)return null;const text=b.textContent.trim(),label=b.getAttribute('aria-label')||'';return /^[+−–-]$/.test(text)||/^(增加|减少)/.test(label)?b:null}
 document.addEventListener('pointerdown',e=>{const b=adjustButton(e.target);if(!b)return;clear();pressed=b;repeated=false;timer=setTimeout(()=>{repeated=true;let ticks=0;function tick(){if(!b.isConnected||b.disabled){clear();return}internal=true;try{b.click()}finally{internal=false}ticks++;if(ticks===12){clearInterval(interval);interval=setInterval(tick,45)}}tick();interval=setInterval(tick,90)},350)},true);
 document.addEventListener('click',e=>{if(!internal&&repeated&&adjustButton(e.target)){e.preventDefault();e.stopImmediatePropagation();repeated=false}},true);
 for(const type of ['pointerup','pointercancel'])document.addEventListener(type,clear,true);window.addEventListener('blur',()=>{clear();repeated=false});document.addEventListener('visibilitychange',()=>{if(document.hidden){clear();repeated=false}});
 window.Settings182={ready:true};
})();
