(function init(){if(!window.Revision90?.ready){setTimeout(init,60);return}
const $=id=>document.getElementById(id),A=AnnotationApp;
const actions=document.querySelector('#previewEffects55 .previewActions56');if(actions){actions.classList.add('previewActions93');actions.hidden=false;actions.removeAttribute('aria-hidden');for(const button of actions.querySelectorAll('button')){button.tabIndex=0;button.classList.remove('primary')}for(const id of ['previewRandom79','previewReset73','returnWriting59','generateArtwork59'])if($(id))actions.append($(id));$('previewEffects55').append(actions)}
// Arrange controls inside their panel, then let its ResizeObserver reserve only actual height.
if(actions){const panel=$('previewEffects55');const place=()=>{if(actions.parentElement!==panel||panel.lastElementChild!==actions)panel.append(actions)};new MutationObserver(place).observe(panel,{childList:true,subtree:true});place()}
const left=$('writerLeft90');if(left){left.prepend($('topAddPaper90'));left.prepend($('topQuotes'))}
const swatches={
 中国:[['中国红黄紫','#b6232d','#ffe49a','#6b347a'],['中国红与墨','#f5ead5','#201b19','#b52f2b']],
 法国:[['法国蓝白红','#163d7e','#f8fafb','#e63946']],英国:[['英国旗色','#172952','#f6f3ee','#c93444']],美国:[['美国旗色','#f4f0e8','#233968','#bd3441']],日本:[['日本朱白','#f6f3ec','#342329','#c8393b']],意大利:[['意大利旗色','#174e39','#f3f2e9','#c94541']],西班牙:[['西班牙红金','#922831','#ffe3a3','#eea52d']],
 唐:[['唐三彩','#dfb675','#173f34','#8f4324']],宋:[['宋代天青','#adc9c3','#183c41','#a84535'],['青绿山水','#143f43','#d8dfbd','#e4a35b']],
 universal:[['橙色皮革灵感','#e87722','#201c18','#f4e4c6'],['棕金旅行灵感','#47352c','#efdcad','#b0693d'],['珠宝蓝灵感','#81d8d0','#113c3c','#ac483c'],['莫兰迪灰粉','#d2c8c6','#493f4a','#856d64'],['印象派睡莲','#365b69','#eee3cf','#d790a0'],['梵高星夜','#1b345c','#f4da76','#4f9aaf'],['当代柔白','#f0eee9','#263a47','#dca574']]
};
function rgb(hex){return hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255)}function luminance(hex){const c=rgb(hex).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]}function contrast(a,b){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
function hsl(h,s,l){const a=s*Math.min(l,100-l)/100,f=n=>{const k=(n+h/30)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1))};return '#'+[0,8,4].map(n=>Math.round(255*f(n)/100).toString(16).padStart(2,'0')).join('')}
let lastPalette='';function palette(){const q=window.currentQuote||{},era=q.dynasty||q.era||'',priority=[...(swatches[q.country]||[]),...(swatches[/唐/.test(era)?'唐':/宋/.test(era)?'宋':'']||[])];const pool=Math.random()<.65&&priority.length?priority:swatches.universal;let entry=pool[Math.floor(Math.random()*pool.length)];let [name,paper,ink,seal]=entry;if(Math.random()<.4){const h=Math.random()*360,dark=Math.random()<.45;paper=hsl(h,15+Math.random()*60,dark?8+Math.random()*24:68+Math.random()*28);ink=hsl(h+140+Math.random()*160,25+Math.random()*60,dark?90:9);seal=hsl(h+70,65,dark?68:35);name='自定义色谱'}if(contrast(paper,ink)<4.5)ink=contrast(paper,'#000000')>contrast(paper,'#ffffff')?'#000000':'#ffffff';if(contrast(paper,seal)<2)seal=luminance(paper)>.2?'#9d2433':'#ffc878';const p={paper,ink,seal,name};if(paper+'|'+ink===lastPalette){p.paper=hsl(Math.random()*360,25,92);p.ink='#182b35';p.name='自定义色谱'}lastPalette=p.paper+'|'+p.ink;return p}
const random=$('previewRandom79');if(random)random.onclick=()=>{const p=palette();Revision88.applyPalette(p);A.toast('配色 · '+p.name)};
document.addEventListener('quote-changed',()=>Revision88.applyPalette(palette()));
window.Revision93={ready:true,palette,contrast,swatches};
})();
