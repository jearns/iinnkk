/* City labels are used only where the site name or a curated entry identifies one. */
(function(){
 const byId={'813':'苏州','440':'敦煌','394':'威尼斯','252':'阿格拉','439':'北京、沈阳','881':'北京','1003':'洛阳'};
 const englishCities=[[/\bFlorence\b/i,'佛罗伦萨'],[/\bRome\b/i,'罗马'],[/\bParis\b/i,'巴黎'],[/\bPrague\b/i,'布拉格'],[/\bVienna\b/i,'维也纳'],[/\bLondon\b/i,'伦敦'],[/\bBerlin\b/i,'柏林'],[/\bLiverpool\b/i,'利物浦'],[/\bKyoto\b/i,'京都'],[/\bNara\b/i,'奈良'],[/\bBarcelona\b/i,'巴塞罗那'],[/\bGranada\b/i,'格拉纳达'],[/\bLisbon\b/i,'里斯本'],[/\bPorto\b/i,'波尔图']];
 const cities=['苏州','敦煌','威尼斯','阿格拉','北京','洛阳','大同','西安','拉萨','丽江','平遥','杭州','巴黎','凡尔赛','罗马','佛罗伦萨','雅典','伊斯坦布尔','京都','奈良','暹粒','吉萨','开罗','维也纳','布鲁塞尔','布拉格','柏林','伦敦','利物浦','爱丁堡','巴斯','牛津','剑桥','巴塞罗那','格拉纳达','塞维利亚','里斯本','波尔图','波茨坦','德累斯顿','慕尼黑','科隆','科尔多瓦','托莱多','萨拉曼卡','马拉喀什','非斯','南京','成都','重庆','武汉','澳门','泉州','厦门','安阳','曲阜','泰安','青岛','承德','沈阳','大理','景德镇','赣州','扬州','桂林','张家界'];
 function label(p){const country=String(p.country||p.family||'').trim(),full=String((window.HeritageSites102||[]).find(q=>'heritage102-'+q[0]===String(p.heritageId113||p.id||''))?.[1]||p.place||p.referencePlace||''),id=String(p.heritageId113||p.id||'').replace(/^heritage102-/,''),city=p.city||byId[id]||cities.find(name=>full.includes(name))||englishCities.find(([pattern])=>pattern.test(full))?.[1];return [country,city].filter(Boolean).join(' · ')||'文化遗产';}
 window.HeritageLocation116={label};
})();
