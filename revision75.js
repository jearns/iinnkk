(function init(){if(!window.AnnotationApp?.ready||!document.getElementById('previewReset73')){setTimeout(init,70);return}
 const effects=document.getElementById('previewEffects55'),steps=effects.querySelector('.finalSteps54'),actions=effects.querySelector('.previewActions56');
 const row=document.createElement('div');row.className='previewHeader75';steps.before(row);row.append(steps,actions);
 const sync=()=>{if(!effects.hidden)requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')))};
 new MutationObserver(sync).observe(effects,{attributes:true,attributeFilter:['hidden']});
})();
