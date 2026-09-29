/* Keep Chinese verse in 诗词歌赋. Never fabricate a modern literary quotation to fill a quota. */
(function(){if(!window.RefreshedQuotes)return;
const old=window.RefreshedQuotes.filter(x=>x.cat==='literature');const chosen=[];for(const x of old){const country=x.country,title=x.title||String(x.s||'').match(/《([^》]+)》/)?.[1];if(!country||!title||!x.q||chosen.some(y=>y.author===x.author&&y.title===title))continue;chosen.push({...x,id:x.id||'literature80-'+chosen.length,country,title,source:[country,x.author,title].join(' · '),s:[country,x.author,title].join(' · '),curation80:true})}
window.Literature80=chosen;window.Literature79=chosen;window.RefreshedQuotes=window.RefreshedQuotes.filter(x=>x.cat!=='literature').concat(chosen);
})();
