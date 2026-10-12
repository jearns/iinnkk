(function(root){
 function render(host,row){const A=AnnotationApp,C=CopyAlbums38;if(C.paused129||!C.active)return;let config=A.getCopyFloat181();const button=(host,text,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;host.append(b);return b},b=button(row,'一键悬浮',()=>{config.enabled=!config.enabled;panel.hidden=!config.enabled;b.setAttribute('aria-pressed',String(config.enabled));apply()});row.prepend(b);b.className='referenceButton129';b.setAttribute('aria-pressed',String(config.enabled));const panel=document.createElement('section');panel.className='copyFloatControls181';panel.hidden=!config.enabled;host.append(panel);
 function apply(){A.setCopyFloat181(config);C.applyFloat181(config,false).catch(e=>A.toast(e.message))}
 const directions=[];for(const [name,sign]of [['左上悬浮',-1],['右上悬浮',1]]){const option=button(panel,name,()=>{config.x=sign*Math.max(.1,Math.abs(config.x));config.y=-Math.abs(config.y);side();apply()});option.className='floatDirection182';directions.push([option,sign])}function side(){for(const [option,sign]of directions)option.setAttribute('aria-pressed',String(Math.sign(config.x)===sign))}side();
 const input=document.createElement('input');input.type='range';input.dataset.stepper63='yes';input.dataset.step103='yes';input.dataset.slider100='yes';input.min=0;input.max=100;config.opacity=window.Reference131?.config133?.opacity??config.opacity;input.value=100-config.opacity;input.ariaLabel='原帖透明度';input.oninput=()=>{config.opacity=100-Number(input.value);A.setCopyFloat181(config)};input.onchange=apply;panel.append(input);GlassControl186.mount(input,'原帖透明度','◐',{horizontal:true});

 }root.CopyFloat181={render};
})(typeof window==='undefined'?globalThis:window);

