/* Experience pass 54: final-look studio, compact status and local homepage curation. */
(function init(){
if(!window.AnnotationApp?.ready||!window.InkStudio50?.ready||!window.Revision47?.ready){setTimeout(init,40);return}
const A=AnnotationApp,U=InkStudio50,$=id=>document.getElementById(id),E=(tag,attrs={},text)=>{const e=document.createElement(tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));if(text!==undefined)e.textContent=text;return e};

// Migrate the three original shortcuts once; custom administrator shortcuts are untouched.
try{if(!localStorage.getItem('iinnkk.nav54')){const key='iinnkk.studio.v1',c=JSON.parse(localStorage.getItem(key)||'null');if(c?.nav?.length){const one=id=>c.nav.find(n=>n.id===id);const single=one('single'),copy=one('copy'),letter=one('letter');if(single&&copy&&letter){letter.title='创作';letter.zoom=200;letter.size=35;c.nav=[single,copy,{...copy,id:'photo',title:'图文',format:'letter',layout:'free',size:35,zoom:200},letter,...c.nav.filter(n=>!['single','copy','letter'].includes(n.id))];localStorage.setItem(key,JSON.stringify(c))}}localStorage.setItem('iinnkk.nav54','1')}}catch{}

// Branding and default seals.
document.title='今日亲笔·见墨如我·iinnkk.me';
const brand=document.querySelector('.annotationBrand');if(brand){brand.querySelector('p').textContent='见墨如我·iinnkk.me';brand.querySelectorAll('.homeDomain44').forEach(e=>e.hidden=true)}
if($('headText').value==='亲笔手书')$('headText').value='今日亲笔';
document.querySelectorAll('[data-save-settings],#saveSettings').forEach(b=>b.textContent='保存设置');

// Keep the status centered and factual.
const mountShort={song:'素绫',japanese:'榉木',nordic:'白橡',paris:'香槟',dark:'墨线',bare:'无框'};
function status54(){const values=A.settingsSnapshot(),color=$('papercolor').selectedOptions[0]?.textContent.replace('宣纸','').slice(0,4)||'本色',mount=mountShort[values.mountKey]||Mounting.presets[values.mountKey]?.name?.slice(0,2)||'香槟';const fields=[['statusRatio42',Math.abs(+$('ratio').value-.75)<.001?'3:4':$('ratio').selectedOptions[0]?.textContent.split('·')[0].trim()],['statusPattern42',$('paperPattern').selectedOptions[0]?.textContent.split('·').at(-1).replace('意趣','').trim().slice(0,4)],['statusMaterial42',$('material').selectedOptions[0]?.textContent.split('·').at(-1).trim().slice(0,4)],['statusColor42',color],['statusMount42',mount]];for(const[id,text]of fields)if($(id))$(id).textContent=text;document.querySelectorAll('#statusDetails42>*').forEach((e,i)=>e.classList.toggle('statusFirst54',i===0))}
const prior=Status42.sync;Status42.sync=()=>{prior();status54()};status54();

// A pouch is more recognisable than the former generic quotation glyph.
if($('topQuotes'))$('topQuotes').innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55"><path d="M7 4c2 2 8 2 10 0l-2 4c4 3 5 7 3 11H6C4 15 5 11 9 8L7 4Z"/><path d="M8 8h8M10 13h4M12 11v5"/></svg>';
function quotesFor(n){const show=n?.id==='letter';$('quotesVisibility').value=show?'shown':'hidden';$('quotesVisibility').dispatchEvent(new Event('change'));document.body.classList.toggle('quotes-hidden',!show)}
document.addEventListener('mode-changed54',e=>quotesFor(e.detail));

// Final-look studio: all choices modify the real composition, while the ink coordinates stay intact.
const d=E('dialog',{id:'finalStudio54','aria-label':'作品最终效果'}),head=E('header',{class:'dialogHead'}),title=E('h2',{},'作品最终效果'),close=E('button',{type:'button'},'返回书写 ×');head.append(title,close);const body=E('div',{class:'finalBody54'}),stage=E('div',{class:'finalStage54'}),img=E('img',{alt:'所见即所得的作品最终效果'}),busy=E('span',{class:'finalBusy54'},'正在呈现…');stage.append(img,busy);const steps=E('nav',{class:'finalSteps54','aria-label':'效果步骤'}),rail=E('div',{class:'finalRail54'}),note=E('p',{class:'finalNote54'}),actions=E('footer',{class:'finalActions54'}),portrait=E('input',{type:'file',accept:'image/*',hidden:''}),download=E('button',{type:'button',class:'primary'},'采用效果并下载');actions.append(download);body.append(stage,steps,rail,note,actions);d.append(head,body);document.body.append(d);
let url='',renderToken=0,craft='';
const groups={
 '书风':[
  ['张旭','zhang','醉舞狂逸 · 狂草以疾徐、开合见气势'],['怀素','huaisu','龙蛇奔放 · 大草以中锋连绵贯气'],['柳公权','liu','骨力劲健 · 楷书以清晰转折立骨'],['颜真卿','yan','雄浑宽博 · 楷书以藏锋外拓蓄势']],
 '墨迹':[['玄黑','#050505','黑墨庄重沉静，最宜正文与长篇'],['雪白','#fffaf0','白墨清醒克制，适合深色纸'],['朱红','#c62820','朱砂醒目热烈，适合题签与祝愿'],['自定','custom','自定义墨色，保留属于你的气息']],
 '纸色':[['本色宣','#f5f1e6','温润自然，最接近日常宣纸观感'],['仿古笺','#e4d5b5','岁月感温厚，适合古文诗词'],['淡红笺','#efded6','含蓄喜庆，适合书信与祝愿'],['墨黑','#161918','深邃醒目，宜白墨与朱砂'],['岩灰','#858987','现代克制，适合极简装裱'],['竹青','#d4dcbf','清雅有生机'],['松绿','#193f33','沉稳东方色'],['绛红','#682c31','典雅庄重'],['雾蓝','#d8e5e7','清冷明净'],['自定','custom','自定义纸色']],
 '线条':[['竖线','vertical','竖写行气清晰'],['横线','horizontal','现代横写更易阅读'],['米字格','mi','八向参照，适合单字结构'],['回宫格','hui','内外宫位帮助收放'],['无线条','none','只留纸墨呼吸']],
 '纹样':[['描金云龙','dragon','云龙暗纹寓意生生不息'],['洒金笺','gold','金屑点染，喜庆而不喧'],['连绵回纹','fret','回环不断，寓意绵延'],['竹影条纹','stripe','清风竹影，疏朗雅致']],
 '框架':[['宋韵素绫','song','双缘素绫，温雅含蓄'],['京都榉木','japanese','浅木浮裱，安静留白'],['北欧白橡','nordic','白橡深盒，现代克制'],['巴黎香槟','paris','香槟细边，仪式感明亮'],['墨线留白','dark','墨线收束，适合当代空间'],['无框素笺','bare','不加框饰，完整保留纸感']],
 '流变':[['峄山','lisi','小篆定形，刻石传久'],['隶变','chengmiao','化圆为方，舒展波磔'],['楷法','zhongyao','点画立序，楷法初成'],['狂草','zhangxu','纵笔奔放，气脉连绵'],['兰亭','lanting','行书流美，人与天地相遇'],['千字文','huizong','长卷贯气，千字成风']],
 '文创':[['手机壳','phone','让亲笔成为随身之物'],['笔记本','notebook','把封面变成个人题签'],['明信片','postcard','把手写寄往远方'],['台历','calendar','让一句话陪伴一年'],['马克杯','mug','让日常器物带上笔意'],['T恤衫','shirt','把书写穿在身上'],['折扇','fan','扇面开合自有章法'],['手办底座','base','让签名成为收藏铭牌'],['手机桌面','wallphone','支持三折叠、阔直板、折叠屏与直板机'],['电脑桌面','desktop','适配常规16:9桌面']]
};
let current='书风';
function setControl(id,value){const e=$(id);if(!e)return;if(e.tagName==='SELECT'&&![...e.options].some(o=>o.value===String(value)))e.add(new Option('自定义',value));e.value=value;const scope=$('recolorScope').value;if(id==='color')$('recolorScope').value='next';e.dispatchEvent(new Event('change',{bubbles:true}));$('recolorScope').value=scope}
async function choose(group,item){const[label,value,description]=item;note.textContent=description;rail.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===value)));if(group==='书风'){window.inkEditor.effect('style',value);setControl('quickStyle',value);}if(group==='墨迹'){if(value==='custom'){const c=document.createElement('input');c.type='color';c.value=$('color').value;c.onchange=()=>{window.inkEditor.effect('color',c.value);setControl('color',c.value);render();c.remove()};rail.append(c);c.click();return}else{window.inkEditor.effect('color',value);setControl('color',value)}}if(group==='纸色'){if(value==='custom'){const c=document.createElement('input');c.type='color';c.value=$('papercolor').value;c.onchange=()=>{setControl('papercolor',c.value);render();c.remove()};rail.append(c);c.click();return}else setControl('papercolor',value)}if(group==='线条'){setControl('ruling',value);setControl('showLines',value==='none'?'no':'yes')}if(group==='纹样')setControl('paperPattern',value);if(group==='框架'){setControl('sceneChoice','none');setControl('quickMount',value)}if(group==='流变'){await AnnotationTemplates.ensure(value,true);setControl('sceneChoice','annotation:'+value)}if(group==='文创')craft=value;await render()}
function showGroup(name){current=name;[...steps.children].forEach(b=>b.setAttribute('aria-current',String(b.textContent===name)));rail.replaceChildren();for(const item of groups[name]){const b=E('button',{type:'button','data-value':item[1]},item[0]);if(/^#/.test(item[1]))b.style.setProperty('--swatch',item[1]);b.onclick=()=>choose(name,item).catch(e=>A.toast(e.message||'效果加载失败，请重试'));rail.append(b)}note.textContent=groups[name][0][2]}
delete groups['文创'];for(const name of Object.keys(groups)){const b=E('button',{type:'button'},name);b.onclick=()=>showGroup(name);steps.append(b)}showGroup(current);
close.onclick=()=>d.close();
download.onclick=()=>{for(const id of ['download_seals','download_mount','download_material','download_inkColor','download_paperColor'])if($(id))$(id).checked=true;if($('download_guide'))$('download_guide').checked=false;if($('download_lines'))$('download_lines').checked=$('showLines').value==='yes';d.close();$('generateDownload').click()};
const effects=E('section',{id:'previewEffects55',hidden:''});effects.append(steps,rail,note);$('board').parentElement.append(effects);d.remove();
async function render(){A.refresh();Status42.sync();}
const originalFit=$('fitView').onclick;
$('fitView').onclick=()=>{originalFit();effects.hidden=!A.isOverview55();};
$('export').onclick=()=>{if(!A.isOverview55())originalFit();effects.hidden=false;for(const k of ['seals','mount','material','inkColor','paperColor'])if($('download_'+k))$('download_'+k).checked=true;$('download_guide').checked=false;$('generateDownload').click()};
const previewActions=E('div',{class:'previewActions56'}),write=E('button',{type:'button',id:'returnWriting59'},'返回书写'),save=E('button',{type:'button',id:'generateArtwork59',class:'primary'},'生成作品 · 下载');write.onclick=()=>{if(A.isOverview55())$('fitView').click();effects.hidden=true};save.onclick=()=>$('export').click();previewActions.append(write,save);effects.append(previewActions);
const craftButton=E('button',{type:'button'},'文创预览');craftButton.onclick=()=>{if(!window.InkProduction50){A.toast('文创预览尚未加载');return}window.InkProduction50.open().catch(e=>A.toast(e.message||'文创预览未能打开'))};steps.append(craftButton);
const select=E('button',{type:'button'},'圈选局部');select.onclick=()=>$('selectInk').click();steps.append(select);
// Local homepage curation. Recommended finished works replace empty historical covers.
const feature=E('section',{id:'featuredWorks54',hidden:''}),track=E('div',{class:'featuredTrack54'}),featureHead=E('header',{},'本机精选 · 亲笔进入文明现场');feature.append(featureHead,track);document.querySelector('.annotationAction')?.after(feature);
async function featuredIds(){return await DraftStore.get('featured54')||[]}
let featureURLs=[];async function paintFeatured(){for(const url of featureURLs)URL.revokeObjectURL(url);featureURLs=[];const ids=await featuredIds();track.replaceChildren();if(!ids.length){feature.hidden=true;return}for(const id of ids){const w=await DraftStore.get(id);if(!w?.blob)continue;const b=E('button',{type:'button','data-id':id}),im=E('img',{alt:w.title});im.src=URL.createObjectURL(w.blob);featureURLs.push(im.src);b.append(im,E('span',{},w.title));b.onclick=()=>A.openWork(id);track.append(b)}feature.hidden=!track.children.length}
document.addEventListener('work-featured54',paintFeatured);paintFeatured();
const worksObserver=new MutationObserver(async()=>{if(!U.isAdmin)return;const ids=await featuredIds();document.querySelectorAll('#worksGrid .workCard[data-work-id]').forEach(card=>{if(card.querySelector('.feature54'))return;const id=card.dataset.workId,b=E('button',{type:'button',class:'feature54'},ids.includes(id)?'取消首页':'推荐首页');b.onclick=async()=>{let list=await featuredIds();list=list.includes(id)?list.filter(x=>x!==id):[id,...list.filter(x=>x!==id)].slice(0,12);await DraftStore.set('featured54',list);document.dispatchEvent(new Event('work-featured54'));b.textContent=list.includes(id)?'取消首页':'推荐首页'};card.append(b)})});worksObserver.observe($('worksGrid'),{childList:true,subtree:true});
document.addEventListener('admin-panel53',async e=>{const box=E('details',{class:'featuredAdmin54'});box.append(E('summary',{},'首页作品展播'));const list=E('div');box.append(E('p',{},'在“我的作品”点推荐首页。这里可拖动排序或移除，最多12幅。'),list);async function draw(){list.replaceChildren();for(const id of await featuredIds()){const w=await DraftStore.get(id);if(!w)continue;const row=E('div',{class:'featureRow54',draggable:'true','data-id':id}),handle=E('button',{type:'button'},'☰'),name=E('span',{},w.title),remove=E('button',{type:'button'},'×');row.append(handle,name,remove);remove.onclick=async()=>{await DraftStore.set('featured54',(await featuredIds()).filter(x=>x!==id));draw();paintFeatured()};row.ondragstart=ev=>ev.dataTransfer.setData('text/plain',id);row.ondragover=ev=>ev.preventDefault();row.ondrop=async ev=>{ev.preventDefault();const from=ev.dataTransfer.getData('text/plain'),a=await featuredIds(),i=a.indexOf(from),j=a.indexOf(id);if(i<0||j<0)return;a.splice(j,0,a.splice(i,1)[0]);await DraftStore.set('featured54',a);draw();paintFeatured()};list.append(row)}}draw();e.detail.body.append(box)});

window.FinalStudio54={open:()=>{if(!A.isOverview55())$('fitView').click();effects.hidden=false},render};
})();
