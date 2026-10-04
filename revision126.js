(function init126(){
 if(!window.Revision125?.ready||!window.AnnotationApp?.expandPaper126){setTimeout(init126,60);return}
 const A=AnnotationApp,board=document.getElementById('board'),overlay=document.createElement('div');
 overlay.id='paperEdges126';overlay.setAttribute('aria-label','拖动纸边扩展纸张');board.append(overlay);
 const labels={left:'向左拓纸',right:'向右拓纸',top:'向上拓纸',bottom:'向下拓纸'},handles={};let drag=null;
 for(const edge of Object.keys(labels)){
  const button=document.createElement('button');button.type='button';button.className='paperEdge126 '+edge;button.setAttribute('aria-label',labels[edge]);button.title=labels[edge]+'，保持已写文字大小';button.innerHTML='<span aria-hidden="true">⋮</span>';overlay.append(button);handles[edge]=button;
  button.addEventListener('pointerdown',event=>{if(!A.isOverview55())return;event.preventDefault();event.stopPropagation();button.setPointerCapture(event.pointerId);drag={edge,id:event.pointerId,x:event.clientX,y:event.clientY,scale:A.paperFrame107().scale};button.classList.add('dragging')});
  button.addEventListener('pointermove',event=>{if(drag?.id!==event.pointerId||drag.edge!==edge)return;event.preventDefault();const px=edge==='left'?drag.x-event.clientX:edge==='right'?event.clientX-drag.x:edge==='top'?drag.y-event.clientY:event.clientY-drag.y;button.style.setProperty('--pulled',Math.max(0,px)+'px');button.dataset.amount=px>14?'＋'+(px/drag.scale).toFixed(2):''});
  const end=event=>{if(drag?.id!==event.pointerId||drag.edge!==edge)return;event.preventDefault();event.stopPropagation();const px=edge==='left'?drag.x-event.clientX:edge==='right'?event.clientX-drag.x:edge==='top'?drag.y-event.clientY:event.clientY-drag.y;const scale=drag.scale;drag=null;button.classList.remove('dragging');button.style.removeProperty('--pulled');delete button.dataset.amount;if(event.type==='pointerup'&&px>14){try{A.expandPaper126(edge,Math.min(100,px/scale))}catch(error){A.toast(error.message)}}position()};
  button.addEventListener('pointerup',end);button.addEventListener('pointercancel',end);
 }
 function position(){const visible=A.isOverview55()&&A.scene()==='none'&&!document.body.classList.contains('home-open');overlay.hidden=!visible;if(!visible)return;const p=A.paperFrame107();if(!p.scale)return;Object.assign(overlay.style,{left:p.x+'px',top:p.y+'px',width:p.w+'px',height:p.h+'px'});}
 for(const name of ['preview-painted94','ink-view-changed90'])document.addEventListener(name,position);window.addEventListener('resize',position);position();
 const original=Revision118.openRatio;Revision118.openRatio=function(){original();const d=document.getElementById('customRatio118');if(!d||d.querySelector('#expandControls126'))return;
  const group=document.createElement('fieldset');group.id='expandControls126';group.innerHTML='<legend>拓展当前纸张</legend><p>锁定另一边尺寸，原有文字大小和笔迹坐标保持不变。也可在预览中拖动纸边。</p><label>方向 <select name="edge126"><option value="right">向右 · 锁定高度</option><option value="left">向左 · 锁定高度</option><option value="bottom">向下 · 锁定宽度</option><option value="top">向上 · 锁定宽度</option></select></label><label>增加纸幅 <input name="amount126" type="number" min="0.01" max="100" step="0.1" value="1"></label><button type="button">拓展纸张</button>';
  d.append(group);group.querySelector('button').onclick=()=>{const edge=group.querySelector('select').value,amount=Number(group.querySelector('input').value);try{A.expandPaper126(edge,amount);d.close()}catch(error){A.toast(error.message)}};
 };
 window.Revision126={ready:true,position};
})();
