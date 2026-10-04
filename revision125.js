(function init125(){
 if(!window.Revision119?.ready||!window.AnnotationApp?.ready){setTimeout(init125,60);return}
 const A=window.AnnotationApp,button=document.createElement('button');button.id='extendWidth125';button.type='button';button.className='tool90';button.title='条幅加宽：向左增加列数，现有笔迹保持原大小';button.setAttribute('aria-label','条幅加宽');
 button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 4v16M19 4v16M4 12h11m-4-4 4 4-4 4"/></svg><span>加宽</span>';
 const dialog=document.createElement('dialog');dialog.id='extendDialog125';dialog.innerHTML='<header class="dialogHead"><h2>条幅加宽</h2><button type="button" data-cancel>关闭 ×</button></header><div class="dialogBody"><p>向左增加空白列，现有文字保持大小和屏幕位置；条幅高度不变。</p><label>增加列数 <input type="number" min="1" max="100" step="1" value="1" inputmode="numeric"></label><p id="extendMeasure125"></p><button type="button" data-apply>向左加宽</button></div>';
 document.body.append(dialog);const input=dialog.querySelector('input'),measure=dialog.querySelector('#extendMeasure125');
 function show(){const s=A.getState(),b=s.values.paperExtent==='infinite'?s.infiniteExtent:{w:4,h:4/(+s.values.ratio||.75)};measure.textContent='当前宽 '+b.w.toFixed(2)+' · 高 '+b.h.toFixed(2)+'，原有 '+s.flow.strokes.length+' 笔';dialog.showModal();input.focus()}
 button.onclick=show;dialog.querySelector('[data-cancel]').onclick=()=>dialog.close();dialog.querySelector('[data-apply]').onclick=()=>{try{const count=Number(input.value);if(!Number.isInteger(count)||count<1||count>100)throw Error('请输入 1—100 列');A.extendWidth125(count);dialog.close()}catch(error){measure.textContent=error.message}};
 document.getElementById('topAddPaper90')?.after(button);
 const paper=document.querySelector('#paperDialog .dialogBody');if(paper){const link=document.createElement('button');link.type='button';link.textContent='条幅写不下？向左加宽';link.onclick=show;paper.append(link)}
 window.Revision125={ready:true};
})();
