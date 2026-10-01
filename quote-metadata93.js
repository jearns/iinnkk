/* Keep country, dynasty, literary author and work title in distinct fields. */
(function init(){if(!window.Revision90?.ready){setTimeout(init,60);return}
const dynasty={};function group(era,names){for(const name of names.split('、'))dynasty[name]=era}
group('先秦','孔子及弟子、孟子、老子、庄子、荀子、孙武、左丘明（传）、屈原');
group('秦末','项羽');group('西汉','刘邦、司马迁');group('东汉','班固等、蔡邕');group('汉代','汉乐府');group('东汉末年','曹操');group('曹魏','曹植');group('三国·蜀汉','诸葛亮');group('东晋','陶渊明、卫夫人、卫铄、王羲之');group('南朝','刘勰、吴均、王僧虔、周兴嗣');
group('唐','韩愈、李白、杜甫、王维、孟浩然、王勃、陈子昂、王之涣、张九龄、张若虚、王建、张继、王昌龄、刘方平、戴叔伦、皮日休、李峤、白居易、杜牧、李商隐、刘禹锡、柳宗元、高适、岑参、许浑、贺知章、王翰、李绅、崔护、宋之问、孟郊、张彦远、欧阳询、虞世南、孙过庭、张怀瓘、韩方明、颜真卿、张旭、怀素');
group('南唐','李煜');group('北宋','苏轼、黄庭坚、米芾、晏殊、范仲淹、柳永、秦观、欧阳修、李之仪、王安石');group('两宋之际','李清照');group('南宋','辛弃疾、陆游、姜夔、岳飞、岳飞（传）、张孝祥、蒋捷、张元干、吴文英');group('元','马致远、张养浩、王实甫、关汉卿、白朴、张可久、乔吉、徐再思、周德清');group('明','董其昌、项穆、丰坊');group('明末清初','王铎、傅山、石涛');group('清','刘熙载、包世臣、康有为、笪重光、王澍、朱和羹、梁巘、何绍基');group('近现代','白蕉、林散之、启功、沈尹默、沙孟海、于右任、林语堂');
const countries={...window.LiteraryCountries61};Object.assign(countries,{'雪莱':'英国','狄金森':'美国','史蒂文森':'英国','罗塞蒂':'英国','松尾芭蕉':'日本','德拉梅尔':'英国','拜伦':'英国','叶芝':'爱尔兰','刘欢':'中国','林夕':'中国','方文山':'中国','李宗盛':'中国','毛不易':'中国','罗大佑':'中国','黄家驹':'中国','刘卓辉':'中国','黄霑':'中国','唐恬':'中国','黄伟文':'中国','姚谦':'中国','伍佰':'中国','郭栋楠':'中国','吕易秋':'中国','乔晨':'中国','占逸君':'中国','Michael Jackson':'美国','Bob Dylan':'美国','齐秦':'中国','朴树':'中国','许巍':'中国','逃跑计划':'中国','老狼':'中国','张雨生':'中国','陈升':'中国','Beyond':'中国'});
const eraOnly=/^(先秦|秦|秦末|西汉|东汉|汉|魏|晋|东晋|南朝|南北朝|唐|宋|北宋|南宋|元|明|清|明末清初|近现代)$/;
function normalize(q){const out={...q},author=String(q.author||'').trim(),source=String(q.source||q.s||'');out.author=author;out.title=q.title||source.match(/《([^》]+)》/)?.[1]||'';if(dynasty[author]){out.country='中国';out.dynasty=dynasty[author];out.era=out.dynasty}else if(author==='佚名'){out.country='中国';out.dynasty=/诗经/.test(q.era||out.title)?'先秦':/古诗十九首/.test(q.era||out.title)?'东汉':'年代待考';out.era=out.dynasty}else if(eraOnly.test(q.country||'')){out.country='中国';out.dynasty=q.country;out.era=q.country}else if(countries[author]){out.country=countries[author];if(out.era===out.country)out.era=''}else if(q.cat==='heritage'){out.country=source.match(/^([^·：:]{1,24})·/)?.[1]||q.country||''}else if(q.cat==='film'){out.country=q.country&&!eraOnly.test(q.country)?q.country:'';out.author=author;out.metadataStatus93=author?'已录来源作者':'台词来源；编剧信息未核定'}else if(author==='书写感悟'){out.country='中国';out.era='当代原创';out.dynasty=''}
out.metadataStatus93??=out.author&&out.country?'已匹配作者资料':'国别或作者待核';return out}
const D=DailyQuotes38;for(const method of ['setAll','add','replace']){const previous=D[method];if(previous)D[method]=rows=>previous(rows.map(normalize))}D.setAll(D.all());
for(const key of ['Poetry100','LongTexts38','Moon50'])if(Array.isArray(window[key]))window[key]=window[key].map(normalize);
if(window.currentQuote)Object.assign(window.currentQuote,normalize(window.currentQuote));
window.QuoteMetadata93={normalize,dynasty,countries,audit:()=>({total:D.all().length,pending:D.all().filter(q=>q.metadataStatus93!=='已匹配作者资料').map(q=>({id:q.id,category:q.cat,title:q.title,author:q.author,status:q.metadataStatus93}))})};
document.dispatchEvent(new CustomEvent('quote-changed',{detail:window.currentQuote}));
})();
