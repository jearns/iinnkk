(function init110(){
 if(!window.Revision109?.ready){setTimeout(init110,40);return}
 const A=AnnotationApp,$=id=>document.getElementById(id);
 function colour(hex){hex=String(hex||'#000000').toUpperCase();const rgb=hex.slice(1).match(/../g)?.map(v=>parseInt(v,16)/255)||[0,0,0],max=Math.max(...rgb),min=Math.min(...rgb),delta=max-min,l=(max+min)/2;let name;if(delta<.07)name=l<.15?'玄黑':l>.88?'白':l>.65?'浅灰':'灰';else{let h=max===rgb[0]?((rgb[1]-rgb[2])/delta)%6:max===rgb[1]?(rgb[2]-rgb[0])/delta+2:(rgb[0]-rgb[1])/delta+4;h=(h*60+360)%360;const base=h<18||h>=345?'红':h<40?'橙赭':h<75?'黄':h<165?'绿':h<200?'青':h<260?'蓝':h<300?'紫':'紫红';name=(l<.28?'深':l>.72?'浅':'')+base}return name==='红'?'朱红':name==='黄'?'金黄':name==='白'?'素白':name}
 function designIdea(p,state){return HeritageStories113.describe(p,state,colour)}
 const originalApply=Revision94.apply;Revision94.apply=p=>originalApply({...p,idea:designIdea(p,{values:{papercolor:p.paper,headColor:p.seal,tailColor:p.seal},brush:{color:p.ink}})});
 const sign=document.createElement('button');sign.type='button';sign.className='tool90';sign.id='topSignature110';sign.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m5 16 2-6L17 2l4 4-9 9-7 1Zm0 0-2 4m8-1h10M7 10l5 5"/></svg><span>落款</span>';sign.setAttribute('aria-label','落款：定位空白并适配笔径');$('topSize').after(sign);sign.onclick=()=>{A.toggleSignature110();sync()};
 function sync(){const status=A.signatureStatus110();sign.setAttribute('aria-pressed',String(status.active));sign.classList.toggle('active109',status.active);sign.title=status.active?'返回正文 · 落款笔径 '+status.placement.size:'落款：自动定位空白并适配笔径';const s=A.getState(),p=s.paletteCredit96;if(p){const idea=designIdea(p,s);if(idea!==p.idea)A.setPaletteCredit96({...p,idea})}}
 for(const event of ['change','input','signature-view110','preview-painted94','mode-ready109'])document.addEventListener(event,sync);
 // Recognize three-finger double taps before the two-finger preview gesture.
 const pointers=new Map();let triple=null,last=null;
 function stop(e){e.preventDefault();e.stopImmediatePropagation()}
 document.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||A.isOverview55()||!e.target.closest('#board'))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,t:performance.now()});if(pointers.size===3){const points=[...pointers.values()],now=performance.now();triple={start:Math.min(...points.map(p=>p.t)),x:points.reduce((n,p)=>n+p.x,0)/3,y:points.reduce((n,p)=>n+p.y,0)/3,moved:now-Math.min(...points.map(p=>p.t))>140};A.cancelGesture110();stop(e)}else if(triple){triple.moved=true;stop(e)}},true);
 document.addEventListener('pointermove',e=>{const p=pointers.get(e.pointerId);if(!p)return;if(triple){if(Math.hypot(e.clientX-p.x,e.clientY-p.y)>12)triple.moved=true;stop(e)}},true);
 function release(e){if(!pointers.has(e.pointerId))return;pointers.delete(e.pointerId);if(!triple)return;stop(e);if(e.type==='pointercancel')triple.moved=true;if(pointers.size)return;const tap=triple;triple=null;const now=performance.now();if(!tap.moved&&now-tap.start<320){if(last&&now-last.t<440&&Math.hypot(tap.x-last.x,tap.y-last.y)<55){last=null;A.toggleSignature110();sync()}else last={t:now,x:tap.x,y:tap.y}}else last=null;A.cancelGesture110()}
 document.addEventListener('pointerup',release,true);document.addEventListener('pointercancel',release,true);
 window.Revision110={ready:true,colour,designIdea};sync();
})();
