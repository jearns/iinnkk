/* V87 — final startup, title, city, bookmark ink sync. */
(function init87(){
 if(!window.Revision86?.ready||!window.AnnotationApp?.ready||!document.getElementById('annotationHome')){setTimeout(init87,45);return}
 const $=id=>document.getElementById(id),A=AnnotationApp;



 // Reset labels now match the destructive V87 reset behavior implemented in app.js.
 for(const id of ['resetSettings','topReset']){const el=$(id);if(el){const label='重置：笔径70 · 缩放100% · 斗方，并清空图片、临帖和全部当前内容';el.title=label;el.setAttribute('aria-label',label)}}

 // Bookmark background always follows the CURRENT template ink, even when ink changes without a quote change.
 function luminance(hex){const x=hex.replace('#','');if(x.length!==6)return 0;const r=parseInt(x.slice(0,2),16),g=parseInt(x.slice(2,4),16),b=parseInt(x.slice(4,6),16);return (.2126*r+.7152*g+.0722*b)/255}
 function syncBookmark(){
   const state=A.getState?.(),ink=state?.brush?.color||$('freeInk')?.value||'#563b34';
   if(!/^#[0-9a-f]{6}$/i.test(ink))return;
   document.documentElement.style.setProperty('--bookmark-bg87',ink);
   document.documentElement.style.setProperty('--bookmark-fg87',luminance(ink)>.56?'#181817':'#f8f4ea');
 }
 const dialog=$('dailyDialog');
 if(dialog)new MutationObserver(()=>{if(dialog.open)syncBookmark()}).observe(dialog,{attributes:true,attributeFilter:['open']});
 document.addEventListener('quote-changed',()=>setTimeout(syncBookmark,0));
 document.addEventListener('input',e=>{if(['freeInk','quickInk','color'].includes(e.target?.id))setTimeout(syncBookmark,0)},true);
 document.addEventListener('change',e=>{if(['freeInk','quickInk','color','colorPair','quickPaperColor'].includes(e.target?.id))setTimeout(syncBookmark,0)},true);
 syncBookmark();

 // Start automatic city detection once, but keep timezone fallback instant and non-blocking.
 // Location is requested only from the signed-in personal profile.

 // Remove only accidental duplicate/color-block menu placeholders; keep the real hamburger #menuToggle.
 document.querySelectorAll('.globalMenu85,.globalMenu86,.globalMenu87,.menuColorBlock,.writerColorBlock').forEach(e=>e.remove());

 // V87 is the only signal that the current homepage is ready to become visible.
 document.documentElement.classList.add('v87-ready','ui-ready','ui-ready67');
 window.Revision87={ready:true,syncBookmark};
})();
