(function initFeatures106(){
 if(!window.Revision104?.ready||!window.Revision100?.ready){setTimeout(initFeatures106,60);return}
 const $=id=>document.getElementById(id),A=AnnotationApp;
 const layouts=[['上图下文','split'],['左图右文','left'],['右图左文','right'],['整图铺满','background'],['多图配文','hero2'],['无图模式','none'],['明信片','postcard'],['视频号封面','videoCover']];
 for(const id of ['photoMode','quickPhotoMode']){const select=$(id),old=select.value;select.replaceChildren(...layouts.map(([name,value])=>new Option(name,value)));select.value=layouts.some(x=>x[1]===old)?old:'split'}
 const panel=Revision62.photoPanel,file=panel.querySelector('input[type=file]');file.hidden=true;
 const choices=document.createElement('div');choices.className='photoChoices106';
 const upload=document.createElement('button');upload.type='button';upload.textContent='添加图片';upload.onclick=()=>file.click();
 for(const [name,value]of layouts){const b=document.createElement('button');b.type='button';b.textContent=name;b.setAttribute('aria-pressed',String($('photoMode').value===value));b.onclick=()=>{$('quickPhotoMode').value=value;$('quickPhotoMode').dispatchEvent(new Event('change',{bubbles:true}));for(const other of choices.children)other.setAttribute('aria-pressed',String(other===b));A.refresh()};choices.append(b)}
 choices.append(upload);panel.replaceChildren(file,choices);$('photoInside73')?.remove();Revision62.photoStep.onclick=()=>{const effects=$('previewEffects55');for(const b of effects.querySelectorAll('.finalSteps54 button'))b.setAttribute('aria-current',String(b===Revision62.photoStep));effects.querySelector('.finalRail54').replaceChildren(panel);effects.classList.add('photoActive63')};
 for(const arrow of document.querySelectorAll('.foldArrow97'))arrow.style.setProperty('display','none','important');
 // Mode selection remains outside the collapsible toolbars.
 const modes=$('writerModes53');$('board').after(modes);modes.dataset.persistent106='yes';
 const workspace=$('board').parentElement;let layoutFrame=0;
 function modeLayout(){layoutFrame=0;const home=document.body.classList.contains('home-open');if(home)return;const effects=$('previewEffects55'),dock=$('bottomDock'),configShown=A.isOverview55()&&getComputedStyle(effects).display!=='none',controls=configShown?effects.getBoundingClientRect().height:getComputedStyle(dock).display!=='none'?dock.getBoundingClientRect().height:0;const offset=Math.ceil(controls)+'px';if(workspace.style.getPropertyValue('--controls106')!==offset){workspace.style.setProperty('--controls106',offset);requestAnimationFrame(()=>A.refresh())}}
 const scheduleLayout=()=>{if(!layoutFrame)layoutFrame=requestAnimationFrame(modeLayout)};
 new ResizeObserver(scheduleLayout).observe($('previewEffects55'));new ResizeObserver(scheduleLayout).observe($('bottomDock'));new MutationObserver(scheduleLayout).observe(document.body,{attributes:true,attributeFilter:['class']});document.addEventListener('preview-painted94',scheduleLayout);addEventListener('resize',scheduleLayout);scheduleLayout();

 // Restore choosing a model before starting; retain the original multi-image import pipeline.
 document.addEventListener('click',e=>{const b=e.target.closest('#homeQuick47 button,#writerModes53 button');if(b?.textContent.trim()!=='临帖')return;e.preventDefault();e.stopImmediatePropagation();A.openDialog('copyDialog')},true);
 $('copyDialog').querySelector('h2').textContent='选择临帖作品';$('upload').multiple=true;
 const library=document.createElement('div');library.className='copyLibrary106';
 const renderLibrary=()=>{library.replaceChildren();const items=[...Revision62.getPresets().map(p=>({title:p.title,open:()=>CopyAlbums38.openPages55(p)})),...(window.Timeline73?.chapters||[]).filter(c=>!c.fresh&&!c.line&&c.id!=='today').map(c=>({title:c.title,open:()=>Timeline73.openCopy(c)}))];for(const item of items){const b=document.createElement('button');b.type='button';b.textContent=item.title;b.onclick=async()=>{try{await item.open();A.showWriter();$('copyDialog').close();for(const part of ['top','bottom'])Revision97.setPart(part,false)}catch(err){A.toast(err.message||'原帖暂未加载，可上传自己的作品')}};library.append(b)}};
 $('copyDialog').querySelector('.dialogBody').prepend(library);renderLibrary();$('copyDialog').addEventListener('toggle',renderLibrary);

 const originalUpload=$('upload').onchange;$('upload').onchange=async e=>{A.showWriter();await originalUpload?.call($('upload'),e);$('copyDialog').close();for(const part of ['top','bottom'])Revision97.setPart(part,false)};
 const originalPractice=$('usePractice').onclick;$('usePractice').onclick=async e=>{A.showWriter();await originalPractice?.call($('usePractice'),e);$('copyDialog').close();for(const part of ['top','bottom'])Revision97.setPart(part,false)};
 const captions={topSize:'笔径',zoomQuick79:'纸面',topAuto:'走纸',topStyle:'书风',topMotion:'移纸',topReference:'临帖',topUpload:'加图',topColor:'墨色',topLines:'栏线',topGuide:'引导',topDirection:'方向',topMusic:'音乐',topDaily:'文摘'};
 function labelTools(){for(const b of $('bottomIcons39').querySelectorAll('button')){if(!b.querySelector('svg')||b.querySelector('span'))continue;const name=captions[b.id]||(b.getAttribute('aria-label')||b.title||b.textContent||'设置').replace(/[\s·]/g,'').slice(0,2);b.classList.add('tool90','bottomTool106');const label=document.createElement('span');label.className='caption106';label.textContent=name;b.append(label)}}labelTools();new MutationObserver(labelTools).observe($('bottomIcons39'),{childList:true,subtree:true});
 // Position hints against the actual paper rather than viewport dimensions.
 const hint=$('writingHint100');function placeHint(){const f=A.paperFrame107();hint.style.setProperty('left',Math.max(12,f.x+12)+'px','important');hint.style.setProperty('top',Math.max(12,f.y+12)+'px','important')};document.addEventListener('preview-painted94',placeHint);addEventListener('resize',placeHint);placeHint();
 document.addEventListener('contextmenu',e=>{if(e.target.closest('#board,#topActions,#bottomIcons39,#previewEffects55,#dailyDialog,#writerModes53,#paperPen100'))e.preventDefault()},true);
 window.Features106={ready:true};
})();
