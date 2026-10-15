/* Seven light vector posters. No hidden images or facsimiles are decoded on startup. */
(function init(){if(!window.AnnotationHome||!window.Revision90?.ready&&!window.Revision88?.ready){setTimeout(init,100);return}
const A=AnnotationApp,$=id=>document.getElementById(id),E=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e};
const slides=[
 {
  "id": "single-scene",
  "k": "手笔 · 大字练习",
  "title": "大字起笔，\n练出自己的手笔。",
  "sub": "从一个字开始，感受提按与转折。\n写一遍，再写一遍，每一笔都算数。",
  "cta": "从手笔大字开始",
  "ink": "#263e35",
  "paper": "#eee7d5",
  "accent": "#a74732"
 },
 {
  "id": "nobel-scene",
  "k": "手笔 · 文学摘抄",
  "title": "把文学的光，\n写成自己的手笔。",
  "sub": "读一句打动你的话，亲手把它留下。\n让经典走过指尖，也走进日常。",
  "cta": "用手笔摘抄经典",
  "ink": "#263e35",
  "paper": "#eee7d5",
  "accent": "#a74732"
 },
 {
  "id": "copy-scene",
  "k": "手笔 · 经典临写",
  "title": "临千年名帖，\n见自己的手笔。",
  "sub": "兰亭的流转，颜体的风骨。\n一笔一划相遇，慢慢写出自己的理解。",
  "cta": "用手笔临一帖",
  "ink": "#263e35",
  "paper": "#eee7d5",
  "accent": "#a74732"
 },
 {
  "id": "relay-scene",
  "k": "手笔 · 亲友共书",
  "title": "这一纸手笔，\n等你一起接着写。",
  "sub": "孩子、家人、朋友，各自写下一笔。\n把问候与心意，留在同一张纸上。",
  "cta": "邀请大家共留手笔",
  "ink": "#263e35",
  "paper": "#eee7d5",
  "accent": "#a74732"
 },
 {
  "id": "hello-world",
  "n": "00",
  "k": "手笔 · 问好世界",
  "title": "让世界，\n看见你的手笔。",
  "sub": "山村、海岛、街巷与远方。\n以手为笔，把今天的心意写给世界。",
  "cta": "留下我的手笔",
  "ink": "#314b3e",
  "paper": "#f1ecdf",
  "accent": "#a44d36",
  "glyph": "世"
 },
 {
  "id": "civilization",
  "n": "01",
  "k": "手笔 · 文明长卷",
  "title": "一方手笔，\n相遇万千文明。",
  "sub": "从甲骨到纸笺，从东方到远方。\n循着文字，读懂人类留下的印记。",
  "cta": "随手笔漫游文明",
  "ink": "#eae4cf",
  "paper": "#273b42",
  "accent": "#dbb47b",
  "glyph": "文"
 },
 {
  "id": "handwriting",
  "n": "02",
  "k": "手笔 · 见字如面",
  "title": "千年之后，\n仍认得你的手笔。",
  "sub": "落笔的轻重，藏着独一无二的你。\n让今天的心跳，在纸上留下回声。",
  "cta": "写下今天的手笔",
  "ink": "#42382e",
  "paper": "#eee3cc",
  "accent": "#a44d35",
  "glyph": "心"
 },
 {
  "id": "constellation",
  "n": "03",
  "k": "手笔 · 文字方舟",
  "title": "以每个人的手笔，\n续写人类的星光。",
  "sub": "一起结网记字，打造文字方舟。\n让平凡的一笔，也有被看见的位置。",
  "cta": "加入手笔文字方舟",
  "ink": "#eee9da",
  "paper": "#29352f",
  "accent": "#d6b779",
  "glyph": "星"
 },
 {
  "id": "reference",
  "n": "01",
  "k": "手笔 · 浮帖参考",
  "title": "名帖在旁，\n手笔更有来处。",
  "sub": "浮帖可移动、缩放、翻页。\n原帖就在笔边，边看边写，从容落笔。",
  "cta": "打开手笔浮帖",
  "ink": "#243e38",
  "paper": "#f0ead9",
  "accent": "#c3603b",
  "glyph": "永"
 },
 {
  "id": "passport",
  "n": "02",
  "k": "手笔 · 书法文牒",
  "title": "以一路手笔，\n走过千年名帖。",
  "sub": "一帖一站，一笔一印。\n把认真临写的时光，收进自己的文牒。",
  "cta": "展开手笔文牒",
  "ink": "#faf0d6",
  "paper": "#283e36",
  "accent": "#d9ae67",
  "glyph": "牒"
 },
 {
  "id": "reader",
  "n": "03",
  "k": "手笔 · 随读随写",
  "title": "读到心动，\n就用手笔记下。",
  "sub": "好文章放在笔边，全文随时翻阅。\n读懂一段，亲手写下，留给日后的自己。",
  "cta": "随手笔读写好文章",
  "ink": "#3b414b",
  "paper": "#e9edf0",
  "accent": "#af533d",
  "glyph": "赋"
 },
 {
  "id": "relay",
  "n": "04",
  "k": "手笔 · 接力共书",
  "title": "你一笔，我一笔，\n共成一卷手笔。",
  "sub": "朋友接力题跋，各自钤印。\n今天留下的心意，明天有人接续。",
  "cta": "发起手笔共书",
  "ink": "#442e28",
  "paper": "#f1e1ce",
  "accent": "#b23326",
  "glyph": "缘"
 },
 {
  "id": "expand",
  "n": "05",
  "k": "手笔 · 四向拓纸",
  "title": "手笔未尽，\n纸上自有远方。",
  "sub": "预览三击，展开四向拓纸。\n点击或拖动加纸，让灵感接着往下写。",
  "cta": "延展我的手笔",
  "ink": "#e8e9df",
  "paper": "#34464a",
  "accent": "#d5a174",
  "glyph": "展"
 },
 {
  "id": "heritage",
  "n": "06",
  "k": "手笔 · 山河配色",
  "title": "山河入色，\n万象落于手笔。",
  "sub": "墨、纸、印的颜色，取意世界遗产。\n读一段设计理念，写一张远方来信。",
  "cta": "遇见手笔山河配色",
  "ink": "#294943",
  "paper": "#e3e8d9",
  "accent": "#b36041",
  "glyph": "境"
 },
 {
  "id": "gestures",
  "n": "07",
  "k": "手笔 · 指尖书写",
  "title": "指尖就是笔，\n随时留下手笔。",
  "sub": "双击定位，上滑换色，三击拓纸。\n从正文到落款，让表达跟着手指走。",
  "cta": "体验手笔书写",
  "ink": "#4b3847",
  "paper": "#efe6ea",
  "accent": "#a14b4b",
  "glyph": "指"
 }
];
const culture=['hello-world','civilization','handwriting','constellation'];slides.sort((a,b)=>{const rank=s=>culture.includes(s.id)?culture.indexOf(s.id):s.id.endsWith('-scene')?4:5;return rank(a)-rank(b)});
if(!window.WriterOnly157){
const home=$('annotationHome'),hero=E('section','featureHero144'),viewport=E('div','featureViewport144'),nav=E('nav','featureNav144'),info=E('span','featureCount144');hero.id='featureHero144';hero.setAttribute('aria-label','新功能轮播');viewport.tabIndex=0;viewport.setAttribute('aria-roledescription','轮播');let index=0,paused=false,run=0;const panels=[];
for(const s of slides){const card=E('article','featureSlide144');card.dataset.slide146=s.id;card.setAttribute('aria-label',s.k+'：'+s.title.replace(/\n/g,''));card.style.setProperty('--f-ink',s.ink);card.style.setProperty('--f-paper',s.paper);card.style.setProperty('--f-accent',s.accent);const copy=E('div','featureCopy144'),label=E('small','featureKicker144','手笔 / '+String(slides.indexOf(s)+1).padStart(2,'0')+' · '+s.k),title=E('h2','',s.title),desc=E('p','',s.sub),cta=E('button','featureCta144',s.cta+' ↗');cta.type='button';cta.onclick=async()=>{cta.disabled=true;try{await launch(s.id)}catch(e){A.toast(e.message)}finally{cta.disabled=false}};copy.append(label,title,desc,cta);const art=E('div','featureArt144');const image=E('img');image.src=(s.id.endsWith('-scene')?'banners150/':s.id==='hello-world'?'banners146/':['civilization','handwriting','constellation'].includes(s.id)?'banners145/':'banners144/')+s.id+'.svg';image.alt='';image.loading=slides.indexOf(s)===0?'eager':'lazy';image.decoding='async';art.append(image);card.append(copy,art);panels.push(card);viewport.append(card);const dot=E('button','featureDot144');dot.type='button';dot.title=dot.ariaLabel=s.k;dot.onclick=()=>{go(slides.indexOf(s));paused=true};nav.append(dot)}
const prev=E('button','','‹'),next=E('button','','›'),pause=E('button','','Ⅱ');prev.type=next.type=pause.type='button';prev.title=prev.ariaLabel='上一页';next.title=next.ariaLabel='下一页';pause.title=pause.ariaLabel='暂停轮播';prev.onclick=()=>{go(index-1);paused=true};next.onclick=()=>{go(index+1);paused=true};pause.onclick=()=>{paused=!paused;pause.textContent=paused?'▷':'Ⅱ';pause.title=pause.ariaLabel=paused?'播放轮播':'暂停轮播'};const controls=E('div','featureControls144');controls.append(prev,nav,info,pause,next);hero.append(viewport,controls);const quick=$('homeQuick47'),intro=home.querySelector('.annotationIntro');if(intro){intro.hidden=true;intro.after(hero)}else home.prepend(hero);if(quick)hero.before(quick);function go(i){index=(i+slides.length)%slides.length;viewport.scrollTo({left:index*viewport.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});for(const [j,p]of panels.entries()){p.inert=j!==index;p.querySelector('button').tabIndex=j===index?0:-1;nav.children[j].setAttribute('aria-current',String(j===index))}info.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0')}go(0);viewport.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){go(index+1);paused=true}if(e.key==='ArrowLeft'){go(index-1);paused=true}});viewport.addEventListener('pointerdown',()=>paused=true,{passive:true});let scrollTimer;viewport.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{index=Math.round(viewport.scrollLeft/Math.max(1,viewport.clientWidth));for(const [j,p]of panels.entries()){p.inert=j!==index;p.querySelector('button').tabIndex=j===index?0:-1;nav.children[j].setAttribute('aria-current',String(j===index))}info.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0')},100)},{passive:true});setInterval(()=>{if(!paused&&!document.hidden&&document.body.classList.contains('home-open')&&!hero.contains(document.activeElement)&&!matchMedia('(prefers-reduced-motion: reduce)').matches)go(index+1)},8000);addEventListener('resize',()=>go(index));
}
async function fresh(){await window.Revision128?.saveOnSwitch129?.();await CopyAlbums38.clear();const mode=InkStudio50.config.nav.find(m=>m.id==='letter');if(mode)await InkStudio50.applyMode(mode);await A.newBlank54();await A.configure47({values:{sceneChoice:'none',paperExtent:'fixed',ratio:'0.75',zoom:'200',showLines:'no'},size:40,focus:'start'});A.showWriter()}
async function launch(id){if(id==='single-scene'){const mode=InkStudio50.config.nav.find(n=>n.layout==='single');if(!mode)throw Error('大字模式暂未加载');await InkStudio50.applyMode(mode);A.showWriter();return}if(id==='nobel-scene'){await fresh();const q=DailyQuotes38.all().find(q=>q.cat==='nobel');if(!q)throw Error('诺奖文摘正在加载，请稍后重试');DailyQuotes38.selectId(q.id||q.s+'|'+q.q);Revision90.showReader();return}if(id==='copy-scene')id='reference';if(id==='relay-scene')id='relay';if(id==='civilization'){document.getElementById('inkTimeline73')?.scrollIntoView({behavior:'smooth',block:'start'});return}if(id==='hello-world'||id==='constellation'||id==='handwriting'){await fresh();return}if(id==='passport'){await Passport144.open();return}if(id==='reference'){await TimelineCloud74.ready;const c=Timeline73.chapters.find(c=>c.id==='lanting')||Content133.linkedChapter143(Content133.canon[0]);if(!c)throw Error('兰亭序目录正在加载，请稍后重试');await Timeline73.openCopy(c);return}if(id==='relay'){await SharedInk128.open();return}await fresh();if(id==='reader'){const q=DailyQuotes38.all().find(q=>/前赤壁赋/.test(q.title||q.s||'')||(/赤壁赋/.test(q.title||q.s||'')&&!/后赤壁赋/.test(q.title||q.s||'')));if(!q)throw Error('前赤壁赋暂未加载，请从文摘目录选择');DailyQuotes38.selectId(q.id||q.s+'|'+q.q);Revision90.showReader();return}if(id==='heritage'){if(window.Revision94?.palette)Revision94.apply(Revision94.palette());else $('previewRandom79')?.click();A.toast('印、墨、纸来自同一段远方故事；在预览里读设计理念。')}if(!A.isOverview55())$('fitView').click();if(id==='expand'){if(window.PreviewPaper120&&document.getElementById('previewEdges120')?.hidden)PreviewPaper120.toggle();A.toast('预览三击纸面显示四向箭头；点击或外拉拓纸，向内收回。')}if(id==='gestures')gestureGuide()}
function gestureGuide(){let d=$('gestureGuide144');if(!d){d=E('dialog','gestureGuide144');d.id='gestureGuide144';const h=E('header','dialogHead'),x=E('button','','×');x.type='button';x.onclick=()=>d.close();h.append(E('h2','','指尖书写指南'),x);d.append(h);for(const [gesture,action]of [['预览 · 单指双击','定位到落点，进入书写'],['预览 · 单指三击','显示或隐藏四向拓纸箭头'],['预览 · 上滑','全屏并切换色彩'],['全屏 · 左右滑','切换装裱框架'],['全屏 · 下滑','退出全屏并展开配置'],['书写 · 双指拖动','移动纸张'],['双指三击','正文 ↔ 落款题跋'],['四击','切换格线'],['五击','清空当前书写区'],['六击','撤销上一步']]){const row=E('p');row.append(E('strong','',gesture),E('span','',action));d.append(row)}d.append(E('small','','清空前先保存作品；可用撤销找回当前步骤。'));document.body.append(d)}d.showModal()}
window.Features144={slides,launch,gestureGuide};
})();

