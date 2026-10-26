import fs from 'node:fs';import vm from 'node:vm';
const read=p=>fs.readFileSync(p,'utf8'),root={};for(const p of ['calligraphy-rank-data183.js','practice.js','long-texts38.js']){try{vm.runInNewContext(read(p),{window:root})}catch(e){if(!root.PracticeTexts)throw e}}
const corpus=JSON.parse(read('release276/transcripts.json')),work=root.CalligraphyRanks183.works;
for(const[id,practice]of Object.entries({zhushang:'zhu',shupu:'shupu',dizhu:'dizhu',caoshuqianzi:'qian',mengying:'qian',zixu:'zixu',songfeng:'song',guanjun:'guan',jizhi:'ji',hanshi:'han',lanting:'lan',chibi:'chibi'})){if(corpus[id])continue;const p=root.PracticeTexts.find(p=>p.id===practice);corpus[id]={text:p.text,url:p.url||p.source||work.find(w=>w.id===id)?.url||'',status:id==='mengying'?'千字文全文；具体篆书刻本异文以原图校核。':'本站既有全文 · 临写时以本帖原图校核。'}}
for(const[id,title]of Object.entries({zuiweng:'醉翁亭记'})){if(!corpus[id]){const p=root.LongTexts38.find(p=>p.title===title);corpus[id]={text:p.q,url:p.url||'',status:'篇章全文；具体碑刻的题款、跋语以原图为准。'}}}
for(const id of ['wuchangshuo-shigu','anguoshigu247'])corpus[id]={...corpus.shigu,status:'石鼓十篇原文供对照；本件临本、拓本的节录与存字范围以原图为准。'};
fs.writeFileSync('release276/transcripts.json',JSON.stringify(corpus,null,2)+'\n');
