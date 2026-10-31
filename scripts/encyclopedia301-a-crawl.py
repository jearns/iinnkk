import json,re,html,urllib.request,concurrent.futures,pathlib,time
ROOT=pathlib.Path('/workspace/scratch/b70d4350fc73/iinnkk300')
ranks=json.loads((ROOT/'calligraphy-rank-data183.js').read_text().split('=',1)[1].strip().rstrip(';'))['works'][:61]
seeds=json.loads(pathlib.Path('/tmp/encyclopedia301-a-seeds.json').read_text())
aliases={'lanting':['兰亭序'],'hanshi':['寒食帖','黄州寒食诗帖'],'luoshen13':['洛神十三行'],'jizhi':['祭侄稿'],'zhanghan':['张翰帖'],'songfeng':['松风阁诗'],'sanxi':['三希帖','三希'],'langya':['琅琊刻石'],'mengying':['梦英篆书千字文碑','篆书千字文'],'zhengwengong':['郑文公碑'],'jingshiyu':['泰山金刚经'],'chibi':['元赵孟頫前后赤壁赋'],'zhupoems':['祝允明草书诗帖']}
norm=lambda t:re.sub(r'[《》·（）()\s]','',t)
keys={w['id']:{norm(w['title']),*[norm(t) for t in aliases.get(w['id'],[])]} for w in ranks}
allnames=set.union(*keys.values())
authornames={w['author'] for w in ranks if w.get('author')}
def fetch(url):
 try:
  s=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=18).read().decode()
  metas={m[0]:html.unescape(m[1]) for m in re.findall(r'<meta[^>]+(?:name|property)="([^"]+)"[^>]+content="([^"]*)"',s)}
  title=metas.get('og:title','').split('-快懂百科')[0].split('-抖音百科')[0];desc=metas.get('og:description','').split(',快懂百科')[0];abstract=metas.get('description','')
  links=[]
  for u,t in re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>',s):
   label=html.unescape(re.sub('<[^>]+>','',t))
   if u.startswith('/wikiid/') and (norm(label) in allnames or label in authornames):links.append({'label':label,'url':'https://www.baike.com'+u})
  return {'url':url,'title':title,'description':desc,'abstract':abstract,'links':links,'verifiedVia':'快懂百科HTML元信息及正文链接','verifiedAt':'2026-10-30'}
 except Exception as e:return {'url':url,'error':str(e)}
pages={}
for depth in range(3):
 todo=[u for u in seeds if u not in pages]
 if not todo:break
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
  for p in pool.map(fetch,todo):pages[p['url']]=p
 seeds=list({x['url'] for p in pages.values() for x in p.get('links',[])})
 print('depth',depth,'pages',len(pages),flush=True)
pathlib.Path('/tmp/encyclopedia301-a-pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2))
result={}
for w in ranks:
 found=[p for p in pages.values() if norm(p.get('title','')) in keys[w['id']] and not re.search('出版.*(?:图书|书籍)|所著的书籍|编著的书籍',p.get('description',''))]
 if found:
  p=sorted(found,key=lambda p:-(w.get('author','') in p.get('description','')+p.get('abstract','')))[0]
  result[w['id']]={'title':w['title'],'label':p['title'],'url':p['url'],'provider':'快懂百科','relatedTopic':False,'verifiedVia':p['verifiedVia'],'descriptionSignal':p['description'],'verifiedAt':'2026-10-30'}
(ROOT/'release301/encyclopedia-works-a.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('matched',len(result),'missing',[(w['id'],w['title']) for w in ranks if w['id'] not in result],flush=True)
