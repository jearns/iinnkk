/* Keep three additional user-designed seals in the preview, without save dialogs. */
(function initSeals129(){
 if(!window.AnnotationApp?.ready||!window.Revision111?.ready){setTimeout(initSeals129,80);return}
 const A=AnnotationApp,keys=['text','shape','layout','color','font','type','rough','fontScale'];let presets=[],timer=0;
 const signature=p=>JSON.stringify(keys.map(k=>p[k]??(k==='type'?'yang':null)));
 const builtin=p=>Revision111.presets.some(b=>['text','shape','layout','color','font','type'].every(k=>(b[k]??(k==='type'?'yang':null))===(p[k]??(k==='type'?'yang':null))));
 const refresh=()=>{const current=document.querySelector('#previewEffects55 [aria-current=true]');if(current?.textContent.trim()==='印章')Revision111.stampOptions129()};
 window.Seals129={get presets(){return presets}};
 DraftStore.get('seal-presets129').then(saved=>{if(Array.isArray(saved))presets=saved.filter(p=>p&&typeof p.text==='string').slice(-3);refresh()}).catch(()=>{});
 async function remember(config,key){if(!config?.text||builtin(config))return;const p={...config,key:key==='head'?'head':'tail',title:'自留 · '+config.text};if(presets.some(s=>signature(s)===signature(p)))return;presets=[...presets,p].slice(-3);await DraftStore.set('seal-presets129',presets);refresh()}
 document.addEventListener('seal-custom129',e=>remember(e.detail.config,e.detail.key).catch(console.warn));
 document.addEventListener('seal-config129',()=>{if(!A.selectedSealKey()&&!document.querySelector('#sealDialog[open],#extraSealDialog[open]'))return;clearTimeout(timer);timer=setTimeout(()=>{const key=A.selectedSealKey(),items=A.sealItems();Promise.all(items.filter(i=>key?i.key===key:true).map(i=>remember(i.config,i.key))).catch(console.warn)},250)});
})();
