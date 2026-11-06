import concurrent.futures,json,re,time,urllib.request
from pathlib import Path
from html.parser import HTMLParser
LANGS=['en','fr','ru','ar','es'];texts={'低于1080像素短边的图片已撤下，原始路径保留备查。','原帖图片正在替换为高清无水印版本，原始路径保留备查。'}
class Text(HTMLParser):
 def handle_data(self,s):
  s=s.strip()
  if re.search(r'[\u3400-\u9fff]',s) and '<' not in s and '{' not in s and len(s)<500:texts.add(s)
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k in ['aria-label','placeholder','title'] and v and re.search(r'[\u3400-\u9fff]',v):texts.add(v)
for name in ['manage234.html','self-portrait257.html']:
 Text().feed(Path(name).read_text())
for name in ['handwriting/photo/photo.js','writing-music.js','atlas223.js','homepage154.js','features/music/screens.js','features/music/portrait.js','features/music/portrait-ui.js','remotion-studio/src/web.jsx','remotion-studio/src/scene-plan.mjs','features/music/music-library.mjs']:
 s=Path(name).read_text()
 for m in re.finditer(r"(['\"])([^'\"\n]*[\u3400-\u9fff][^'\"\n]*)\1",s):
  value=m[2]
  if len(value)<500 and not any(c in value for c in ['<','>','{','}','=','\\']):texts.add(value)
def collect(x):
 if isinstance(x,dict):
  for k,v in x.items():
   if k in ['label','name','note','versionNote301','title'] and isinstance(v,str) and re.search(r'[\u3400-\u9fff]',v):texts.add(v)
   elif isinstance(v,(dict,list)):collect(v)
 elif isinstance(x,list):
  for v in x:collect(v)
texts.update(['名帖年代','先秦','南北朝','三国','今','一阶','二阶','三阶','四阶','五阶','原色','自定','此链接当前未返回音频，可在纪录大片中为该曲添加本机音源。','正在播放本机配乐库','全站共用曲库按需播放；可搜索曲目、顺序或随机播放。伴写音乐不自动混入过程视频。','步骤 1','步骤 2','步骤 3','步骤 4','步骤 5','高德网页','高德App','复制地址'])
dicts={l:json.loads(Path('locales/'+l+'.json').read_text()) for l in LANGS}
keys=sorted(texts);Path('features/music/locale-source.json').write_text(json.dumps(keys,ensure_ascii=False,indent=2)+'\n')
def translate(l):
 missing=[s for s in keys if s not in dicts[l]];result={};url='https://edge.microsoft.com/translate/translatetext?from=zh-Hans&to='+l+'&isEnterpriseClient=false'
 for start in range(0,len(missing),12):
  batch=missing[start:start+12];public=[s.replace('手筆','SHOUBI_BRAND') for s in batch]
  request=urllib.request.Request(url,data=json.dumps(public,ensure_ascii=False).encode(),headers={'Content-Type':'application/json'})
  for attempt in range(2):
   try:
    with urllib.request.urlopen(request,timeout=30) as r:data=json.load(r)
    values=[v['translations'][0]['text'].replace('SHOUBI_BRAND','手筆') for v in data]
    assert len(values)==len(batch) and all(values);result.update(zip(batch,values));break
   except Exception:
    if attempt:raise
  print(l,start+len(batch),'/',len(missing),flush=True)
 return l,result
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
 for l,result in pool.map(translate,LANGS):dicts[l].update(result)
assert all(set(dicts[l])==set(dicts['en']) for l in LANGS)
for l in LANGS:Path('locales/'+l+'.json').write_text(json.dumps(dicts[l],ensure_ascii=False,separators=(',',':'))+'\n')
