(function init(){if(!window.Revision42?.ready){setTimeout(init,30);return}const $=id=>document.getElementById(id);
const top=['annotationHomeButton','myWorks','selectInk','undo','redo','clear','fitView','topQuotes','recordProcess'];
const bottom=['menuToggle','topSize','export','topOptimize','copyPagesQuick39','photoSettingsQuick42','topLines','topInk','inkScope39','calendarMoments','topReset','lockWriting39','styleCycle39','topDirection','topAuto','topMusic','topStart'];
const extra=['topRemove','topGuide'];for(const id of ['topUpload','topPattern','topRatio','topMount']){$(id).hidden=true;$('paperQuickRow').append($(id))}
for(const id of extra)$('paperQuickRow').append($(id));
const orderRow=(row,defaults,order)=>{for(const id of [...new Set([...(Array.isArray(order)?order:[]),...defaults])])if(defaults.includes(id)){$(id).hidden=false;row.append($(id))}};
window.toolbarOrder=()=>({version:45,top:[...$('topActions').children].map(b=>b.id).filter(id=>top.includes(id)),bottom:[...$('bottomIcons39').children].map(b=>b.id).filter(id=>bottom.includes(id))});
window.restoreToolbarOrder=order=>{orderRow($('topActions'),top,order?.version===45?order.top:[]);orderRow($('bottomIcons39'),bottom,[43,45].includes(order?.version)?order.bottom:[])};
restoreToolbarOrder(window.pendingToolbarOrder43);installToolbarDrag43($('bottomIcons39'));
$('redo').title='返回 · 恢复上一操作';$('redo').setAttribute('aria-label','返回');
$('myWorks').innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h6l2 3h10v12H3zM5 6V3h13v6M7 14h10M7 17h6"/></svg>';
if(['留下真迹','见字如我'].includes($('tailText').value))AnnotationApp.editSeal('tail',{config:{text:'见墨如我'}});window.Revision43={ready:true};window.Revision44={ready:true};window.Revision45={ready:true};window.Revision46={ready:true};document.documentElement.classList.add('ui-ready');})();
