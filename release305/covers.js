/* Vertical author selection leaves horizontal pointer events to the timeline pager. */
(function(root){
 function bind(track){
  if(track.dataset.swipe220||track.children.length<2)return;
  const cards=[...track.children].filter(n=>n.classList.contains('card154'));if(!cards.length)return;
  track.dataset.swipe220='305';track.tabIndex=0;track.setAttribute('aria-roledescription','carousel');let at=0,drag=null,ignore=0;
  function go(n){at=(n+cards.length)%cards.length;for(const [i,card]of cards.entries()){card.dataset.coverVisible305=String(i===at);card.setAttribute('aria-hidden',String(i!==at));if('inert'in card)card.inert=i!==at;for(const [j,b]of card.querySelectorAll('.dots154 button').entries()){const index=cards.length>3?(at+j-1+cards.length)%cards.length:j;b.dataset.index305=String(index);b.ariaLabel=(root.I18n218?.text('同作者作品')||'同作者作品')+' '+(index+1);b.setAttribute('aria-pressed',String(index===at));}}}
  for(const card of cards){const dots=card.querySelector('.dots154');if(!dots)continue;dots.replaceChildren();for(let i=0;i<Math.min(3,cards.length);i++){const b=document.createElement('button');b.type='button';b.onclick=e=>{e.stopPropagation();go(Number(b.dataset.index305))};dots.append(b)}}
  track.addEventListener('pointerdown',e=>{if(e.isPrimary===false||e.button>0||e.target.closest('a,.cardQuick154,.maintain154,.dots154'))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};track.setPointerCapture?.(e.pointerId)});
  track.addEventListener('pointermove',e=>{if(drag&&e.pointerId===drag.id&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>12)e.preventDefault()},{passive:false});
  track.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag=null;if(Math.abs(dy)>35&&Math.abs(dy)>Math.abs(dx)*1.2){e.stopPropagation();ignore=Date.now()+450;go(at+(dy<0?1:-1))}else if(Math.abs(dx)>35)ignore=Date.now()+450;});
  track.addEventListener('pointercancel',()=>drag=null);
  track.addEventListener('click',e=>{if(Date.now()<ignore){e.preventDefault();e.stopImmediatePropagation()}},true);
  track.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();e.stopPropagation();go(at+(e.key==='ArrowDown'?1:-1))}});go(0);
 }
 root.AuthorCovers305={bind};
})(window);
