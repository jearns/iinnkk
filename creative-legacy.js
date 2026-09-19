(function(root){
const templates={
 memorial:{name:'奏折 · 今日不早朝',title:'奏',direction:'vertical',ratio:.70,art:0,prompt:'臣今日困得很\n恳请准许睡到自然醒\n另赐奶茶一杯\n钦此（自己批的）'},
 edict:{name:'圣旨 · 快乐免税',title:'奉天承运',direction:'vertical',ratio:.70,art:1,prompt:'奉天承运\n今日所有烦恼一律退朝\n快乐免税\n奶茶加倍\n钦此'},
 correspondence:{name:'尺牍 · 见字如面',title:'',direction:'vertical',ratio:.70,art:8,prompt:'见字如面\n天气不错\n饭也好吃\n就是少了你\n哪天来坐坐'},
 fan:{name:'扇面 · 风由我起',title:'',direction:'vertical',ratio:1,art:2,area:[.22,.20,.56,.31],prompt:'风不来\n我来扇'},
 bamboo:{name:'竹简 · 千年摸鱼记',title:'',direction:'vertical',ratio:1,art:3,area:[.13,.19,.74,.55],prompt:'某年某月某日\n宜摸鱼\n忌内耗\n此简为证'},
 porcelain:{name:'陶瓷 · 人间有饭',title:'',direction:'vertical',ratio:1,art:4,area:[.25,.25,.50,.48],prompt:'人间有味\n今日加饭'},
 oracle:{name:'甲骨 · 今日宜躺',title:'',direction:'vertical',ratio:1,art:5,area:[.22,.20,.55,.55],prompt:'卜曰\n今日宜躺\n明日再忙'},
 ding:{name:'铭文鼎 · 一言九鼎',title:'',direction:'vertical',ratio:1,art:6,area:[.24,.31,.52,.25],prompt:'说好早睡\n一言九鼎'},
 pan:{name:'铭文盘 · 盘它',title:'',direction:'vertical',ratio:1,art:7,area:[.28,.25,.44,.46],prompt:'此盘无价\n只装快乐'},
 message:{name:'留言 · 我去捉月亮',title:'给你留个言',direction:'horizontal',ratio:.70,prompt:'我去捉一会儿月亮。\n晚饭前回来。\n如果没捉到，\n就给你带一袋糖。'},
 iou:{name:'借条 · 借一点勇气',title:'借条',direction:'horizontal',ratio:.70,prompt:'今向未来的自己\n借勇气三两、好运一斤。\n待梦想开花之日，\n连本带笑归还。\n借款人：______'},
 parcel:{name:'快递 · 想念已发货',title:'想念速递',direction:'horizontal',ratio:.70,prompt:'收件人：心里那个人\n内件：没说出口的想念\n重量：轻拿轻放的一颗心\n预计送达：你读到此刻\n签收：______'},
 remittance:{name:'汇款 · 快乐已到账',title:'情绪银行 · 汇款单',direction:'horizontal',ratio:.70,prompt:'收款人：今天的你\n汇入：一整年的好运\n附言：快乐已到账\n无须退回，尽管花光。'}
};
for(const p of Object.values(templates)){p.color='#0000';p.kind='creative'}
const inspirations={kusun:{name:'怀素 · 苦笋帖',text:'苦笋及茗异常佳，乃可迳来。怀素上。',source:'怀素《苦笋帖》· 古帖释文',url:'https://www.shanghaimuseum.net/mu/frontend/pg/article/id/P00002749'},duck:{name:'王献之 · 鸭头丸帖',text:'鸭头丸，故不佳。明当必集，当与君相见。',source:'王献之《鸭头丸帖》· 古帖释文',url:'https://www.shanghaimuseum.net/mu/frontend/pg/m/article/id/CI00000376'},autumn:{name:'传王献之 · 中秋帖',text:'中秋不复不得相还，为即甚省如何，然胜人何庆等大军。',source:'传王献之《中秋帖》· 传世本释文',url:'https://www.dpm.org.cn'},stomach:{name:'张旭 · 肚痛帖',text:'忽肚痛不可堪，不知是冷热所致。水服大黄汤，冷热俱有益。',source:'张旭《肚痛帖》· 古帖释文，仅作临写',url:'https://digitalarchive.npm.gov.tw/Collection/Detail/28115?dep=P'}};
const scenes=['故宫 · 今日镇馆','卢浮宫 · 举世围观','大英博物馆 · 隆重登场','大都会 · 大师是我','拍卖现场 · 一百亿成交','世界新闻 · 二十国巡展','太空展厅 · 地球来信','城市巨幕 · 全城见字','私人收藏 · 传家之作'];
const exhibition={},pending=new Map();let materials=null;const keys=[0,2,3,4,5,6,7,8];
function load(src,done){const im=new Image();im.onload=()=>{done(im);root.LegacyCreativePaper.onReady?.()};im.onerror=()=>{root.LegacyCreativePaper.onError?.(src)};im.src=src}
function crop(t,im,i,w,h,rows){const col=i%3,row=Math.floor(i/3),sx=col*im.width/3,sy=rows[row]/1254*im.height,sh=(rows[row+1]-rows[row])/1254*im.height;t.drawImage(im,sx,sy,im.width/3,sh,0,0,w,h)}
function drawTemplate(t,b,p){if(p.art===undefined||!materials)return;crop(t,materials,p.art,b.w,b.h,[0,386,771,1254])}
const guideCache=new Map();
function drawGuide(t,a,text,vertical,alpha){if(!text||!alpha)return;const chars=[...text.replace(/\s/g,'')],key=JSON.stringify([text,a.w,a.h,vertical]);let sheet=guideCache.get(key);if(!sheet){sheet=document.createElement('canvas');const scale=Math.min(390,2000/Math.max(a.w,a.h));sheet.width=Math.max(1,Math.ceil(a.w*scale));sheet.height=Math.max(1,Math.ceil(a.h*scale));const g=sheet.getContext('2d'),cols=Math.max(1,Math.ceil(Math.sqrt(chars.length*a.w/a.h))),rows=Math.ceil(chars.length/cols),dx=sheet.width/cols,dy=sheet.height/rows,fs=Math.min(dx,dy)*.70;g.fillStyle='#56442f';g.textAlign='center';g.textBaseline='middle';g.font=fs+'px "Kaiti SC",STKaiti,serif';chars.forEach((ch,i)=>{const x=vertical?cols-1-Math.floor(i/rows):i%cols,y=vertical?i%rows:Math.floor(i/cols);g.fillText(ch,(x+.5)*dx,(y+.5)*dy)});if(guideCache.size>=3)guideCache.delete(guideCache.keys().next().value);guideCache.set(key,sheet)}t.save();t.globalAlpha=alpha;t.drawImage(sheet,a.x,a.y,a.w,a.h);t.restore()}

const rects=[[170,92,298,247],[550,109,701,247],[966,88,1107,262],[139,513,285,649],[492,449,686,598],[945,511,1119,634],[137,906,279,1042],null,[948,874,1142,1023]];
function scene(t,art,i,size){if(!exhibition[i])throw Error('场景图片尚未加载');t.save();t.drawImage(exhibition[i],0,0,size,size);const col=i%3,row=Math.floor(i/3),sy=[0,418,816][row],rh=[418,398,438][row],sx=col*418;const fitArt=document.createElement('canvas');fitArt.width=420;fitArt.height=420;const g=fitArt.getContext('2d');g.fillStyle='#f4eddf';g.fillRect(0,0,420,420);const f=Math.min(420/art.width,420/art.height);g.drawImage(art,(420-art.width*f)/2,(420-art.height*f)/2,art.width*f,art.height*f);
if(i===7){const points=[[581,900],[678,868],[682,1045],[581,1059]].map(([x,y])=>[(x-sx)/418*size,(y-sy)/rh*size]);for(let k=0;k<84;k++){const v=k/84,v1=(k+1)/84,ax=points[0][0]+(points[3][0]-points[0][0])*v,ay=points[0][1]+(points[3][1]-points[0][1])*v,bx=points[1][0]+(points[2][0]-points[1][0])*v,by=points[1][1]+(points[2][1]-points[1][1])*v,cy=points[0][1]+(points[3][1]-points[0][1])*v1;t.save();t.setTransform((bx-ax)/420,(by-ay)/420,0,(cy-ay)/5,ax,ay);t.drawImage(fitArt,0,v*420,420,5,0,0,420,5);t.restore()}}else{const r=rects[i],x=(r[0]-sx)/418*size,y=(r[1]-sy)/rh*size,w=(r[2]-r[0])/418*size,h=(r[3]-r[1])/rh*size;t.fillStyle='#f4eddf';t.fillRect(x,y,w,h);const f=Math.min(w/art.width,h/art.height);t.drawImage(art,x+(w-art.width*f)/2,y+(h-art.height*f)/2,art.width*f,art.height*f)}
// Clearly fictional captions remain in saved images.
t.fillStyle='#111b';t.fillRect(0,size*.86,size,size*.14);t.fillStyle='#fff';t.textAlign='left';t.font=Math.round(size*.033)+'px "PingFang SC","Kaiti SC",sans-serif';t.fillText(scenes[i],size*.035,size*.915);t.fillStyle='#ded7c8';t.font=Math.round(size*.022)+'px "PingFang SC","Kaiti SC",sans-serif';t.fillText('创意合成 · 娱乐展览，非真实事件',size*.035,size*.965);t.restore()}
function compose(target,art,key,size){target.width=size;target.height=key==='grid'?size/2:size;const t=target.getContext('2d');if(key==='grid'){const n=size/4;keys.forEach((i,j)=>{const c=document.createElement('canvas');c.width=n;c.height=n;scene(c.getContext('2d'),art,i,n);t.drawImage(c,j%4*n,Math.floor(j/4)*n)})}else scene(t,art,+key,size);return target}
function ready(key){return key==='grid'?keys.every(i=>!!exhibition[i]):!!exhibition[+key]}
function ensure(key){if(key==='grid')return Promise.all(keys.map(i=>ensure(String(i))));const i=+key;if(!keys.includes(i))return Promise.reject(Error('模板已移除'));if(exhibition[i])return Promise.resolve();if(pending.has(i))return pending.get(i);const job=new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{exhibition[i]=im;pending.delete(i);root.LegacyCreativePaper.onReady?.();resolve()};im.onerror=()=>{pending.delete(i);reject(Error('加载失败'))};im.src='scenes/'+i+'.webp'});pending.set(i,job);return job}
function release(key){if(key==='grid')keys.forEach(i=>delete exhibition[i]);else delete exhibition[+key]}
root.LegacyCreativePaper={templates:{},inspirations,scenes,keys,drawTemplate:()=>{},drawGuide,compose,ready,ensure,release};
})(globalThis);
