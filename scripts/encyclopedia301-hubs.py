import urllib.request,re,json,concurrent.futures
from html import unescape
from pathlib import Path
seeds={'世界遗产名录':'https://www.baike.com/wikiid/7191672317444707644','世界记忆遗产':'https://www.baike.com/wikiid/5414947337833649717','非物质文化遗产':'https://www.baike.com/wikiid/738538672412540237','联合国':'https://www.baike.com/wikiid/7158714383753199646','2026年国际博物馆日':'https://www.baike.com/wikiid/7640777849214074923','中国节日':'https://www.baike.com/wikiid/8434563368583944152','世界诗歌日':'https://www.baike.com/wikiid/1778596615998299033','世界读书日':'https://www.baike.com/wikiid/8895194975427498298'}
def get(item):
 title,url=item
 try:
  html=urllib.request.urlopen(url,timeout=25).read().decode()
  links={unescape(re.sub('<[^>]+>','',t)).strip():{'url':'https://www.baike.com'+u,'verifiedVia':url} for u,t in re.findall(r'<a[^>]*href="(/wikiid/[^\"]+)"[^>]*>(.*?)</a>',html)}
  links[title]={'url':url,'verifiedVia':url};return links
 except Exception as e:return {title:{'error':str(e)}}
links={}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as p:
 for d in p.map(get,seeds.items()):links.update(d)
Path('/tmp/encyclopedia301-links.json').write_text(json.dumps(links,ensure_ascii=False))
terms=['国际母语日','国际古迹遗址日','国际博物馆日','世界文化多样性促进对话和发展日','国际档案日','国际月球日','世界土著人民国际日','国际扫盲日','国际和平日','普遍获取信息国际日','国际翻译日','国际非物质文化遗产日','世界音像遗产日','世界科学促进和平与发展日','国际宽容日','人权日','世界阿拉伯语日','萨曼莎','乔布斯','鲍勃','阿拉伯书法','安妮','直指','第九交响曲','金刚经','莫高窟','婆罗浮屠','泰姬陵','孟菲斯','中国书法','丝绸之路','中国传统制茶','人类非物质文化遗产代表作名录']
for term in terms:print(term,[(k,v) for k,v in links.items() if term in k][:7])
