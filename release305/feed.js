/* Explicit expansion keeps initial galleries compact; images remain viewport-lazy. */
(()=>{
 const feed=document.getElementById('worksFeed198')||document.getElementById('hallFeed197');if(!feed)return;
 const more=document.getElementById(feed.id==='worksFeed198'?'moreWorks198':'moreHall197');if(!more)return;
 let expanded=false,columns,sequence=0;
 function draw(){
  if(!columns?.isConnected){columns=document.createElement('div');columns.className='feedColumns305';for(let i=0;i<2;i++){const column=document.createElement('div');column.className='feedColumn305';columns.append(column)}sequence=0;feed.append(columns)}
  const cards=[...feed.querySelectorAll('.hallCard197')];
  for(const card of cards)if(!card.closest('.feedColumn305')){card.dataset.order305=String(sequence++);columns.children[Number(card.dataset.order305)%2].append(card)}
  for(const card of cards)card.dataset.collapsed305=String(!expanded&&Number(card.dataset.order305)>=4);
  more.hidden=expanded?more.dataset.ended305==='true':false;more.textContent=window.I18n218?.text(expanded?'继续浏览更多作品':'更多作品')||(expanded?'继续浏览更多作品':'更多作品');
 }
 feed.classList.add('feed305');
 more.addEventListener('click',()=>{if(expanded)return;expanded=true;feed.classList.add('expanded305');document.body.classList.add('feedExpanded305');draw()},true);
 new MutationObserver(draw).observe(feed,{childList:true,subtree:true});
 // Feed owners report their pagination state. Expansion must also work with <=10 records.
 more.addEventListener('feed-state305',e=>{more.dataset.ended305=String(e.detail.ended);draw()});
 feed.addEventListener('scroll',()=>{if(expanded&&feed.scrollTop>0&&feed.scrollHeight-feed.clientHeight-feed.scrollTop<180&&!more.hidden&&!more.disabled){const owner=feed.id==='worksFeed198'?window.Works198:window.HallFeed197;owner?.load()}},{passive:true});
 window.Feed305={expand(){more.click()},get expanded(){return expanded}};draw();
})();
