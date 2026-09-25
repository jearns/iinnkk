(function init(){if(!window.Revision47?.ready||!window.DailyQuotes38||!window.AnnotationHome){setTimeout(init,30);return}
const $=id=>document.getElementById(id);
function showMoon(){const visibility=$('quotesVisibility');visibility.value='shown';visibility.dispatchEvent(new Event('change'));document.body.classList.remove('quotes-hidden');window.selectMoon56?.()}
showMoon();document.addEventListener('writing-scenario47',showMoon);$('continueWriting').addEventListener('click',showMoon,{capture:true});
const dialog=document.createElement('dialog');dialog.id='moonRankingDialog56';dialog.innerHTML='<div class="dialogHead"><h2>中秋 50 选</h2><button type="button" id="closeMoonRanking56">完成 ×</button></div><div class="dialogBody"><p>从中秋名篇延伸至古今中外的月亮作品，按影响力与流传度策展。点选一句即可成为书写提醒。</p><ol id="moonRankingList56"></ol></div>';document.body.append(dialog);
const list=$('moonRankingList56');for(const q of window.Moon50||[]){const li=document.createElement('li'),button=document.createElement('button'),line=document.createElement('strong'),source=document.createElement('small');line.textContent=q.rank+'. '+(q.preview||q.q);source.textContent=q.s;button.append(line,source);button.onclick=()=>{window.selectMoonEntry56?.(q.id);dialog.close();$('readQuote').click()};li.append(button);list.append(li)}
$('moonRanking56').onclick=()=>{dialog.showModal();$('quoteMenu').hidden=true;$('nextQuote').setAttribute('aria-expanded','false')};$('closeMoonRanking56').onclick=()=>dialog.close();
})();
