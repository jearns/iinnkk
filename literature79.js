/* A new 100-entry literary rotation. Classical Chinese verse is kept complete.
   Foreign-language entries retain existing attributed Chinese excerpts, not invented continuations. */
(function(){if(!window.Poetry100||!window.RefreshedQuotes)return;
const classics=['鲁迅','老舍','朱自清','钱钟书','张爱玲','史铁生','路遥','陈忠实','金庸','刘慈欣','吉卜林','泰戈尔','叶芝','萧伯纳','黑塞','罗素','加缪','川端康成','索尔仁尼琴','聂鲁达','马尔克斯','辛波斯卡','莎士比亚','塞万提斯','夏洛蒂·勃朗特','艾米莉·勃朗特','狄更斯','陀思妥耶夫斯基','普希金','梭罗','纪伯伦','卡夫卡','尼采','帕斯卡','卢梭','赫胥黎'];
const existing=window.RefreshedQuotes.filter(x=>x.cat==='literature');const world=classics.map((author,i)=>{const x=existing.find(q=>q.author===author&&q.q.length>=40&&q.title&&q.country);return x&&{...x,id:'literature79-world-'+(i+1),q:x.q.slice(0,85),s:[x.country,x.author,x.title].join(' · '),source:[x.country,x.author,x.title].join(' · '),cat:'literature',curation79:true}}).filter(Boolean);
const seen=new Set(),authors=new Map(),verse=[];for(const x of Poetry100){if(x.kind!=='全文'||x.q.length<40||x.q.length>95||seen.has(x.q)||(authors.get(x.author)||0)>=3)continue;seen.add(x.q);authors.set(x.author,(authors.get(x.author)||0)+1);verse.push({...x,id:'literature79-cn-'+verse.length,cat:'literature',country:'中国',title:x.title,source:['中国',x.author,x.title].join(' · '),s:['中国',x.author,x.title].join(' · '),curation79:true});if(verse.length>=100-world.length)break}
window.Literature79=[...world,...verse].slice(0,100);window.RefreshedQuotes=window.RefreshedQuotes.filter(x=>x.cat!=='literature').concat(window.Literature79);
})();
