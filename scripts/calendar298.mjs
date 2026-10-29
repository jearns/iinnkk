/* Curated dates are deliberately separate from editorial seasonal associations. */
import fs from 'node:fs';import vm from 'node:vm';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,d)=>fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('calligraphy-rank-data183.js','utf8'),ctx);const ranks=ctx.window.CalligraphyRanks183;
const guobo='https://www.chnmuseum.cn/portals/0/web/zt/20191022jiagu/',sinica='https://museum.sinica.edu.tw/exhibitions/21/';
const oracle=[
['sacrifice','祭祀刻辞龟甲','祭','祭祀文字把商代信仰与王室世系保存为可考的实物证据。','以龟腹甲上的契刻观察字形、行列与占卜记录的关系。',guobo,'中国国家博物馆'],
['tufang','土方征涂朱卜骨刻辞','征','涂朱刻辞让早期战争记录与雄健的契刻书风一同留存。','从商代方国关系的记录，体会刀刻线条与朱色字口的力量。',guobo,'中国国家博物馆'],
['ban','般无咎全甲刻辞','卜','完整龟甲呈现卜兆与刻辞的布局，是理解甲骨章法的直观材料。','不只看单字，也看文字如何围绕卜兆安排空间。',guobo,'中国国家博物馆'],
['qiang','小臣墙记事刻辞','记','记事刻辞把个人经历与王朝活动带入早期文字的叙事。','把甲骨作为记录历史的载体，观察记事文字的组织方式。',guobo,'中国国家博物馆'],
['zaifeng','宰丰骨匕记事刻辞','丰','器物装饰与记事文字相互映照，展示甲骨文字超出占卜的用途。','以骨匕上的刻写，认识记事、赏赐与器物工艺之间的联系。',guobo,'中国国家博物馆'],
['farming','众人协田卜骨刻辞','田','有关协力耕作的刻辞，为认识商代农业和社会组织提供实物线索。','从农事记录读古人的劳作，也留意简洁字形中的象形意味。',guobo,'中国国家博物馆'],
['zhou','西周卦画卜骨','卦','卦画卜骨把观察视野从殷商延伸至周代的占卜与符号传统。','此件为西周材料；与殷墟甲骨并观，分辨时代与符号形态。',guobo,'中国国家博物馆'],
['fuhao','妇好分娩卜辞《丙》247','好','关于妇好分娩的占卜，让三千年前具体人物的生活进入历史。','武丁时期的龟腹甲记录对妇好分娩的询问，兼具文字史与人物史价值。',sinica,'中央研究院历史语言研究所'],
['brush','带朱书龟甲卜辞《乙》0778','雨','保留下来的朱书笔迹，为理解契刻以前的毛笔书写提供线索。','以求问雨水的朱书材料，观察早期汉字真实的书写痕迹。',sinica,'中央研究院历史语言研究所'],
['harvest','填朱卜辞龟腹甲《乙》0867','年','正反两面设问收成的卜辞，展示早期记录的逻辑与填朱字形。','围绕收成年景的对贞卜辞，适合比较同一语境中的字形与布局。',sinica,'中央研究院历史语言研究所']
].map(([key,title,glyph,milestone,description,url,museum])=>({id:`oracle-${key}298`,title,glyph,milestone,description,url,museum,author:'书者佚名',era:key==='zhou'?'西周':'殷商',year:key==='zhou'?-1000:-1250,dateLabel:key==='zhou'?'西周；具体年代依馆方研究':'商代晚期；具体分期依馆方研究',script:'甲骨文',place:museum==='中国国家博物馆'?'北京':'台北',cover143:`release298/oracle/oracle-${key}298.webp`,pages:[`release298/oracle/oracle-${key}298.webp`],pageNames:[title],style:'ouyang',size:320,zoom:170,imageCredit247:`图像与资料：${museum}；原图来源见资料链接。`,textStatus183:'单件实物；释读以馆方著录为准，不补造缺字。',fullText148:''}));
for(const w of oracle){const i=ranks.works.findIndex(x=>x.id===w.id);if(i<0)ranks.works.push(w);else ranks.works[i]=w}
const list={id:'oracle10-298',title:'十大甲骨经典',works:oracle.map(x=>x.id),note186:'本站从馆藏与甲骨专题展中精选十件，含殷商刻辞、朱书与西周卦画，按观察主题编排。非官方高下排名；各件年代与释读以来源机构说明为准。'};const at=ranks.lists.findIndex(x=>x.id===list.id);if(at<0)ranks.lists.splice(2,0,list);else ranks.lists[at]=list;ranks.release298=true;
fs.writeFileSync('calligraphy-rank-data183.js','window.CalligraphyRanks183='+JSON.stringify(ranks)+';\n');
const manifest=read('timeline/manifest.json');for(const w of oracle)manifest.entries[w.id]={...w,deleted:false};write('timeline/manifest.json',manifest);
const termRows=[
['小寒','江雪','柳宗元','千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。','kuaixue','以雪景中的留白，感受尺牍疏密。'],
['大寒','竹石','郑燮','咬定青山不放松，立根原在破岩中。千磨万击还坚劲，任尔东西南北风。','chenghuang','从岁寒气节读郑板桥的笔意。'],
['立春','咏柳','贺知章','碧玉妆成一树高，万条垂下绿丝绦。不知细叶谁裁出，二月春风似剪刀。','lanting','以春意开启文人雅集与行书的阅读。'],
['雨水','春夜喜雨','杜甫','好雨知时节，当春乃发生。随风潜入夜，润物细无声。','oracle-brush298','从雨水与农事，追寻最早的朱书笔迹。'],
['惊蛰','观田家（节选）','韦应物','微雨众卉新，一雷惊蛰始。田家几日闲，耕种从此起。','oracle-farming298','把春耕诗与协田刻辞放在一起读。'],
['春分','鸟鸣涧','王维','人闲桂花落，夜静春山空。月出惊山鸟，时鸣春涧中。','shupu','于春分静观草书线条的节奏。'],
['清明','清明','杜牧','清明时节雨纷纷，路上行人欲断魂。借问酒家何处有？牧童遥指杏花村。','jizhi','追思时节，体会祭文中的亲情与悲悯。'],
['谷雨','游山西村（节选）','陆游','莫笑农家腊酒浑，丰年留客足鸡豚。山重水复疑无路，柳暗花明又一村。','oracle-harvest298','从丰年之愿读古今农事。'],
['立夏','山亭夏日','高骈','绿树阴浓夏日长，楼台倒影入池塘。水晶帘动微风起，满架蔷薇一院香。','huangting','夏日静写小楷，观察均衡与留白。'],
['小满','观刈麦（节选）','白居易','田家少闲月，五月人倍忙。夜来南风起，小麦覆陇黄。','oracle-farming298','以麦田诗意重读早期农耕文字。'],
['芒种','悯农二首·其一','李绅','春种一粒粟，秋收万颗子。四海无闲田，农夫犹饿死。','oracle-harvest298','丰收祈愿与民生诗意相互对读。'],
['夏至','晓出净慈寺送林子方','杨万里','毕竟西湖六月中，风光不与四时同。接天莲叶无穷碧，映日荷花别样红。','luoshen13','借水光与荷影读飘逸精细的小楷。'],
['小暑','小池','杨万里','泉眼无声惜细流，树阴照水爱晴柔。小荷才露尖尖角，早有蜻蜓立上头。','boyuan','以短篇诗文和尺牍，练习小中见大。'],
['大暑','夏日山中','李白','懒摇白羽扇，裸袒青林中。脱巾挂石壁，露顶洒松风。','zixu','在暑日体会草书的纵逸。'],
['立秋','秋词·其一','刘禹锡','自古逢秋悲寂寥，我言秋日胜春朝。晴空一鹤排云上，便引诗情到碧霄。','zhanghan','秋风起时读思鲈旧事。'],
['处暑','山居秋暝（节选）','王维','空山新雨后，天气晚来秋。明月松间照，清泉石上流。','songfeng','把山中秋意与松风书卷并读。'],
['白露','月夜忆舍弟（节选）','杜甫','戍鼓断人行，边秋一雁声。露从今夜白，月是故乡明。','jizhi','从思亲之诗体会祭文的真情。'],
['秋分','望洞庭','刘禹锡','湖光秋月两相和，潭面无风镜未磨。遥望洞庭山水翠，白银盘里一青螺。','chibi','以秋水明月遥应赤壁诗文。'],
['寒露','山行','杜牧','远上寒山石径斜，白云生处有人家。停车坐爱枫林晚，霜叶红于二月花。','shusu','登高赏秋，也读米芾的诗与行书。'],
['霜降','枫桥夜泊','张继','月落乌啼霜满天，江枫渔火对愁眠。姑苏城外寒山寺，夜半钟声到客船。','songfeng','从秋夜声景感受行书的起伏。'],
['立冬','逢雪宿芙蓉山主人','刘长卿','日暮苍山远，天寒白屋贫。柴门闻犬吠，风雪夜归人。','kuaixue','入冬读雪，以短札体会问候之情。'],
['小雪','问刘十九','白居易','绿蚁新醅酒，红泥小火炉。晚来天欲雪，能饮一杯无？','boyuan','以相邀之诗，写朋友之间的温暖。'],
['大雪','夜雪','白居易','已讶衾枕冷，复见窗户明。夜深知雪重，时闻折竹声。','kuaixue','以雪夜诗和快雪尺牍感受动静相生。'],
['冬至','邯郸冬至夜思家','白居易','邯郸驿里逢冬至，抱膝灯前影伴身。想得家中夜深坐，还应说着远行人。','zhongqiu','借节令思亲，读尺牍里的牵挂。']
];
const poems={};for(const [term,title,author,text] of termRows)poems[term]={id:'term-'+term,title,author,text,url:'https://ctext.org/poetry/zh'};
const terms=termRows.map(([term,title,author,text,work,reason])=>({id:'term-'+term,title:term,kind:'seasonal',rule:{term},reason,works:[work],poem:poems[term],source:'https://www.hko.gov.hk/sc/gts/time/conversion.htm'}));
const festive=[
['spring','春节',1,1,'新岁临写，寄愿四时安康。','caoshuqianzi','元日','王安石','爆竹声中一岁除，春风送暖入屠苏。千门万户曈曈日，总把新桃换旧符。'],
['lantern','元宵',1,15,'灯火与人间相逢，适合写一阕春夜词。','lanting','青玉案·元夕（节选）','辛弃疾','东风夜放花千树。更吹落、星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。'],
['shangsi','上巳',3,3,'春禊雅集，循古人的曲水流觞重读兰亭。','lanting'],
['dragon','端午',5,5,'由端午追怀屈原，把求索与坚守写在纸上。','shupu','离骚（节选）','屈原','路漫漫其修远兮，吾将上下而求索。'],
['qixi','七夕',7,7,'借星河与相逢，写一阕温柔而辽阔的词。','luoshen13','鹊桥仙·纤云弄巧（节选）','秦观','金风玉露一相逢，便胜却人间无数。两情若是久长时，又岂在朝朝暮暮。'],
['ghost','中元',7,15,'追思与记忆，适合静读祭文中的亲情。','jizhi','游子吟','孟郊','慈母手中线，游子身上衣。临行密密缝，意恐迟迟归。谁言寸草心，报得三春晖。'],
['moon','中秋',8,15,'以月色与尺牍寄相思。','zhongqiu','水调歌头·明月几时有（节选）','苏轼','但愿人长久，千里共婵娟。'],
['double9','重阳',9,9,'登高怀远，借书写问候远方的人。','shusu','九月九日忆山东兄弟','王维','独在异乡为异客，每逢佳节倍思亲。遥知兄弟登高处，遍插茱萸少一人。'],
['winterclothes','寒衣节',10,1,'以思亲之诗寄托对故人的记忆。','jizhi','月夜忆舍弟（节选）','杜甫','露从今夜白，月是故乡明。'],
['lower','下元',10,15,'静观江月，遥应后赤壁的夜游。','chibi'],
['laba','腊八',12,8,'岁末静写，留一份平实而温暖的心意。','zhao-xinjing','问刘十九','白居易','绿蚁新醅酒，红泥小火炉。晚来天欲雪，能饮一杯无？'],
['north','小年（北方习俗）',12,23,'扫尘迎新，写下对团聚的期待。','caoshuqianzi','元日','王安石','爆竹声中一岁除，春风送暖入屠苏。'],
['south','小年（南方部分地区习俗）',12,24,'各地小年日期不同，借书写迎新纳福。','caoshuqianzi','元日','王安石','千门万户曈曈日，总把新桃换旧符。']
].map(([id,title,month,day,reason,work,pt,pa,text])=>({id:'festival-'+id,title,kind:'festival',rule:{lunar:[month,day]},reason,works:[work],...(pt?{poem:{id:'festival-'+id,title:pt,author:pa,text,url:'https://ctext.org/poetry/zh'}}:{}),source:'https://www.gov.cn/guoqing/2017-06/09/content_5201202.htm'}));
festive.push({id:'festival-eve',title:'除夕',kind:'festival',rule:{newYearEve:true},reason:'在一年的最后一晚，写一行向新岁出发的心愿。',works:['caoshuqianzi'],poem:{id:'eve',title:'除夜作',author:'高适',text:'旅馆寒灯独不眠，客心何事转凄然。故乡今夜思千里，霜鬓明朝又一年。'},source:'https://www.hko.gov.hk/sc/gts/time/conversion.htm'}, {id:'festival-hanshi',title:'寒食',kind:'festival',rule:{beforeTerm:['清明',1]},reason:'按今行清明前一日纪念寒食，古代节期存在差异；并非《寒食帖》创作的精确公历日期。',works:['hanshi'],source:'https://www.dpm.org.cn/lemmas/242596.html'});
const historical=[
{id:'lanting353',title:'兰亭修禊',kind:'documented',rule:{lunar:[3,3]},year:353,reason:'永和九年三月三日，王羲之与友人在兰亭修禊作序。按农历三月三纪念，不固定成某个公历日。',works:['lanting'],source:'https://www.dpm.org.cn/collection/handwriting/228277.html'},
{id:'chibi1082',title:'苏轼夜游赤壁',kind:'documented',rule:{lunar:[7,16]},year:1082,reason:'《前赤壁赋》自记“壬戌之秋，七月既望”。按农历七月十六纪念这次江上夜游。',works:['chibi'],source:'https://digitalarchive.npm.gov.tw/opendata/Pub/Detail/373?dep=P&mode=full'},
{id:'chibi-later1082',title:'后赤壁夜游',kind:'documented',rule:{lunar:[10,15]},year:1082,reason:'《后赤壁赋》自记“是岁十月之望”。按农历十月十五重读江月与人生。',works:['chibi'],source:'https://digitalarchive.npm.gov.tw/opendata/Pub/Detail/373?dep=P&mode=full'},
{id:'su-birth',title:'苏轼诞辰',kind:'birth',rule:{lunar:[12,19]},year:1036,reason:'景祐三年十二月十九，后世寿苏雅集沿用农历纪念。诞辰年数按农历纪年相减；对应公历出生年为1037年。',works:['hanshi','chibi','gongfu','lizi','zuiweng','suxian'],source:'https://www.chinawriter.com.cn/n1/2025/0120/c442005-40405544.html'},
{id:'zhao-birth',title:'赵孟頫诞辰',kind:'birth',rule:{lunar:[9,10]},year:1254,reason:'故宫大事年表记宝祐二年九月十日出生；按农历九月十日纪念。',works:ranks.works.filter(w=>/赵孟頫/.test(w.author)).map(w=>w.id),source:'https://www.dpm.org.cn/subject_zhaomengfu/event.html'},
{id:'yan758',title:'颜真卿祭侄',kind:'documented',rule:{lunar:[9,3]},year:758,reason:'稿首自记乾元元年九月三日，循农历日期读未加修饰的亲情与悲愤。',works:['jizhi'],source:'https://digitalarchive.npm.gov.tw/Collection/Detail/27275?dep=P'},
{id:'zhao-death',title:'赵孟頫逝世纪念',kind:'death',rule:{lunar:[6,16]},year:1322,reason:'故宫大事年表记至治二年六月十六日卒于家；按农历日期纪念，重读晋唐传统在元代的回响。',works:ranks.works.filter(w=>/赵孟頫/.test(w.author)).map(w=>w.id),source:'https://www.dpm.org.cn/subject_zhaomengfu/event.html'},
{id:'oracle-memory',title:'甲骨入选世界记忆名录纪念',kind:'documented',rule:{solar:[10,30]},year:2017,reason:'以甲骨文走向世界的当代记忆，回望汉字的早期形态。',works:['oracle',...oracle.map(w=>w.id)],source:'https://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/moe_1485/201712/t20171227_322958.html'}
];
// All ranking entries get a visible, meaningful seasonal invitation, never a fabricated birthday.
const used=new Set(ranks.lists.flatMap(l=>[...l.works,...(l.extraWorks186||[])]));const all=[...ranks.works,...ranks.people246].filter(w=>used.has(w.id));
function association(w){let term,reason;
const name=w.title+' '+(w.author||'');
if(/甲骨|卜辞|卜骨|龟甲|骨匕/.test(name)){term=/雨|朱书/.test(name)?'雨水':/田|收|年/.test(name)?'芒种':'谷雨';reason='循农事与天时，观察早期汉字如何记录人与自然。'}
else if(/寒食|祭侄|颜真卿|颜勤礼/.test(name)){term='清明';reason='以追思与家国记忆，体会书迹中的情感与担当。'}
else if(/雪/.test(name)){term='大雪';reason='以雪景、留白与问候之意，观察书札的疏密。'}
else if(/兰亭|王羲之|王献之|王珣|圣教序/.test(name)){term='立春';reason='循春日雅集与晋人尺牍，读自然流动的笔意。'}
else if(/赤壁|苏轼/.test(name)){term='秋分';reason='循秋水与明月，读东坡诗文及其书法回响。'}
else if(/松风|黄庭坚|米芾|蜀素/.test(name)){term='寒露';reason='循登高山水与文人交游，感受宋人书风的意趣。'}
else if(/赵孟頫|心经|黄庭|雁塔|玄秘|开成|经石|摩崖|石经|金藏/.test(name)){term='立夏';reason='夏日静读经卷与小楷，观察字形的秩序与空间。'}
else if(/草|怀素|张旭|张芝|祝允明/.test(name)){term='大暑';reason='从夏日的舒展，体会草书线条的速度与节奏。'}
else if(/秦|篆|鼓|李斯|李阳冰|吴昌硕/.test(name+' '+w.script)){term='冬至';reason='岁序转换时溯源古文字，观察篆籀结构的延续。'}
else if(/汉|隶/.test(w.era+' '+w.script)){term='芒种';reason='以耕作时节的沉实节奏，读汉隶与简牍的质朴。'}
else if(w.isPerson246){term='白露';reason='在秋日读收藏、鉴赏与传承，循其所藏名帖走近古人。'}
else {term='春分';reason='在昼夜均分之时，观察这件作品的结体、章法与传承。'}
return {term,reason}}
const works=all.map(w=>({id:w.id,title:w.title,author:w.author||w.author246||'',url:w.url||w.sources246?.[0]?.url||'',isPerson:!!w.isPerson246,...association(w)}));
for(const w of works){const e=terms.find(t=>t.title===w.term);if(!e.works.includes(w.id))e.works.push(w.id)}
write('release298/calendar-data.json',{version:298,sourceNote:'确切史事与诞辰按标示历法纪念；时令荐写为本站编辑关联，不声称作品创作于该日。节气使用北京时间2020—2040年实算表，农历由浏览器历法换算。',works,events:[...historical,...festive,...terms]});
console.log('Calendar:',works.length,'ranking entries,',historical.length,'historical dates,',festive.length,'festivals,',terms.length,'solar terms; oracle:',oracle.length);
