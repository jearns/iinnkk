/* One restrained visual language for the live folio and its high-resolution export. */
(function(root){const ranks=['青铜','白银','黄金','白金','钻石','星耀','宗师','王者','荣耀王者'],metals=['#92704d','#74848d','#aa873e','#718e83','#668a9c','#797ca0','#9e594b','#586d86','#a78443'];
const motifs={
'电影':'M4 7h24v22H4zM4 7l3-5h24l-3 5M9 2l-3 5M17 2l-3 5M25 2l-3 5M13 13l9 5-9 5z',
'长征':'M1 26l9-17 7 12 5-18 9 23M4 29c9-12 16 7 24-13M11 23l3-2m5 4l3-2',
'三体':'M3 16c0-7 26-7 26 0s-26 7-26 0M16 3c7 0 7 26 0 26S9 3 16 3M16 14v4m-2-2h4',
'南渡北归':'M3 6l12 3 14-3v20l-14 3-12-3zM15 9v20M6 12l6 2m-6 3l6 2m6-5l8-2m-8 7l8-2',
'猫武士':'M10 22c-8-12 20-12 12 0-2 6-4 0-6 0s-4 6-6 0M8 10c-4 1-6-9-2-9s6 8 2 9M14 8c-4 0-4-9 0-9s4 9 0 9M21 10c-4-1-2-10 2-9s2 10-2 9M27 16c-4-2 0-10 3-8s1 10-3 8',
'西游记':'M1 27l9-16 7 16 7-12 7 12M4 8c-6-8 10-9 10-3 12-6 18 5 7 5H4',
'三国演义':'M16 28L2 11Q16-1 30 11zM16 28L8 7m8 21V4m0 24L24 7',
'军事武器':'M1 18l13-5V4l2-3 2 3v9l13 5-13-1v8l5 3H9l5-3v-8z',
'文字':'M5 5h22v22H5zM10 10h12m-6 0v12m-6-6h12',
'书法':'M4 28l7-4L27 4l-4-3L8 22zM8 22l3 2M3 30h26',
'诗词歌赋':'M4 5h24v23H4zM9 10h14M9 15h14M9 20h8',
'文学':'M3 5l13 4 13-4v22l-13 3-13-3zM16 9v21M7 12l5 2m8 0l5-2',
'艺术':'M16 3C1 1-5 24 11 28c8 3 2-9 7-8 17 4 19-15-2-17M9 10h1m7-3h1m6 5h1M5 17h1',
'历史':'M5 4h22M8 4c0 10 8 12 8 12s8-2 8-12M8 28c0-10 8-12 8-12s8 2 8 12M5 28h22',
'音乐':'M12 24V7l15-4v18M12 7l15-4M12 14l15-4M12 24c0 6-10 6-10 1s10-6 10-1M27 21c0 6-10 6-10 1s10-6 10-1',
'科学':'M10 3h12m-9 0v10L4 27h24L19 13V3M9 20h14',
'技术':'M6 7h20v18H6zM11 12h10v8H11zM11 2v5m10-5v5M11 25v5m10-5v5M1 12h5m-5 8h5M26 12h5m-5 8h5',
'世界文化遗产':'M2 12l14-9 14 9zM5 14v12m7-12v12m8-12v12m7-12v12M2 28h28'};
const star='M16 2l4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1z',diamond='M16 2l14 14-14 14L2 16zM2 16h28M16 2L9 16l7 14 7-14z';
function badge(t){return t===4?diamond:t===5?star:t>=7?'M3 9l7 7 6-12 6 12 7-7-4 18H7zM7 23h18':t===6?'M8 3h16v26H8zM11 9h10m-10 7h10m-10 7h10':t===1?'M16 3L3 16l13 13 13-13zM16 7L7 16l9 9 9-9z':t===3?'M16 2l12 7v14l-12 7-12-7V9zM16 8l7 4v8l-7 4-7-4v-8z':t===2?'M16 2l14 14-14 14L2 16zM16 7v18M7 16h18':'M4 4h24v24H4zM8 8h8v8H8v8h16v-8h-4V8h4'}
function svg(path){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="'+path+'" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/></svg>'}
function apply(theme,tier){document.body.dataset.rank251=tier;document.documentElement.style.setProperty('--rank251',metals[tier]);const paper=document.querySelector('.gamePaper244');paper.dataset.folio251=theme;let label=paper.querySelector('.rankMedal251');if(!label){label=document.createElement('div');label.className='rankMedal251';paper.querySelector('.paperHeading244').before(label)}label.innerHTML='<span class="themeMotif251">'+svg(motifs[theme]||motifs['文学'])+'</span><span class="rankName251">'+svg(badge(tier))+'<b>'+ranks[tier]+'</b><small>'+String(tier+1).padStart(2,'0')+' / 09</small></span>';}
function path(c,d,x,y,size){if(!root.Path2D)return;c.save();c.translate(x,y);c.scale(size/32,size/32);c.lineWidth=1.1;c.stroke(new root.Path2D(d));c.restore()}
function draw(c,w,h,theme,tier,colour){c.save();c.strokeStyle=colour.meta;c.globalAlpha=.25;c.lineWidth=1;c.strokeRect(34,34,w-68,h-68);for(const [x,y,sx,sy]of [[42,42,1,1],[w-42,42,-1,1],[42,h-42,1,-1],[w-42,h-42,-1,-1]]){c.save();c.translate(x,y);c.scale(sx,sy);c.beginPath();c.moveTo(0,22);c.lineTo(0,0);c.lineTo(22,0);c.moveTo(6,15);c.lineTo(6,6);c.lineTo(15,6);c.stroke();c.restore()}c.globalAlpha=.7;c.strokeStyle=metals[tier];path(c,motifs[theme]||motifs['文学'],w/2-80,h-78,30);path(c,badge(tier),w/2-32,h-76,24);c.fillStyle=colour.meta;c.font='11px serif';c.fillText(ranks[tier]+'  ·  '+String(tier+1).padStart(2,'0')+' / 09',w/2+3,h-59);c.restore()}
root.GameDesign251={apply,draw,ranks,metals,motifs,badge};})(window);
