from pathlib import Path
import urllib.request,urllib.parse,re,json,concurrent.futures
terms=['国际母语日','世界诗歌日','国际古迹遗址日','世界读书日','国际博物馆日','世界文化多样性促进对话和发展日','国际档案日','国际月球日','世界土著人民国际日','国际扫盲日','国际和平日','普遍获取信息国际日','国际翻译日','国际非物质文化遗产日','世界音像遗产日','世界科学促进和平与发展日','国际宽容日','人权日','世界阿拉伯语日','保护世界文化和自然遗产公约','保护非物质文化遗产公约','萨曼莎·克里斯托弗雷蒂','史蒂夫·乔布斯','阿拉伯书法','鲍勃·迪伦','金刚经刻本','世界记忆遗产','莫高窟','孟菲斯及其墓地金字塔','婆罗浮屠','泰姬陵','中国书法','丝绸之路','中国传统制茶技艺及其相关习俗','安妮日记','佛祖直指心体要节','第九交响曲','世界记忆名录','人类非物质文化遗产代表作名录']
def get(term):
 url='https://baike.baidu.com/item/'+urllib.parse.quote(term)
 try:
  r=urllib.request.urlopen(url,timeout=16);s=r.read().decode();title=(re.findall('<title>(.*?)</title>',s)or[''])[0]
  if title=='百度百科' or '百度百科' not in title:return term,{'error':'No verifiable encyclopedia article in response','bytes':len(s)}
  canonical=re.search(r'<link[^>]*rel="canonical"[^>]*href="([^\"]+)"',s)
  if canonical:url=canonical[1]
  return term,{'title':title.split('_百度百科')[0],'label':term,'url':url,'provider':'百度百科','relatedTopic':False,'verifiedVia':'HTTP 200 with exact article title','verifiedTitle':title}
 except Exception as e:return term,{'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as p:rows=dict(p.map(get,terms))
Path('/tmp/encyclopedia301-topic-fetch.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
print('verified',sum('url'in r for r in rows.values()),'of',len(rows));print({k:v for k,v in rows.items() if 'url'in v})
