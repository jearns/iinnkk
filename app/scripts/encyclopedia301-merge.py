import json,re,urllib.request,html
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def load(p):return json.loads((root/p).read_text())
works={**load('features/library/encyclopedia-works-a.json'),**load('features/library/encyclopedia-works-b.json')}
def entry(label,url,provider='快懂百科',related=False,via=None):return dict(title=label,label=label,url=url,provider=provider,relatedTopic=related,verifiedVia=via or {'method':'public_search_result_or_article_html','url':url,'checkedAt':'2026-10-31'})
def ku(label,id,related=False):return entry(label,'https://www.baike.com/wikiid/'+id,related=related)
def bd(label,id):return entry(label,'https://bkso.baidu.com/item/'+urllib.parse.quote(label)+'/'+id,'百度百科')
import urllib.parse
base={
'festival-spring':ku('春节','7164607077330223111'),
'festival-dragon':ku('端午节','7164594471366262817'),
'term-春分':ku('春分','7220719297227669536'),
'term-冬至':ku('冬至','7170999249693032451'),
'heritage':ku('世界遗产名录','7191672317444707644'),
'memory':ku('世界记忆遗产','5414947337833649717',True),
'intangible':ku('非物质文化遗产','738538672412540237',True),
'festival':ku('中国节日','8434563368583944152',True),
'solar':ku('二十四节气','7309648023263379456',True),
'worldconvention299':ku('保护世界文化和自然遗产公约','1694519371281395788'),
'poetry299':ku('世界诗歌日','1778596615998299033'),
'books299':ku('世界读书日','8895194975427498298'),
'museum299':ku('国际博物馆日','7542822566286150107'),
'borobudur299':ku('婆罗浮屠','2594270372718171083'),
'taj299':ku('泰姬陵','7205958012069593140'),
'sutra868299':ku('金刚经刻本','3947992085243950698'),
'dylan299':ku('鲍勃·迪伦','7791226860991216465',True),
'general':ku('联合国','7158714383753199646',True),
'mother299':bd('国际母语日','1835253'),
'monuments299':bd('国际古迹遗址日','9183977'),
'archives299':bd('国际档案日','3754113'),
'peace299':bd('国际和平日','513979'),
'access299':bd('“普遍获取信息国际日”','62035880'),
'tolerance299':bd('国际宽容日','10673828'),
'iss299':bd('萨曼莎·克里斯托弗雷蒂','5137055'),
'arabicinscription299':bd('阿拉伯书法','449745'),
'jobs299':bd('史蒂夫·乔布斯','85300'),
'annefrank299':bd('安妮日记','63088034'),
'mogao299':bd('莫高窟','303038'),
'jikji299':bd('直指心体要节','3978244'),
'pyramid299':bd('孟菲斯及其墓地金字塔','7791822'),
'silk299':entry('丝绸之路','https://www.zgbk.com/ecph/words?Name=%E4%B8%9D%E7%BB%B8%E4%B9%8B%E8%B7%AF&SiteID=1&SourceID=560143&Type=bkzyb&subSourceType=000003000001000002','中国百科网'),
'tea299':entry('中国传统制茶技艺及其相关习俗','https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E4%BC%A0%E7%BB%9F%E5%88%B6%E8%8C%B6%E6%8A%80%E8%89%BA%E5%8F%8A%E5%85%B6%E7%9B%B8%E5%85%B3%E4%B9%A0%E4%BF%97/62389766','百度百科')}
calendar=load('features/calendar/calendar-data.json');events={};categories={};unresolved=[]
for e in calendar['events']:
 k=e['id'];v=base.get(k)
 if not v and k.startswith('festival-'):v=base['festival']
 if not v and k.startswith('term-'):v=base['solar']
 if not v and k in ('mow299','oracle-memory'):v=base['memory']
 if not v and k in ('ichconvention299','living299','chinesecalligraphy299'):v=base['intangible']
 # Historic occasions may share the corresponding work's entry; this is explicitly related.
 if not v:
  for wid in e.get('works',[]):
   if wid in works:v=works[wid];break
 if v:
  v=dict(v)
  if v['title']!=e['title']:v['relatedTopic']=True
  v['eventTitle']=e['title'];events[k]=v
 else:
  # Keep the primary source usable without pretending it is an encyclopedia entry.
  events[k]=dict(title=e['title'],label='史料与纪念日来源',url=e['source'],provider='原始来源',relatedTopic=False,encyclopediaVerified=False,verifiedVia={'method':'existing_calendar_primary_source','checkedAt':'2026-10-31'})
  unresolved.append({'kind':'event','id':k,'title':e['title'],'reason':'未检出已核实的独立百科条目；保留原始史料链接'})
for c in calendar['categories']:
 if c['id'] in base:categories[c['id']]=base[c['id']]
registers={
'heritage':dict(label='全球世界遗产名录',url='https://whc.unesco.org/en/list/',provider='UNESCO'),
'memory':dict(label='全球世界记忆名录',url='https://www.unesco.org/en/memory-world/grid?hub=1081',provider='UNESCO'),
'intangible':dict(label='全球非物质文化遗产名录',url='https://ich.unesco.org/en/lists',provider='UNESCO')}
result=dict(version=301,policy=dict(priority=['快懂百科','中国百科网','百度百科'],chinaEncyclopediaDomain='zgbk.com',checkedAt='2026-10-31',relatedTopicMeaning='相关概念、作者或作品总类，不是该具体器物/事件的独立条目；展示时应标注相关百科。',verificationLimit='未检出的百科不猜测地址；保留已有官方史料。网络检索并非证明某站绝无条目。'),works=works,events=events,categories=categories,registers=registers,unresolved=unresolved)
result['coverage']={'works':len(works),'exactWorks':sum(not v['relatedTopic'] for v in works.values()),'relatedWorks':sum(v['relatedTopic'] for v in works.values()),'events':len(events),'eventsWithEncyclopedia':len(events)-len(unresolved),'eventsWithPrimarySourceOnly':len(unresolved)}
(root/'features/library/encyclopedia.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(result['coverage']);print('unresolved',[(x['id'],x['title']) for x in unresolved])
