/* Curated institution coordinates (WGS84); uncertain collections stay unpinned. */
(function(root){const venues=[
['palace','北京','故宫博物院',116.390833,39.916944,'https://www.dpm.org.cn/'],
['npm','台北','国立故宫博物院',121.5486,25.1022,'https://www.npm.gov.tw/'],
['liaoning','沈阳','辽宁省博物馆',123.454389,41.675806,'https://www.lnmuseum.com.cn/'],
['hunan','长沙','湖南博物院',112.987839,28.215261,'https://www.hnmuseum.com/'],
['beilin','西安','西安碑林博物馆',108.948056,34.256111,'https://www.beilin-museum.com/'],
['yin','安阳','殷墟博物馆',114.324375,36.120574,'https://www.yinxubwg.cn/yxgw/'],
['bronze','宝鸡','宝鸡青铜器博物院',107.193333,34.349167,'https://www.bjqtm.com/'],
['jiaoshan','镇江','焦山·瘗鹤铭遗存',119.47882,32.24038,''],
['longmen','洛阳','龙门石窟',112.469722,34.555556,'https://www.lmsk.org/'],
['longxing','正定','隆兴寺',114.576389,38.144167,''],
['jiucheng','麟游','九成宫醴泉铭碑',107.794,34.676,''],
['suzhou','苏州','苏州博物馆',120.623539,31.325139,'https://www.szmuseum.com/'],
['met','纽约','大都会艺术博物馆',-73.9631,40.7794,'https://www.metmuseum.org/'],
['ashmolean','牛津','阿什莫林博物馆',-1.26,51.7554,'https://www.ashmolean.org/'],
['british','伦敦','大英博物馆',-0.1269,51.5194,'https://www.britishmuseum.org/'],
['louvre','巴黎','卢浮宫',2.3358,48.8611,'https://www.louvre.fr/'],
['israel','耶路撒冷','以色列博物馆',35.2042,31.7725,'https://www.imj.org.il/'],
['trinity','都柏林','圣三一学院',-6.2577,53.3444,'https://www.tcd.ie/library/'],
['chester','都柏林','切斯特·比蒂图书馆',-6.267,53.342,'https://chesterbeatty.ie/'],
['bl','伦敦','大英图书馆',-.1275,51.5299,'https://www.bl.uk/'],
['lanting-site','绍兴','兰亭',120.586,29.915,''],
['sansu','眉山','三苏祠博物馆',103.831,30.041,'']
].map(([id,city,institution,lon,lat,url])=>({id,city,institution,lon,lat,url}));const ids={oracle:'yin',maogong:'npm',sanshi:'npm',hezun:'bronze',shigu:'palace',pingfu:'palace',lanting:'palace',zhangmenglong:'palace',mawangdui:'hunan',caoquan:'beilin',shengjiao:'beilin',yanqinli:'beilin',yihe:'jiaoshan',longmen:'longmen',longcang:'longxing',zhiyongqianzi:'npm',shupu:'npm',zixu:'npm',hanshi:'npm',shusu:'npm',chibi:'npm',gushi:'liaoning',caoshuqianzi:'liaoning',jiucheng:'jiucheng',tengwang:'suzhou','world-sumerian218':'met','world-gilgamesh218':'ashmolean','world-hammurabi218':'louvre'};
function venue(w){if(ids[w.id])return venues.find(v=>v.id===ids[w.id]);const text=[w.place,w.museum].join(' ');if(/台北|臺北|中国台北/.test(text)&&/故宫|故宮/.test(text))return venues.find(v=>v.id==='npm');return venues.find(v=>text.includes(v.institution)||v.id!=='npm'&&text.includes(v.city)&&text.includes(v.institution.replace(/博物馆|博物院|国立|省/g,'')))}
function venuesFor(w){return w.id==='world-gilgamesh218'?venues.filter(v=>['ashmolean','british'].includes(v.id)):[venue(w)].filter(Boolean)}
function label(w){const vs=venuesFor(w);return vs.length?vs.map(v=>v.city+' · '+v.institution).join(' / '):[w.place||'城市待核',w.museum||'机构待核'].join(' · ')}
function distance(a,b){const rad=Math.PI/180,dy=(b.lat-a.lat)*rad,dx=(b.lon-a.lon)*rad,q=Math.sin(dy/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dx/2)**2;return 6371*2*Math.atan2(Math.sqrt(q),Math.sqrt(Math.max(0,1-q)))}
function nearby(position,items=venues,radius=50){return items.filter(v=>Number.isFinite(v.lat)&&Number.isFinite(v.lon)).map(v=>({...v,distance:distance(position,v)})).filter(v=>v.distance<=radius).sort((a,b)=>a.distance-b.distance)}
function amap(v){if(!Number.isFinite(v.lon)||!Number.isFinite(v.lat))return '';return 'https://uri.amap.com/marker?'+new URLSearchParams({position:v.lon+','+v.lat,name:v.institution,coordinate:'wgs84',callnative:'1',src:'shoubi'})}
function navigation(v){return 'https://uri.amap.com/search?'+new URLSearchParams({keyword:[v.institution,v.address].filter(Boolean).join(' '),city:v.city,callnative:'1',src:'shoubi'})}
let placesFlight224;function loadPlaces224(){return placesFlight224||(placesFlight224=Promise.all(['calligraphy-places224.json?v=234','shanghai-heritage234.json?v=234'].map(path=>root.fetch(path).then(r=>{if(!r.ok)throw Error('文化点目录尚未加载');return r.json()}))).then(parts=>parts.flat()).then(rows=>{for(const row of rows){if(!row.id)continue;const match=venues.find(v=>v.id===row.id||[row.name,row.institution].filter(Boolean).includes(v.institution));if(match)Object.assign(match,{...row,id:match.id,url:row.source||row.url||match.url,institution:row.institution||row.name});else venues.push({...row,institution:row.institution||row.name,url:row.source||row.url||''})}return venues}).catch(()=>venues))}for(const v of venues){v.name=v.institution;v.country=['npm'].includes(v.id)?'中国':['met'].includes(v.id)?'美国':['ashmolean','british','bl'].includes(v.id)?'英国':['louvre'].includes(v.id)?'法国':['israel'].includes(v.id)?'以色列':['trinity','chester'].includes(v.id)?'爱尔兰':'中国';v.address=[v.country,v.city,v.institution].join(' · ')}
root.ArtLocations223={venues,venue,venuesFor,label,distance,nearby,amap,navigation,loadPlaces224};})(typeof window==='undefined'?globalThis:window);
