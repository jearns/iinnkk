/* Release 72: streamline the quote bar and seal editor without replacing existing data. */
(function init(){if(!window.AnnotationApp?.ready||!document.getElementById('previewEffects55')||!document.getElementById('sealInspector')){setTimeout(init,40);return}
const $=id=>document.getElementById(id);
// The calendar remains available in settings and its toolbar icon; the reading bar stays touch-safe.
if($('momentReminder'))$('momentReminder').hidden=true;
const reading=$('dailyDialog');reading.querySelector('h2').textContent='全文参照';$('readQuote').setAttribute('aria-label','阅读作品全文');
const inspector=$('sealInspector'),suggestions=document.createElement('select');suggestions.id='sealSuggestions72';suggestions.setAttribute('aria-label','选用常见印文');for(const name of ['常用印文','亲笔书写','见墨如我','今日亲笔','亲笔手书','日有寸进','学无止境','落纸云烟','一片冰心','岁月留痕'])suggestions.add(new Option(name,name==='常用印文'?'':name));const label=document.createElement('label');label.textContent='选印文';label.append(suggestions);inspector.querySelector('label')?.after(label);suggestions.onchange=()=>{if(!suggestions.value)return;const field=$('selectedSealText');field.value=suggestions.value;field.dispatchEvent(new Event('change',{bubbles:true}))};
// Preserve an artist's customized seals. Upgrade only old defaults, then make reset consistent.
for(const [id,legacy,newValue] of [['headText',['亲笔手书','亲笔书写'],'今日亲笔'],['tailText',['手书真迹','留下真迹'],'见墨如我']]){const field=$(id);if(legacy.includes(field?.value))field.value=newValue}
if(['今日亲笔','亲笔手书','亲笔书写'].includes($('headText')?.value)&&!localStorage.getItem('iinnkk.headDefault101')){for(const [id,value]of Object.entries({headText:'今日亲笔',headFont:'yishan',headType:'yang',headShape:'tall',headLayout:'horizontal'}))$(id).value=value;localStorage.setItem('iinnkk.headDefault101','1')}
$('headText')?.dispatchEvent(new Event('change',{bubbles:true}));DraftStore.get('zhenji.settings.v1').then(saved=>{if(!saved?.values)return;let updated=false;if(['亲笔手书','亲笔书写'].includes(saved.values.headText)){saved.values.headText='今日亲笔';updated=true}if(['手书真迹','留下真迹'].includes(saved.values.tailText)){saved.values.tailText='见墨如我';updated=true}if(updated)DraftStore.set('zhenji.settings.v1',saved).catch(()=>{})}).catch(()=>{});
// The existing photo interaction already allows handwriting directly on the image.
for(const id of ['writeOnPhoto','photoWrite','finishPhoto','resetPhoto'])$(id)?.setAttribute('hidden','');
})();
