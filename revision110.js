(function init110(){
 if(!window.Revision109?.ready){setTimeout(init110,40);return}
 const A=AnnotationApp,$=id=>document.getElementById(id);
 function colour(hex){hex=String(hex||'#000000').toUpperCase();const rgb=hex.slice(1).match(/../g)?.map(v=>parseInt(v,16)/255)||[0,0,0],max=Math.max(...rgb),min=Math.min(...rgb),delta=max-min,l=(max+min)/2;let name;if(delta<.07)name=l<.15?'玄黑':l>.88?'白':l>.65?'浅灰':'灰';else{let h=max===rgb[0]?((rgb[1]-rgb[2])/delta)%6:max===rgb[1]?(rgb[2]-rgb[0])/delta+2:(rgb[0]-rgb[1])/delta+4;h=(h*60+360)%360;const base=h<18||h>=345?'红':h<40?'橙赭':h<75?'黄':h<165?'绿':h<200?'青':h<260?'蓝':h<300?'紫':'紫红';name=(l<.28?'深':l>.72?'浅':'')+base}return name==='红'?'朱红':name==='黄'?'金黄':name==='白'?'素白':name}
 function designIdea(p,state){return HeritageStories113.describe(p,state,colour)}
 const originalApply=Revision94.apply;Revision94.apply=p=>originalApply({...p,idea:designIdea(p,{values:{papercolor:p.paper,headColor:p.seal,tailColor:p.seal},brush:{color:p.ink}})});
 const sign=document.createElement('button');sign.type='button';sign.className='tool90';sign.id='topSignature110';sign.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m5 16 2-6L17 2l4 4-9 9-7 1Zm0 0-2 4m8-1h10M7 10l5 5"/></svg><span>落款</span>';sign.setAttribute('aria-label','落款：定位空白并适配笔径');$('topSize').after(sign);sign.onclick=()=>{A.toggleSignature110();sync()};
 const reference=document.createElement('p');reference.className='note';reference.id='signatureScaleReference';$('sizeDialog38').append(reference);
 function sync(){const z=+$('zoom').value||200;reference.hidden=!A.signatureStatus110().active;reference.textContent='落款基线：笔径8、缩放200%。保持屏幕粗细：参考笔径＝1600÷缩放百分数；当前'+z+'%，参考笔径'+Number((1600/z).toFixed(2))+'。双指三击返回正文。';const status=A.signatureStatus110();sign.setAttribute('aria-pressed',String(status.active));sign.classList.toggle('active109',status.active);sign.title=status.active?'返回正文 · 落款笔径 '+status.placement.size:'落款：定位空白 · 笔径8 · 缩放200%';const s=A.getState(),p=s.paletteCredit96;if(p){const idea=designIdea(p,s);if(idea!==p.idea)A.setPaletteCredit96({...p,idea})}}
 for(const event of ['change','input','signature-view110','preview-painted94','mode-ready109'])document.addEventListener(event,sync);
 // Writing multi-taps are handled together in app.js.
 window.Revision110={ready:true,colour,designIdea};sync();
})();
