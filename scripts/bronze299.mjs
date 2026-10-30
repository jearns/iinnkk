import fs from'node:fs';import vm from'node:vm';
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('calligraphy-rank-data183.js','utf8'),ctx);const r=ctx.window.CalligraphyRanks183,manifest=JSON.parse(fs.readFileSync('timeline/manifest.json','utf8')),data=JSON.parse(fs.readFileSync('release299/calendar-data.json','utf8'));
const rows=[
['maogong','毛公鼎','台北故宫博物院','台北','约公元前9—前8世纪','https://digitalarchive.npm.gov.tw/opendata/Pub/Detail/1438?dep=U&mode=full','西周册命长篇铭文的代表，以庄重章法保存王命、政治理想与文字艺术。','行列端整，字形凝重；适合比较西周晚期金文的秩序与书写意味。'],
['sanshi','散氏盘','台北故宫博物院','台北','西周晚期','https://digitalarchive.npm.gov.tw/opendata/Pub/Detail/1462?dep=U&mode=full','以土地交割与盟誓的记录留存社会生活，字势朴拙而富有欹侧变化。','将文字作为契约与见证；观察横向舒展、错落自然的结体。'],
['bronze-dayu299','大盂鼎','中国国家博物馆','北京','西周康王时期','https://www.chnmuseum.cn/zp/zpml/csp/202008/t20200826_247375.shtml','西周早期册命铭文的重器，以雄浑文字连接历史训诰与国家礼制。','结体庄严而保留早期金文的变化，可与毛公鼎对读。',['dayu-photo','dayu']],
['bronze-dake299','大克鼎','上海博物馆','上海','约公元前10世纪末','https://www.shanghaimuseum.net/mu/frontend/pg/m/article/id/CI00000656','长篇册命铭文将祖先记忆与官职授命相接，是西周金文的重要范本。','从规整行款与文字组织，认识礼制记录与书法章法的联系。',['dake']],
['bronze-guoji299','虢季子白盘','中国国家博物馆','北京','西周宣王时期','https://www.chnmuseum.cn/zp/zpml/csp/202008/t20200826_247376.shtml','铭辞富有诗意，修长匀称的字形展现西周晚期金文清朗的一面。','比较四言韵语与疏朗布局，体会铸铭的文辞与线条之美。',['guoji-photo','guoji']],
['hezun','何尊','宝鸡青铜器博物院','宝鸡','约公元前11世纪','https://www.bjqtm.com/dczp/qtq/何尊等五组周代有铭青铜器成功入选《中国档','“宅兹中国”的铭文，为早期国家观念与成周营建留下重要实物线索。','从器内铭文认识字形、制度与历史叙述的相互联系。'],
['bronze-qiang299','史墙盘','宝鸡周原博物院','宝鸡扶风','西周中期','https://www.chnmuseum.cn/zl/zlhg/201812/t20181220_32314.shtml','把王朝史与家族史编织在一篇铭文中，是西周书写记忆的重要见证。','行列与文字组织见出成熟的章法，读文字也读记录者的历史意识。',['qiang']],
['bronze-lai299','逨盘','宝鸡青铜器博物院','宝鸡','西周晚期','https://www.cdmuseum.com/xinwen/202011/1853.html','以家族数代辅佐周王的叙述保存世系与政事，是青铜器上的长篇史书。','在长篇铭文拓片中观察均衡的行列、曲线与字间呼应。',['lai']],
['bronze-li299','利簋','中国国家博物馆','北京','西周武王时期','https://www.chnmuseum.cn/zp/zpml/kgfjp/202108/t20210802_250931.shtml','短篇铭文记录武王征商，为古代史与传世文献之间提供实物参照。','字数虽少而史意深厚，适合认识早期金文的字形与记录功能。',['li-photo','li']],
['bronze-zongzhou299','宗周钟','台北故宫博物院','台北','西周晚期','https://digitalarchive.npm.gov.tw/opendata/Pub/Detail/1464?dep=U&mode=full','将铭文铸于礼乐重器，文字、器形与声音共同保存周代文化的记忆。','又称㝬钟；将钟体与铭文位置合看，认识礼乐器铭的空间。',['zongzhou']]
];
for(const[id,title,museum,place,dateLabel,url,milestone,description,images]of rows){const old=manifest.entries[id],pages=images?.map(k=>'release299/bronze/'+k+'.webp')||old.pages;
const w={...(old||{}),id,title,museum,place,dateLabel,url,milestone,description,author:'书者佚名',era:'西周',year:old?.year||-900,script:'金文',cover143:images?pages[0]:old.cover143,pages,pageNames:images?.map(k=>k==='lai'?'铭文拓片':['li','dayu','guoji'].includes(k)?'馆方排印释文（非拓本）':'原器图（非拓本）')||old.pageNames,style:'ouyang',size:320,zoom:170,fullText148:old?.fullText148||'',imageCredit247:images?'馆藏与图像来源见机构资料链接。原器照片、拓片、排印释文分开标示；不把排印字当作原始金文。':old.imageCredit247,textStatus183:'释读以馆方著录为准；原器、拓片与排印释文不是同一种图像。'};
const i=r.works.findIndex(x=>x.id===id);if(i<0)r.works.push(w);else r.works[i]=w;
if(images)manifest.entries[id]={...w,deleted:false};
if(!data.works.some(w=>w.id===id))data.works.push({id,title,author:'书者佚名',url,isPerson:false,term:'冬至',reason:'在岁序转换之时读青铜铭文，观察礼制、记忆与汉字结构的演进。'});
const e=data.events.find(e=>e.rule.term==='冬至');if(!e.works.includes(id))e.works.push(id);
}
const oracle=r.lists.find(l=>l.id==='oracle10-298');oracle.title='十大甲骨';r.lists=r.lists.filter(l=>!['oracle10-298','bronze10-299'].includes(l.id));const i=r.lists.findIndex(l=>l.id==='seal10');r.lists.splice(i,0,oracle,{id:'bronze10-299',title:'十大金文',description:'本站策展推荐；以文字史、铭辞、书法及文化价值选取，不是公认唯一排名。',works:rows.map(r=>r[0])});r.release299=true;
fs.writeFileSync('calligraphy-rank-data183.js','window.CalligraphyRanks183='+JSON.stringify(r)+';\n');fs.writeFileSync('timeline/manifest.json',JSON.stringify(manifest,null,2)+'\n');fs.writeFileSync('release299/calendar-data.json',JSON.stringify(data,null,2)+'\n');fs.writeFileSync('release299/bronze-sources.json',JSON.stringify(rows.map(([id,title,museum,place,dateLabel,url,milestone,description,images])=>({id,title,museum,url,images:images?.map(k=>'release299/bronze/'+k+'.webp')||manifest.entries[id].pages})),null,2)+'\n');
console.log('Bronze classics:',rows.length,'; all ranked works:',data.works.length);
