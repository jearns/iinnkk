/* V91 draft: extend the existing owner for toolbar and reader, without another override module. */
(function init90(){
 if(!window.Revision87?.ready||!window.Revision62||!window.Revision43?.ready||!window.Revision47?.ready||!window.InkCloud75||!document.getElementById('homeBrand79')){setTimeout(init90,40);return}
 const $=id=>document.getElementById(id),A=AnnotationApp,D=DailyQuotes38,home=$('annotationHome'),root=document.documentElement;
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
 const brand=home.querySelector('.annotationBrand'),brandBox=brand.querySelector('div'),hero=brandBox.querySelector('h1');
 // A single real seal in the hero; its counterpart appears only once the hero leaves view.
 hero.replaceChildren();const logo=el('img','heroSeal90');logo.src='brand148.svg';logo.alt='篆书手字印章';hero.append(logo,el('span','','手笔'));
 const sub=brandBox.querySelector('p');sub.textContent='一手一笔·iinnkk.me·留下真迹';
 const syncHeroWidth=()=>{if(home.clientWidth>0)root.style.setProperty('--home-width91',home.clientWidth+'px')};new ResizeObserver(syncHeroWidth).observe(home);syncHeroWidth();
 const intro=home.querySelector('.annotationIntro');const constellation=el('img','heroConstellation91');constellation.loading='lazy';constellation.alt='';constellation.setAttribute('aria-hidden','true');constellation.decoding='async';intro.replaceChildren(constellation,el('strong','','人类群星闪耀时'),el('small','','一起结网记字，打造文字方舟！'));
 home.querySelectorAll('.homeLogo85,.homeLogo86,.homeLogo87,#homeTop86').forEach(e=>e.remove());
 const account=$('account47'),reminder=$('homeMoments')||$('momentReminder')||$('homeMoment47')||brand.querySelector('[id*=Moment]')||[...brand.querySelectorAll('button')].find(b=>/提醒|日历|天后|今天|明天/.test(b.textContent+' '+b.title));
 const theme=home.querySelector('.homeTheme78'),sources=[...theme.querySelectorAll('button')];
 const river=sources.find(b=>b.dataset.theme==='river'),stars=sources.find(b=>b.dataset.theme==='stars');
 for(const b of sources)b.hidden=true;
 const sw=el('button','themeSeal90');sw.id='themeSwitch90';sw.type='button';sw.innerHTML='<i aria-hidden="true"></i><span>深</span><span>浅</span>';theme.append(sw);
 const actions=el('div','homeActions90');actions.id='homeActions90';brand.append(actions);
 actions.append(theme);if(reminder)actions.append(reminder);$('continueWriting')?.remove();if(account)actions.append(account);
 account.classList.add('accountSeal90');
 const syncTheme=()=>{const dark=document.body.dataset.homeTheme==='stars';sw.dataset.mode=dark?'dark':'light';sw.setAttribute('aria-label',dark?'深色，点击切浅色':'浅色，点击切深色');sw.setAttribute('aria-pressed',String(dark))};
 sw.onclick=()=>{(document.body.dataset.homeTheme==='stars'?river:stars).click();syncTheme()};
 // Use the browser's own timezone, with manual choice lasting until the next 06:00/18:00 boundary.
 let period='';function autoTheme(){const now=new Date(),zone=Intl.DateTimeFormat().resolvedOptions().timeZone;const hour=Number(new Intl.DateTimeFormat('en',{hour:'numeric',hourCycle:'h23',timeZone:zone}).format(now));const dark=hour>=18||hour<6;const day=new Intl.DateTimeFormat('en-CA',{timeZone:zone}).format(now),key=day+'|'+dark;if(key!==period){period=key;(dark?stars:river).click()}syncTheme()}
 autoTheme();setInterval(autoTheme,30000);addEventListener('focus',autoTheme);document.addEventListener('visibilitychange',()=>{if(!document.hidden)autoTheme()});
 function alignSubtitle(){const width=hero.getBoundingClientRect().width;sub.style.setProperty('width',width+'px');sub.style.setProperty('max-width',width+'px');sub.style.setProperty('font-size',Math.min(9,width/23)+'px');}
 new ResizeObserver(alignSubtitle).observe(hero);document.fonts.ready.then(alignSubtitle);
 const nav=$('homeQuick47'),navBrand=$('homeBrand79');navBrand.replaceChildren();const navLogo=logo.cloneNode();navLogo.className='navSeal90';navBrand.append(navLogo,el('span','','手笔'));navBrand.onclick=()=>home.scrollTo({top:0,behavior:'smooth'});
 let scrollFrame=0;function sticky(){scrollFrame=0;const visible=hero.getBoundingClientRect().bottom<=home.getBoundingClientRect().top;navBrand.classList.toggle('visible85',visible);navBrand.setAttribute('aria-hidden',String(!visible));navBrand.tabIndex=visible?0:-1}
 home.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(sticky)},{passive:true});addEventListener('scroll',sticky,{passive:true});document.addEventListener('scroll',sticky,{capture:true,passive:true});addEventListener('resize',sticky);sticky();
 const countries={
  '鲁迅':'中国','老舍':'中国','朱自清':'中国','钱钟书':'中国','张爱玲':'中国','史铁生':'中国','路遥':'中国','余华':'中国','陈忠实':'中国','刘震云':'中国','金庸':'中国','莫言':'中国','刘慈欣':'中国','苏轼':'中国',
  '吉卜林':'英国','罗素':'英国','石黑一雄':'英国','奈保尔':'英国','高尔斯华绥':'英国','艾略特':'英国','戈尔丁':'英国','品特':'英国',
  '莎士比亚':'英国','简·奥斯汀':'英国','夏洛蒂·勃朗特':'英国','艾米莉·勃朗特':'英国','狄更斯':'英国','伍尔夫':'英国','奥威尔':'英国','赫胥黎':'英国',
  '叶芝':'爱尔兰','萧伯纳':'爱尔兰','贝克特':'爱尔兰','希尼':'爱尔兰',
  '歌德':'德国','黑塞':'德国','托马斯·曼':'德国','君特·格拉斯':'德国','海泽':'德国','豪普特曼':'德国',
  '托尔斯泰':'俄罗斯','陀思妥耶夫斯基':'俄罗斯','普希金':'俄罗斯','高尔基':'俄罗斯','帕斯捷尔纳克':'俄罗斯','肖洛霍夫':'俄罗斯','索尔仁尼琴':'俄罗斯','布罗茨基':'俄罗斯',
  '罗曼·罗兰':'法国','加缪':'法国','萨特':'法国','纪德':'法国','莫迪亚诺':'法国','勒克莱齐奥':'法国','安妮·埃尔诺':'法国','圣琼·佩斯':'法国','普吕多姆':'法国','苏利·普吕多姆':'法国',
  '泰戈尔':'印度','川端康成':'日本','大江健三郎':'日本',
  '海明威':'美国','福克纳':'美国','斯坦贝克':'美国','辛克莱·刘易斯':'美国','奥尼尔':'美国','赛珍珠':'美国','鲍勃·迪伦':'美国','托妮·莫里森':'美国','塞林格':'美国','菲茨杰拉德':'美国','梭罗':'美国','阿西莫夫':'美国','赫伯特':'美国','勒古恩':'美国',
  '马尔克斯':'哥伦比亚','加西亚·马尔克斯':'哥伦比亚',
  '聂鲁达':'智利','米斯特拉尔':'智利',
  '辛波斯卡':'波兰','显克维奇':'波兰','米沃什':'波兰','托卡尔丘克':'波兰',
  '帕慕克':'土耳其','若泽·萨拉马戈':'葡萄牙','库切':'南非','纳丁·戈迪默':'南非',
  '博尔赫斯':'阿根廷','帕斯':'墨西哥','沃尔科特':'圣卢西亚','门罗':'加拿大','阿列克谢耶维奇':'白俄罗斯','赫塔·米勒':'德国','特朗斯特罗姆':'瑞典','拉格洛夫':'瑞典','拉格奎斯特':'瑞典',
  '皮兰德娄':'意大利','卡尔杜齐':'意大利','夸西莫多':'意大利','蒙塔莱':'意大利',
  '梅特林克':'比利时','辛格':'美国','伯尔':'德国','古尔纳':'英国','彼得·汉德克':'奥地利','耶利内克':'奥地利','纪伯伦':'黎巴嫩','卡夫卡':'奥地利','昆德拉':'法国','尼采':'德国','帕斯卡':'法国','卢梭':'法国','培根':'英国','塞万提斯':'西班牙','雨果':'法国','大仲马':'法国','圣埃克苏佩里':'法国','狄兰·托马斯':'英国'
 };

 // Apply metadata normalization at the corpus boundary, including later local imports.
 countries['黑塞']='瑞士';countries['卡夫卡']='奥匈帝国';countries['昆德拉']='捷克／法国';countries['布罗茨基']='美国';
 Object.assign(countries,{'赫尔曼·黑塞':'瑞士','丘吉尔':'英国','安德烈·纪德':'法国','蒲宁':'俄罗斯','威廉·福克纳':'美国','多丽丝·莱辛':'英国','奥尔罕·帕慕克':'土耳其','阿卜杜勒拉扎克·古尔纳':'英国','厄休拉·勒古恩':'美国','弗兰克·赫伯特':'美国','艾萨克·阿西莫夫':'美国','阿瑟·克拉克':'英国','菲利普·迪克':'美国','威廉·吉布森':'加拿大','尼尔·盖曼':'英国','特德·姜':'美国','安迪·威尔':'美国','奥森·斯科特·卡德':'美国','丹·西蒙斯':'美国','库尔特·冯内古特':'美国','雷·布拉德伯里':'美国','道格拉斯·亚当斯':'英国','玛丽·雪莱':'英国','H.G.威尔斯':'英国','乔治·奥威尔':'英国','阿道司·赫胥黎':'英国','斯特鲁伽茨基兄弟':'俄罗斯','贾平凹':'中国','阿来':'中国','毕飞宇':'中国','苏童':'中国','王安忆':'中国','格非':'中国','梁晓声':'中国','李娟':'中国','迟子建':'中国','石一枫':'中国','梁鸿':'中国','班宇':'中国','双雪涛':'中国','张二棍':'中国'});
 const normalize=rows=>{const seen=new Set();return rows.map(q=>({...q,country:countries[q.author]||q.country||''})).filter(q=>{
   if(q.cat!=='dongpo')return true;
   if(/书法理论|论书|书论/.test([q.title,q.type,q.category,q.source].join(' ')))return false;
   const title=(q.title||String(q.s||'').match(/《([^》]+)》/)?.[1]||'').replace(/[\s·《》]/g,'');
   const body=String(q.q||'').replace(/[\s\p{P}]/gu,'');const key=title||body;if(seen.has(key))return false;seen.add(key);return true;
 })};
 for(const method of ['setAll','add','replace']){const fn=D[method];if(fn)D[method]=rows=>fn(normalize(rows))}
 D.setAll(D.all());
 const label=q=>q.cat==='heritage'?String(q.source||q.s||'').split(' · ')[0].replace(/\s*·\s*/g,'·'):[q.country||'',q.dynasty||q.era||'',q.author||(q.cat==='film'?'编剧信息待核':q.cat==='heritage'?'文化地标介绍':''),q.title||String(q.source||q.s||'').match(/《([^》]+)》/)?.[1]||(q.cat==='heritage'?q.source||q.s:'')||''].filter((v,i,a)=>v&&a.indexOf(v)===i).join('·');
 const luma=hex=>{const c=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
 const fg=ink=>luma(ink)>.3?'#111111':'#fffaf0';
 function syncInk(){const ink=A.getState().brush.color;if(!/^#[0-9a-f]{6}$/i.test(ink))return;root.style.setProperty('--reader-ink90',ink);root.style.setProperty('--reader-text90',fg(ink));const rgb=ink.slice(1).match(/../g).map(x=>parseInt(x,16));root.style.setProperty('--reader-bg91','rgba('+rgb.join(',')+',.66)');}
 // A continuous palette space, with paper/ink contrast enforced rather than preset counts.
 function hsl(h,s,l){const a=s*Math.min(l,100-l)/100,f=n=>{const k=(n+h/30)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1))};return '#'+[0,8,4].map(n=>Math.round(255*f(n)/100).toString(16).padStart(2,'0')).join('')}
 function palette(){const h=Math.random()*360,dark=Math.random()<.3;const paper=hsl(h,8+Math.random()*22,dark?10+Math.random()*9:89+Math.random()*8),ink=hsl((h+120+Math.random()*180)%360,20+Math.random()*48,dark?87+Math.random()*9:8+Math.random()*17),seal=hsl((h+15+Math.random()*75)%360,50+Math.random()*32,dark?65+Math.random()*14:25+Math.random()*17);return {paper,ink,seal}}
 function applyPalette(p){A.applyLiteraryPalette61(p);for(const s of A.sealItems())if(s.extra)A.editSeal(s.key,{config:{color:p.seal}});syncInk()}
 Revision85.palette=palette;Revision85.applyPalette=applyPalette;
 // The reader has only a draggable title row and one seven-line scroll area.
 const reader=$('dailyDialog'),head=reader.querySelector('.dialogHead'),body=reader.querySelector('.dialogBody'),text=$('quoteExpanded');
 const title=el('button','readerTitle90');title.type='button';title.id='readerTitle90';title.setAttribute('aria-expanded','false');
 const close=head.querySelector('[data-close]');head.replaceChildren(title,close);close.textContent='×';close.setAttribute('aria-label','收起全文');
 const jump=el('div','readerJump90');jump.hidden=true;jump.id='readerJump90';const list=el('div','readerList90');jump.append(list);reader.append(jump);
 const key=q=>q.id||q.s+'|'+q.q;
 function renderList(){list.replaceChildren();const categories=el('select','readerCategory91');categories.setAttribute('aria-label','文摘类别');for(const b of document.querySelectorAll('#quoteMenu [data-quote-category]')){const opt=el('option','',b.textContent);opt.value=b.dataset.quoteCategory;categories.append(opt)}categories.value=window.currentQuote?.cat||'';categories.onchange=()=>{D.select(categories.value);showReader();renderList()};list.append(categories);const groups=new Map();for(const q of D.all().filter(q=>q.cat===window.currentQuote?.cat)){const region=window.Revision109?.quoteGroup(q)||q.dynasty||q.country||q.era||'其他';if(!groups.has(region))groups.set(region,[]);groups.get(region).push(q)}const epochs=['先秦','秦','秦末','西汉','东汉','汉代','东汉末年','曹魏','三国·蜀汉','东晋','南朝','南唐','唐','宋','元','明','明末清初','清','近现代'];for(const [region,rows]of [...groups].sort((a,b)=>{const x=epochs.indexOf(a[0]),y=epochs.indexOf(b[0]);return x>=0&&y>=0?x-y:x>=0?-1:y>=0?1:a[0].localeCompare(b[0],'zh')})){list.append(el('h4','quoteGroup109',region));rows.sort((a,b)=>String(a.author||'').localeCompare(String(b.author||''),'zh')||String(a.title||'').localeCompare(String(b.title||''),'zh'));for(const q of rows){const b=el('button','',label(q));b.type='button';b.setAttribute('aria-current',String(key(q)===key(window.currentQuote)));b.onclick=()=>{D.selectId(key(q));jump.hidden=true;title.setAttribute('aria-expanded','false')};list.append(b)}}}
 title.onclick=()=>{jump.hidden=!jump.hidden;title.setAttribute('aria-expanded',String(!jump.hidden));if(!jump.hidden)renderList()};
 // Keep legacy IDs alive for corpus import/editor code; only the title and body are visible.
 for(const child of body.children)child.hidden=child!==text;text.hidden=false;
 function updateReader(q){q=q||window.currentQuote||{};title.textContent=label(q)||'好词好句';$('quoteSource').textContent=label(q);const raw=(['theory','classics','literature','nobel'].includes(q.cat)?q.paragraph||q.original:q.full||q.text)||q.q||'';text.textContent=['poetry','moon','dongpo'].includes(q.cat)&&!raw.includes('\n')?raw.replace(/([。！？])/g,'$1\n').trim():raw;text.scrollTop=0;if(!jump.hidden)renderList();syncInk()}
 const showReader=()=>{syncInk();updateReader();if(!reader.open)reader.show()};$('readQuote').onclick=showReader;$('quoteDetails').onclick=showReader;
 // Drag from the title or empty space; text remains independently scrollable.
 let drag=null,moved=false;
 reader.addEventListener('pointerdown',e=>{
  if(e.button>0||e.target.closest('input,select,textarea,a,.readerJump90,[data-reader-resize133],#quoteExpanded'))return;
  if(drag)return;
  const r=reader.getBoundingClientRect();drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left,top:r.top};moved=false;
  if(!e.target.closest('button')){e.preventDefault();reader.setPointerCapture(e.pointerId)}
  e.stopPropagation();
 },true);
 reader.addEventListener('pointermove',e=>{
  if(!drag||drag.id!==e.pointerId)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)<3)return;
  moved=true;e.preventDefault();if(!reader.hasPointerCapture(e.pointerId))reader.setPointerCapture(e.pointerId);
  reader.style.setProperty('left',Math.max(4,Math.min(innerWidth-reader.offsetWidth-4,drag.left+dx))+'px','important');
  reader.style.setProperty('top',Math.max(4,Math.min(innerHeight-reader.offsetHeight-4,drag.top+dy))+'px','important');
 },{capture:true,passive:false});
 const endDrag=e=>{if(drag?.id!==e.pointerId)return;if(reader.hasPointerCapture(e.pointerId))reader.releasePointerCapture(e.pointerId);drag=null;if(moved){e.preventDefault();setTimeout(()=>moved=false,0)}};
 reader.addEventListener('pointerup',endDrag,true);reader.addEventListener('pointercancel',endDrag,true);
 reader.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation()}},true);
 // Restore the original three real navigation controls and their existing order state.
 const readerNav=reader.querySelector('.bookmarkNav81');
 if(readerNav){readerNav.hidden=false;for(const b of readerNav.querySelectorAll('button'))b.title=b.getAttribute('aria-label')||'';}
 const paths={paper:'M4 3h10l6 6v12H4zM14 3v6h6M8 15h8m-4-4v8',char:'M5 4h14M12 4v16M7 10h10M6 17h12',undo:'m9 5-5 5 5 5M4 10h10a5 5 0 0 1 0 10h-2',redo:'m15 5 5 5-5 5m5-5H10a5 5 0 0 0 0 10h2',clear:'m4 15 9-11 7 6-9 11H7l-3-3zM9 9l8 7M12 21h9',preview:'M4 4h16v16H4zM8 8h8v8H8z',write:'m5 19 3-1L20 5l-1-1L7 16l-2 3zM9 20h11',download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',menu:'M4 6h16M4 12h16M4 18h16'};
 function decorate(button,name,path){button.classList.add('tool90');button.dataset.caption90=name;button.title=name;button.setAttribute('aria-label',name);button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+path+'"/></svg><span>'+name+'</span>'}
 const bar=$('topActions'),left=el('div','writerLeft90'),right=el('div','writerRight90');left.id='writerLeft90';right.id='writerRight90';
 // Move real core buttons, preserving their history and export handlers.
 for(const id of ['undo','redo','clear','fitView','export','menuToggle'])right.append($(id));
 const expand=el('button');expand.id='topAddPaper90';expand.type='button';decorate(expand,'扩展',paths.paper);
 expand.onclick=()=>{const d=$('bigDialog62');if(!d)return;if(!d.open)d.showModal();requestAnimationFrame(()=>{const n=d.querySelector('input[type=number]');n?.focus();n?.select()})};left.append(expand);
 const extras=el('div','writerExtras90');extras.id='writerExtras90';for(const b of [...bar.children])if(b.tagName==='BUTTON'&&!['annotationHomeButton','topRemove'].includes(b.id))extras.append(b);extras.hidden=true;
 for(const b of extras.querySelectorAll('button')){const label=({topQuotes:'好句',topUpload:'加图',topLines:'线条',topDirection:'方向',topAuto:'移纸',topOptimize:'润笔',selectInk:'选字',topSize:'笔径',topRatio:'比例',topMount:'装裱',topInk:'墨色',topStart:'起笔',myWorks:'作品',calendarMoments:'日历',recordProcess:'录制'})[b.id];if(label){b.title=label;const cap=el('span','',label);b.append(cap)}}
 // Good-quotes is always reachable, independent of whether the floating reader is open.
 const homeButton=$('annotationHomeButton');if(homeButton){homeButton.hidden=false;homeButton.classList.add('tool90');homeButton.innerHTML='<img src="favicon90.png" width="26" height="26" alt="返回首页">';homeButton.onclick=()=>{reader.close();AnnotationHome.show()};left.prepend(homeButton)}
 const leftTools=[['myWorks','作品','M3 6h6l2 3h10v12H3zM7 13h10M7 17h6'],['selectInk','选字','M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M9 9h6v6H9z'],['recordProcess','录屏','M3 5h12v14H3zM15 9l6-3v12l-6-3'],['topQuotes','文摘','M5 4h14v16H5zM8 8h8M8 12h8M8 16h5']];
 for(const [id,name,path]of leftTools){const button=$(id);if(button){button.hidden=false;decorate(button,name,path);left.insertBefore(button,expand)}}
 const excerptMenu=el('aside','excerptCategories91');excerptMenu.id='excerptCategories91';excerptMenu.hidden=true;excerptMenu.setAttribute('aria-label','好词好句类目');excerptMenu.setAttribute('role','menu');document.body.append(excerptMenu);
 const quotes=$('topQuotes');
 function closeExcerpts(){excerptMenu.hidden=true;quotes?.setAttribute('aria-expanded','false')}
 function placeExcerpts(){if(excerptMenu.hidden||!quotes)return;const r=quotes.getBoundingClientRect(),w=excerptMenu.offsetWidth,h=excerptMenu.offsetHeight;excerptMenu.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left))+'px';excerptMenu.style.top=Math.max(8,Math.min(innerHeight-h-8,r.bottom+6))+'px'}
 function openExcerpts(){
  if(reader.open)reader.close();jump.hidden=true;title.setAttribute('aria-expanded','false');
  excerptMenu.replaceChildren();
  for(const category of document.querySelectorAll('#quoteMenu [data-quote-category]')){
   const button=el('button','',category.textContent);button.type='button';button.dataset.quoteCategory91=category.dataset.quoteCategory;button.setAttribute('role','menuitem');button.setAttribute('aria-current',String(category.dataset.quoteCategory===window.currentQuote?.cat));
   button.onclick=()=>{D.select(button.dataset.quoteCategory91);showReader();closeExcerpts()};excerptMenu.append(button);
  }
  if(window.UserExcerpts112){const entry=el('button','','自己录入');entry.id='ownExcerpt112';entry.type='button';entry.setAttribute('role','menuitem');entry.onclick=()=>{closeExcerpts();UserExcerpts112.open()};excerptMenu.append(entry)}
  excerptMenu.hidden=false;quotes?.setAttribute('aria-expanded','true');placeExcerpts();
 }
 if(quotes){quotes.type='button';quotes.onclick=openExcerpts;quotes.setAttribute('aria-pressed','true');quotes.setAttribute('aria-haspopup','menu');quotes.setAttribute('aria-controls',excerptMenu.id);quotes.setAttribute('aria-expanded','false')}
 // One capture handler owns this action, so legacy toolbar click handlers cannot toggle it back off.
 document.addEventListener('click',e=>{if(e.target instanceof Element&&e.target.closest('#topQuotes')){if(window.Toolbar95?.suppressClick()){e.preventDefault();e.stopImmediatePropagation();return}e.preventDefault();e.stopImmediatePropagation();openExcerpts()}},true);
 document.addEventListener('pointerdown',e=>{if(!excerptMenu.hidden&&!excerptMenu.contains(e.target)&&!quotes?.contains(e.target))closeExcerpts()},true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeExcerpts()});addEventListener('resize',placeExcerpts);reader.addEventListener('close',()=>{if(excerptMenu.hidden)closeExcerpts()});
 $('dailyBar').hidden=true;

 for(const id of ['writingQuick73','writerFixed85','topRemove']){const e=$(id);if(e){e.hidden=true;document.body.append(e)}}
 bar.replaceChildren(left,right);bar.after(extras);
 const settings=el('button');settings.id='writerSettings90';settings.type='button';decorate(settings,'设置','M4 4h16v16H4zM8 8h8M8 12h8M8 16h8');settings.onclick=()=>A.openDialog('brushDialog');extras.append(settings);
 const menu=$('menuToggle');menu.removeAttribute('data-open');menu.setAttribute('aria-haspopup','dialog');menu.setAttribute('aria-controls','brushDialog');menu.onclick=()=>{const settings=$('brushDialog');settings.setAttribute('aria-label','本站全局设置');settings.querySelector('.dialogHead h2').textContent='本站全局设置';A.openDialog('brushDialog')};
 let lastView;function syncView(){const overview=A.isOverview55();if(lastView!==overview||!$('fitView').querySelector('span')){decorate($('fitView'),overview?'书写':'预览',paths[overview?'write':'preview']);lastView=overview}wm.hidden=!overview;}
 for(const [id,name,type] of [['undo','撤销','undo'],['redo','返回','redo'],['clear','清屏','clear'],['export','保存','download'],['menuToggle','菜单','menu']])decorate($(id),name,paths[type]);
 const wm=el('div','previewWatermark90');wm.id='previewWatermark90';wm.innerHTML='<strong>单指双击，即刻书写</strong><small>见墨·iinnkk.me·如我</small>';$('board').append(wm);
 $('hint').hidden=true;$('previewHint85')?.remove();document.querySelectorAll('.brandWatermark44').forEach(e=>e.remove());
 const actionsPreview=document.querySelector('#previewEffects55 .previewActions56');
 if(actionsPreview){actionsPreview.hidden=true;actionsPreview.setAttribute('aria-hidden','true');actionsPreview.classList.remove('previewActions90');for(const button of actionsPreview.querySelectorAll('button'))button.tabIndex=-1}
 requestAnimationFrame(()=>{const controls=$('previewEffects55'),workspace=$('board')?.parentElement;if(controls&&!controls.hidden&&workspace){workspace.style.setProperty('--preview-controls-height56',Math.ceil(controls.getBoundingClientRect().height)+'px');dispatchEvent(new Event('resize'))}});
 const random=$('previewRandom79'),reset=$('previewReset73');let savedPalette=null;random.onclick=()=>applyPalette(palette());
 random.addEventListener('pointerdown',()=>{if(!savedPalette){const s=A.getState();savedPalette={paper:s.values.papercolor,ink:s.brush.color,seal:s.values.headColor}}},true);
 reset.onclick=()=>{if(savedPalette){applyPalette(savedPalette);savedPalette=null}else $('resetSettings').click();syncView()};
 let mode='';document.addEventListener('mode-changed54',e=>{closeExcerpts();mode=e.detail.id;$('quotesVisibility').value='shown';$('quotesVisibility').dispatchEvent(new Event('change'));A.resetSealPosition('head');if(mode==='letter')showReader();else reader.close();requestAnimationFrame(syncView)});
 document.addEventListener('quote-changed',e=>{if(!window.Revision94)applyPalette(palette());updateReader(e.detail)});
 for(const event of ['change','input'])document.addEventListener(event,e=>{if(/ink|color/i.test(e.target.id))syncInk()},true);
 // Core emits this after state changes, so mode labels/watermark/ink cannot drift.
 document.addEventListener('ink-view-changed90',()=>{syncView();syncInk()});
 new MutationObserver(()=>{if(reader.open){syncInk();updateReader()}}).observe(reader,{attributes:true,attributeFilter:['open']});
 root.classList.add('v88-ready','v89-ready','v90-ready');syncView();updateReader();
 window.Revision88={ready:true,palette,applyPalette};window.Revision89={ready:true};window.Revision90={ready:true,syncView,syncInk,normalize,autoTheme,openExcerpts};window.Revision91={ready:true};
})();
