(function init(){if(!window.AnnotationApp?.ready||!document.getElementById('previewReset73')){setTimeout(init,70);return}
 const effects=document.getElementById('previewEffects55'),steps=effects.querySelector('.finalSteps54'),actions=effects.querySelector('.previewActions56');
 const row=document.createElement('div');row.className='previewHeader75';steps.before(row);row.append(steps,actions);
 const sync=()=>{if(!effects.hidden)requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')))};
 new MutationObserver(sync).observe(effects,{attributes:true,attributeFilter:['hidden']});
})();

/* The long vertical timeline always offers a route back to its navigation. */
(function(){const home=document.getElementById('annotationHome');if(!home)return;const top=document.createElement('button');top.id='homeTop76';top.type='button';top.textContent='↑ 返回导航';top.setAttribute('aria-label','返回首页顶部导航');top.onclick=()=>{home.style.scrollSnapType='none';home.scrollTop=0;home.scrollTo({top:0,behavior:'instant'});};home.append(top);document.addEventListener('click',e=>{if(e.target.closest('#annotationHomeButton'))requestAnimationFrame(()=>home.scrollTo({top:0,behavior:'instant'}))},true)})();
