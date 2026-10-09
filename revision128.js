/* V128: idle saving and one shared reference page order. */
(function init128(){
 if(!window.AnnotationApp?.ready||!window.CopyAlbums38||!window.Revision118?.ready){setTimeout(init128,80);return}
 const A=AnnotationApp,$=id=>document.getElementById(id),C=CopyAlbums38;
 let timer=0,saving=false,dirty=false,lastSaved=0,lastCloudSaved=0,cloudSaving=false;
 function queueAutosave(){dirty=true;clearTimeout(timer);timer=setTimeout(flush,Math.max(5000,8000-(Date.now()-lastSaved)))}
 function syncCloud(record){if(!record)return;const queue=window.OfflineSync101;if(queue){queue.enqueue(record,undefined,true).catch(e=>console.warn('Local sync queue pending',e));return}if(cloudSaving||!navigator.onLine||!window.InkCloud75?.user||Date.now()-lastCloudSaved<30000)return;cloudSaving=true;Promise.resolve().then(()=>InkCloud75.saveNow101(record,undefined,true)).then(ok=>{if(ok)lastCloudSaved=Date.now()}).catch(e=>{console.warn('Cloud autosave pending',e);dirty=true}).finally(()=>{cloudSaving=false})}
 async function flush(){if(!dirty)return;if(saving||A.isDrawing128()||document.querySelector('#imageDialog[open]')){timer=setTimeout(flush,1500);return}saving=true;dirty=false;try{const record=await A.autosave128();syncCloud(record);lastSaved=Date.now()}catch(e){dirty=true;console.warn('Autosave deferred',e);timer=setTimeout(flush,5000)}finally{saving=false}}
 document.addEventListener('ink-stroke',queueAutosave);document.addEventListener('visibilitychange',()=>{if(document.hidden)flush()});
 document.addEventListener('contextmenu',e=>{if(e.target.closest('#copyDock111,#copyPages38,#copyAlbumViewer38,.timelineArrow73,.copyReference128,.referenceThumbs128'))e.preventDefault()},true);
 window.Revision128={ready:true,queueAutosave,flush,saveOnSwitch129:async()=>{if(window.SharedInk128?.active149){A.finish();await SharedInk128.persist149();return null}A.finish();clearTimeout(timer);while(saving)await new Promise(r=>setTimeout(r,20));saving=true;dirty=false;try{const record=await A.autosave128();await C.saveCurrent?.();syncCloud(record);return record}finally{saving=false;lastSaved=Date.now()}}};
})();
