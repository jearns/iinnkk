/* Writing takes precedence over browser context menus and touch text callouts. */
document.addEventListener('contextmenu',e=>e.preventDefault(),{capture:true});
document.addEventListener('selectstart',e=>{if(!e.target.closest('input,textarea,[contenteditable=true]'))e.preventDefault()},{capture:true});

(function restoreIdea102(){if(!window.Revision94?.ready){setTimeout(restoreIdea102,60);return}const state=AnnotationApp.getState(),credit=state.paletteCredit96;if(!credit||!/^墨纸相映\s*·/.test(credit.idea||''))return;const original=Palettes94.find(p=>p.name===credit.name);if(!original)return;const words={song:'素绫·暖灰',japanese:'浮裱·浅木',nordic:'深盒·白橡',paris:'细边·香槟',ru:'细缘·汝青',walnut:'悬浮·乌木',gallery:'错层·雪白'};AnnotationApp.setPaletteCredit96({...original,titleColor:credit.titleColor,idea:original.idea+' 装裱：'+(words[state.mountKey]||'素框·留白')});AnnotationApp.refresh()})();
