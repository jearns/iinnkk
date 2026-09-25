(function init(){if(!window.AnnotationApp?.ready||!document.getElementById('fitView')){setTimeout(init,40);return}
const board=document.getElementById('board'),fit=document.getElementById('fitView');const bar=document.createElement('div');bar.id='moonPreviewActions57';bar.hidden=true;bar.innerHTML='<button type="button" id="returnWriting57">↶ 返回书写</button><button type="button" id="generateArtwork57">生成下载 ↓</button>';board.append(bar);
bar.querySelector('#returnWriting57').onclick=()=>fit.click();bar.querySelector('#generateArtwork57').onclick=()=>document.getElementById('export').click();
function sync(){bar.hidden=!fit.getAttribute('aria-label')?.includes('返回')||document.body.classList.contains('home-open')}
new MutationObserver(sync).observe(fit,{attributes:true,attributeFilter:['aria-label']});new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});sync();
})();
