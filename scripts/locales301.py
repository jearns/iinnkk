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
for name in ['manage234.js','home-slides260.js','release301/calendar-ui.mjs','release301/portrait.js','release301/map-group.js','release301/portrait-ui.js','release301/screens.js','remotion-studio/src/web.jsx','remotion-studio/src/scene-plan.mjs','remotion-studio/src/music.mjs']:
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
for name in ['release301/encyclopedia.json','release301/outlines.json','release301/image-dpm-replacements.json']:collect(json.loads(Path(name).read_text()))
dicts={l:json.loads(Path('locales218/'+l+'.json').read_text()) for l in LANGS}
keys=sorted(texts);Path('release301/locale-source.json').write_text(json.dumps(keys,ensure_ascii=False,indent=2)+'\n')
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
for l in LANGS:Path('locales218/'+l+'.json').write_text(json.dumps(dicts[l],ensure_ascii=False,separators=(',',':'))+'\n')
