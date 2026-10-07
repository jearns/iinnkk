/* One compact writing panel and resizable text reference. */
(function init133(){
 if(!window.Reference129?.ready||!window.WritingRank117){setTimeout(init133,80);return}
 const A=AnnotationApp,$=id=>document.getElementById(id),panel=$('paperPen100'),E=(tag,cls)=>{const n=document.createElement(tag);if(cls)n.className=cls;return n};
 panel.classList.add('writingParameters133');panel.querySelector('header').firstChild.textContent='书写参数 ';panel.querySelectorAll(':scope>label').forEach(n=>n.remove());
 const toggle=E('label','assist133'),check=E('input');check.type='checkbox';toggle.append(check,document.createTextNode('线条优化'));panel.append(toggle);check.onchange=()=>{$('inkMode').value=check.checked?'assist':'raw';$('inkMode').dispatchEvent(new Event('change',{bubbles:true}));A.persist()};
 const fields=[];
 for(const [key,label,min,max,points,suffix]of [['style','综合书风',0,100,[0,25,50,75,100],''],['sizeNumber','笔径粗细',1,1000,[5,15,35,100,300],''],['zoom','纸面缩放',25,1000,[100,200,300,500,1000],'%']]){
  const row=E('label','parameter133'),name=E('span'),number=E('input'),range=E('input'),quick=E('div','parameterPoints133');name.textContent=label;number.type='number';number.min=range.min=min;number.max=range.max=max;number.step=range.step='1';number.inputMode='numeric';number.ariaLabel=label+'数值';range.type='range';range.ariaLabel=label;for(const n of [number,range]){n.dataset.slider100='yes';n.dataset.stepper63='yes';n.dataset.adjust103='yes';n.dataset.step103='yes'}
  if(key!=='style')row.dataset.source=key;
  const output=E('output');output.hidden=true;row.append(name,number,range,quick,output);panel.append(row);
  const value=()=>key==='style'?A.writingParameters133().style:Number($(key).value);
  const apply=n=>{n=Math.max(min,Math.min(max,Math.round(Number(n))));if(!Number.isFinite(n))return;if(key==='style'){const profile=ParticleBrush.lineProfile108(n);A.configure47({brushPatch:{...profile,lineStrength108:n}})}else{$(key).value=n;$(key).dispatchEvent(new Event(key==='sizeNumber'?'change':'input',{bubbles:true}))}number.value=range.value=n;output.textContent=n+suffix;syncStatus()};
  number.onchange=()=>apply(number.value);range.oninput=()=>apply(range.value);for(const n of points){const b=E('button');b.type='button';b.textContent=n+suffix;b.onclick=()=>apply(n);quick.append(b)}fields.push({number,range,output,value,suffix});
 }
 const icon=$('topSize');icon.dataset.caption90='纸笔';icon.title=icon.ariaLabel='书写参数';icon.querySelector('span').textContent='纸笔';$('topLines').hidden=true;$('topLines').setAttribute('aria-hidden','true');$('zoomQuick79').hidden=true;
 function sync(){check.checked=$('inkMode').value==='assist';for(const f of fields){f.number.value=f.range.value=f.value();f.output.textContent=f.value()+f.suffix}syncStatus()}
 const originalOpen=icon.onclick;icon.onclick=()=>{sync();originalOpen?.()};$('topLines').onclick=()=>icon.click();
 const hud=E('button','writingValues133');hud.type='button';hud.ariaLabel='调整书写参数';hud.onclick=()=>icon.click();$('board').append(hud);
 function syncStatus(){const s=A.writingParameters133(),text='书风'+s.style+'·笔径'+s.size+'·纸张'+s.zoom+'%';if(hud.textContent!==text)hud.textContent=text}
 for(const type of ['input','change','ink-stroke','mode-changed54','preview-painted94','copy-cell128'])document.addEventListener(type,syncStatus);new MutationObserver(syncStatus).observe(document.body,{attributes:true,attributeFilter:['class']});setInterval(()=>{if(!document.hidden&&!document.body.classList.contains('home-open'))syncStatus()},1200);sync();
 const reader=$('dailyDialog'),resize=E('button','readerResize133');resize.type='button';resize.dataset.readerResize133='true';resize.ariaLabel=resize.title='调整文摘浮窗尺寸';resize.innerHTML=TouchOrder129.icon('M8 20l12-12M14 20l6-6');reader.append(resize);let drag;
 resize.onpointerdown=e=>{e.preventDefault();e.stopPropagation();const r=reader.getBoundingClientRect();drag={id:e.pointerId,x:e.clientX,y:e.clientY,w:r.width,h:r.height};resize.setPointerCapture(e.pointerId);reader.dataset.resized133='true'};
 resize.onpointermove=e=>{if(drag?.id!==e.pointerId)return;e.preventDefault();e.stopPropagation();const w=Math.max(160,Math.min(innerWidth-12,drag.w+e.clientX-drag.x)),h=Math.max(150,Math.min(innerHeight-12,drag.h+e.clientY-drag.y));reader.style.setProperty('width',w+'px','important');reader.style.setProperty('height',h+'px','important')};resize.onpointerup=resize.onpointercancel=()=>drag=null;
 window.Revision133={ready:true,syncParameters:sync};
})();
