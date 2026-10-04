(function previewPaperExperiment(){
 if(!window.Revision119?.ready||!window.AnnotationApp?.paperFrame107){setTimeout(previewPaperExperiment,80);return}
 const A=AnnotationApp,board=document.getElementById('board');const layer=document.createElement('div');layer.id='previewEdges120';layer.hidden=true;board.append(layer);
 const names={left:'向左扩纸',right:'向右扩纸',top:'向上扩纸',bottom:'向下扩纸'};let drag=null,busy=false,enabled=false;
 function place(){const visible=enabled&&A.isOverview55()&&A.scene()==='none'&&!document.body.classList.contains('home-open');layer.hidden=!visible;if(!visible)return;const p=A.paperFrame107();if(p.scale)Object.assign(layer.style,{left:p.x+'px',top:p.y+'px',width:p.w+'px',height:p.h+'px'})}
 async function expand(edge,amount){if(busy)return;busy=true;try{if(!A.expandPaperEdge(edge,amount))throw Error('请先结束当前书写');A.toast('已向'+({left:'左',right:'右',top:'上',bottom:'下'}[edge])+'扩纸；可连续撤销恢复');place()}catch(error){A.toast('扩纸未完成：'+error.message)}finally{busy=false}}
 for(const edge of Object.keys(names)){const button=document.createElement('button');button.type='button';button.className='previewEdge120 '+edge;button.setAttribute('aria-label',names[edge]);button.title=names[edge]+' · 按住向外拉';button.textContent={left:'←',right:'→',top:'↑',bottom:'↓'}[edge];layer.append(button);
  button.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();button.setPointerCapture(e.pointerId);drag={id:e.pointerId,edge,x:e.clientX,y:e.clientY,scale:A.paperFrame107().scale}});
  button.addEventListener('pointermove',e=>{if(drag?.id!==e.pointerId||drag.edge!==edge)return;e.preventDefault();const n=edge==='left'?drag.x-e.clientX:edge==='right'?e.clientX-drag.x:edge==='top'?drag.y-e.clientY:e.clientY-drag.y;button.dataset.grow=n>12?'＋'+(n/drag.scale).toFixed(2):''});
  const release=e=>{if(drag?.id!==e.pointerId||drag.edge!==edge)return;e.preventDefault();e.stopPropagation();const n=edge==='left'?drag.x-e.clientX:edge==='right'?e.clientX-drag.x:edge==='top'?drag.y-e.clientY:e.clientY-drag.y,scale=drag.scale;drag=null;delete button.dataset.grow;if(e.type==='pointerup'&&n>12)expand(edge,Math.min(50,n/scale))};button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);
 }
 const panel=document.getElementById('bigDialog62')?.querySelector('.dialogBody')||document.getElementById('bigDialog62');if(panel){const toggle=document.createElement('label');toggle.className='paperEdgeToggle120';toggle.innerHTML='<input type="checkbox" id="paperEdgeEnabled120"> 四向扩纸 <small>预览时从纸边向外拖动；可连续撤销</small>';panel.prepend(toggle);toggle.querySelector('input').onchange=e=>{enabled=e.target.checked;place()}}
 const top=document.getElementById('topAddPaper90');if(top){top.title='扩纸';top.setAttribute('aria-label','扩纸')}
 document.addEventListener('preview-painted94',place);document.addEventListener('ink-view-changed90',place);window.addEventListener('resize',place);place();
 const sample=document.createElement('button');sample.type='button';sample.id='thousandSample120';sample.className='tool90';sample.textContent='千字样本';sample.title='生成 1000 个字位、2000 笔的测试草稿，替换当前未保存草稿';document.getElementById('topAddPaper90')?.after(sample);
 sample.onclick=async()=>{if(!confirm('载入千字压力样本会替换当前未保存草稿。已保存的作品不会删除。继续？'))return;sample.disabled=true;try{
  const draft=A.getState(),strokes=[],width=4,height=45,cols=10,rows=100;
  for(let i=0;i<1000;i++){const col=cols-1-i%cols,row=Math.floor(i/cols),x=.28+col*.35,y=.28+row*.44,seed=i*2;
   for(const [j,points] of [[0,[[x+.07,y+.06],[x+.23,y+.32]]],[1,[[x+.25,y+.08],[x+.06,y+.3]]]])strokes.push({points:points.map(([px,py],k)=>({x:px,y:py,t:k*18,pressure:.5})),settings:{...draft.brush,size:20},seed:seed+j,done:true,inkMode:'raw'})}
  const next={...draft,flow:{strokes},signatureStrokes:[],values:{...draft.values,paperExtent:'infinite',ratio:String(width/height),columns:String(cols),rows:String(rows),zoom:'400',guideMode:'off',sceneChoice:'none'},infiniteExtent:{w:width,h:height},camera:{x:2.5,y:0},writingView110:{camera:{x:2.5,y:0},focused:true},editingWork110:null};
  await A.restoreDraft(next);A.showWriter();A.persist();A.toast('已载入 1000 字位 / 2000 笔；可试缩放、变色与预览拖边')
 }catch(error){A.toast('样本未能载入：'+error.message)}finally{sample.disabled=false}};
 window.PreviewPaper120={expand,place};
})();
