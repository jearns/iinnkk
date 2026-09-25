(function(root){
const presets={
 xuanhe:{name:'宫廷 · 宣和装意匠',ratio:.75,side:.11,top:.38,bottom:.24,mat:'#b4a483',edge:'#50482d',style:'xuanhe'},
 shaoxing:{name:'宫廷 · 绍兴装意匠',ratio:.75,side:.075,top:.30,bottom:.21,mat:'#c4bea4',edge:'#6d7262',style:'shaoxing'},
 qianlong:{name:'宫廷 · 乾隆内府意匠',ratio:.75,side:.15,top:.34,bottom:.25,mat:'#b99851',edge:'#533f26',style:'qianlong'},
 japanese:{name:'京都 · 榉木浮裱',ratio:.75,side:.16,top:.16,bottom:.24,mat:'#eee8d8',edge:'#9a7c59',style:'float'},
 nordic:{name:'北欧 · 白橡深盒',ratio:.75,side:.18,top:.16,bottom:.23,mat:'#f5f2e9',edge:'#c1a57d',style:'step'},
 bauhaus:{name:'包豪斯 · 几何构成',ratio:.75,side:.14,top:.14,bottom:.20,mat:'#e9e5d8',edge:'#282a29',style:'bauhaus'},
 bronze:{name:'纽约 · 古铜悬浮',ratio:.75,side:.10,top:.10,bottom:.17,mat:'#e2dbca',edge:'#796248',style:'bronze'},
 paris:{name:'巴黎 · 香槟拱廊',ratio:.75,side:.18,top:.22,bottom:.26,mat:'#eee4d2',edge:'#ae8b51',style:'paris'},
 song:{name:'宋韵 · 素绫双缘',ratio:.75,side:.13,top:.16,bottom:.2,mat:'#d8ceb9',edge:'#8f8067',style:'double'},
 ru:{name:'汝青 · 瓷色细边',ratio:.75,side:.09,top:.09,bottom:.13,mat:'#dbe5df',edge:'#698e8b',style:'inset'},
 walnut:{name:'乌木 · 悬浮窄框',ratio:.75,side:.08,top:.08,bottom:.08,mat:'#302b28',edge:'#181513',style:'float'},
 gallery:{name:'雪白 · 错层卡纸',ratio:.75,side:.17,top:.13,bottom:.24,mat:'#faf9f5',edge:'#bbb8b0',style:'step'},
 gold:{name:'香槟 · 细金画框',ratio:.75,side:.1,top:.1,bottom:.15,mat:'#f1e9d9',edge:'#ab8b50',style:'gold'},
 bare:{name:'素笺',ratio:.76,side:0,top:0,bottom:0,mat:'#f5f1e6',edge:'#f5f1e6',style:'bare'},
 silk:{name:'素绫立轴',ratio:.43,side:.085,top:.23,bottom:.16,mat:'#d1c8b2',edge:'#756953',style:'scroll'},
 square:{name:'美术馆 · 月白卡纸',ratio:1,side:.12,top:.12,bottom:.16,mat:'#f6f4ed',edge:'#b4ada0',style:'frame'},
 dark:{name:'墨线 · 细框留白',ratio:2.4,side:.10,top:.10,bottom:.14,mat:'#f2f0e9',edge:'#343632',style:'frame'},
 red:{name:'茶绫 · 长轴',ratio:.28,side:.10,top:.25,bottom:.19,mat:'#b9ab91',edge:'#736652',style:'scroll'},
 blue:{name:'青灰 · 册页',ratio:.76,side:.14,top:.15,bottom:.15,mat:'#a4aaa4',edge:'#626960',style:'album'}
};
function box(key,w,h){const p=presets[key]||presets.bare;return{x:w*p.side,y:w*p.top,width:w*(1+2*p.side),height:h+w*(p.top+p.bottom)}}
function draw(t,key,w,h){const p=presets[key]||presets.bare,b=box(key,w,h);t.fillStyle=p.mat;t.fillRect(0,0,b.width,b.height);if(key==='bare')return b;
 t.save();t.strokeStyle=p.edge;t.lineWidth=Math.max(.7,w*.004);t.strokeRect(t.lineWidth/2,t.lineWidth/2,b.width-t.lineWidth,b.height-t.lineWidth);
 t.lineWidth=Math.max(.5,w*.0015);t.strokeRect(b.x-w*.008,b.y-w*.008,w*1.016,h+w*.016);
 if(p.style==='scroll'){t.fillStyle=p.edge;const rail=w*.025;t.fillRect(0,0,b.width,rail);t.fillRect(0,b.height-rail,b.width,rail);}
 if(p.style==='album'){t.fillStyle=p.edge;for(let y=b.height*.12;y<b.height*.9;y+=w*.12)t.fillRect(w*.035,y,w*.04,w*.006)}
 if(p.style==='double'){t.lineWidth=w*.004;for(const d of [.035,.052])t.strokeRect(b.x-w*d,b.y-w*d,w*(1+2*d),h+w*2*d);}
 if(p.style==='inset'){t.fillStyle=p.edge;t.fillRect(0,0,b.width,w*.012);t.fillRect(0,b.height-w*.012,b.width,w*.012);t.lineWidth=w*.007;t.strokeRect(w*.025,w*.025,b.width-w*.05,b.height-w*.05);}
 if(p.style==='float'){t.fillStyle='#090807';t.fillRect(b.x-w*.018,b.y-w*.012,w*1.045,h+w*.045);t.strokeStyle='#746455';t.lineWidth=w*.006;t.strokeRect(w*.018,w*.018,b.width-w*.036,b.height-w*.036);}
 if(p.style==='step'){for(const [d,c] of [[.035,'#d7d5cf'],[.026,'#eeede8'],[.01,'#bab8af']]){t.strokeStyle=c;t.lineWidth=w*.008;t.strokeRect(b.x-w*d,b.y-w*d,w*(1+2*d),h+w*2*d);}}
 if(p.style==='gold'){for(const [d,c] of [[.008,'#876633'],[.015,'#e5c98c'],[.024,'#ad8c4c']]){t.strokeStyle=c;t.lineWidth=w*.006;t.strokeRect(w*d,w*d,b.width-w*d*2,b.height-w*d*2);}}
 if(['xuanhe','shaoxing','qianlong'].includes(p.style)){const silk=t.createLinearGradient(0,0,b.width,b.height);silk.addColorStop(0,p.mat);silk.addColorStop(.45,p.style==='qianlong'?'#d4b970':'#e1d6b9');silk.addColorStop(1,p.mat);t.fillStyle=silk;t.fillRect(0,0,b.width,b.height);t.strokeStyle=p.edge;t.lineWidth=w*.003;for(const d of [.012,.022])t.strokeRect(b.x-w*d,b.y-w*d,w*(1+2*d),h+w*2*d);t.save();t.globalAlpha=.14;t.lineWidth=w*.0008;for(let x=0;x<b.width;x+=w*.012){t.beginPath();t.moveTo(x,0);t.lineTo(x,b.height);t.stroke()}t.restore();const strips=p.style==='xuanhe'?3:p.style==='shaoxing'?2:4;for(let i=0;i<strips;i++){t.fillStyle=i%2?p.edge:'#d9c7a1';const y=b.y-w*(.025+i*.018);t.fillRect(b.x-w*.025,y,w*1.05,w*.006);t.fillRect(b.x-w*.025,b.y+h+w*(.015+i*.018),w*1.05,w*.006)}t.fillStyle=p.edge;for(const y of [w*.01,b.height-w*.025])t.fillRect(0,y,b.width,w*.02);for(const x of [b.width*.36,b.width*.64])t.fillRect(x,w*.015,w*.013,w*.14);if(p.style==='qianlong'){t.strokeStyle='#8b692f';t.lineWidth=w*.003;for(const x of [w*.055,b.width-w*.055])for(let y=w*.12;y<b.height-w*.06;y+=w*.12){t.beginPath();t.moveTo(x,y-w*.035);t.lineTo(x+w*.022,y);t.lineTo(x,y+w*.035);t.lineTo(x-w*.022,y);t.closePath();t.stroke()}}}
 if(p.style==='bauhaus'){t.fillStyle='#a63f30';t.fillRect(w*.015,w*.015,w*.055,b.height-w*.03);t.fillStyle='#bd9c41';t.fillRect(b.width-w*.12,b.height-w*.08,w*.09,w*.05);t.strokeStyle='#242724';t.lineWidth=w*.009;t.strokeRect(b.x-w*.025,b.y-w*.025,w*1.05,h+w*.05)}
 if(p.style==='bronze'||p.style==='paris'){for(const [d,c]of [[.01,'#624d35'],[.02,'#d0b97d'],[.03,'#8c734b']]){t.strokeStyle=c;t.lineWidth=w*.007;t.strokeRect(w*d,w*d,b.width-w*d*2,b.height-w*d*2)}if(p.style==='paris'){t.strokeStyle='#baa272';t.lineWidth=w*.002;t.strokeRect(b.x-w*.055,b.y-w*.055,w*1.11,h+w*.11)}}
 t.restore();return b;
}
root.Mounting={presets,box,draw};if(typeof module!=='undefined')module.exports=root.Mounting;
})(typeof globalThis!=='undefined'?globalThis:this);
