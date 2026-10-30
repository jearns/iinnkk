"""Translate only new public catalogue labels/descriptions; no source code or private content."""
import concurrent.futures,json,re,time,urllib.request
from pathlib import Path
LANGS=['en','fr','ru','ar','es']
FIELDS={'title','author','era','dateLabel','script','museum','place','milestone','description','status','textStatus','textStatus183','sourceLabel183','imageCredit247','versionNote300','objectNumber300','objectNumber','accession','label','pageNames','imageType300','title300','note','reason','dateNote','catalogueNumber300','imageNote300','identification300','replaces300','imageSelection300'}
texts=set();object_numbers=set()
def collect(obj,key=''):
 if isinstance(obj,dict):
  for k,v in obj.items():collect(v,k)
 elif isinstance(obj,list):
  for v in obj:collect(v,key)
 elif isinstance(obj,str) and key in FIELDS and re.search(r'[\u3400-\u9fff]',obj):
  texts.add(obj)
  if key in {'objectNumber300','objectNumber'}:object_numbers.add(obj)
for p in Path('release300').glob('catalogue*.json'):
 if 'audit' not in p.name and 'scan' not in p.name:collect(json.loads(p.read_text()))
for p in Path('release300').glob('*oracle*.json'):collect(json.loads(p.read_text()))
dicts={l:json.loads(Path('locales218/'+l+'.json').read_text()) for l in LANGS}
texts.update([
 '本站从馆藏与甲骨专题展中精选十件，含殷商刻辞、朱书与先书后刻的实物，按观察主题编排。非官方高下排名；各件年代与释读以来源机构说明为准。',
 '两片缀合牛肩胛骨记录在义京祭祀的占问，展示字形、卜兆与行列的关系。',
 '围绕收成的正反设问，展示商代卜辞的逻辑与填朱字形。'
])
keys=sorted(texts)
# Keep dictionary keys identical even if earlier imports left a gap.
missing={l:[s for s in keys if not dicts[l].get(s)] for l in LANGS}
print('Catalogue public strings:',len(keys),'; missing:',{l:len(v) for l,v in missing.items()},flush=True)
def translate(l,ss):
 url='https://edge.microsoft.com/translate/translatetext?from=zh-Hans&to='+l+'&isEnterpriseClient=false'
 result={}
 for start in range(0,len(ss),12):
  batch=ss[start:start+12]
  public=[s.replace('手筆','SHOUBI_BRAND') for s in batch]
  request=urllib.request.Request(url,data=json.dumps(public,ensure_ascii=False).encode(),headers={'Content-Type':'application/json'})
  for attempt in range(2):
   try:
    with urllib.request.urlopen(request,timeout=30) as r:data=json.load(r)
    if len(data)!=len(batch):raise ValueError('Incomplete translation')
    values=[v['translations'][0]['text'].replace('SHOUBI_BRAND','手筆') for v in data]
    if any(not v.strip() for v in values):raise ValueError('Empty translation')
    result.update(zip(batch,values));break
   except Exception:
    if attempt:raise
    time.sleep(1)
  print(l,start+len(batch),'/',len(ss),flush=True)
 return l,result
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
 results=list(pool.map(lambda l:translate(l,missing[l]),LANGS))
for l,updates in results:dicts[l].update(updates)
# Bibliographic identifiers are exact citations; retain their original titles and numbers.
for l in LANGS:
 for citation in object_numbers:dicts[l][citation]=citation
# Oracle captions retain exact catalogue citations; translate the image type only.
caption_prefixes={
 '原器图':['Object photograph','Photographie de l’objet','Фотография предмета','صورة القطعة','Fotografía del objeto'],
 '馆藏照片一':['Museum photograph 1','Photographie du musée 1','Музейная фотография 1','صورة المتحف 1','Fotografía del museo 1'],
 '馆藏照片二':['Museum photograph 2','Photographie du musée 2','Музейная фотография 2','صورة المتحف 2','Fotografía del museo 2'],
 '旧拓一':['Historical rubbing 1','Estampage ancien 1','Исторический эстамп 1','طبعة أثرية 1','Calco histórico 1'],
 '旧拓二':['Historical rubbing 2','Estampage ancien 2','Исторический эстамп 2','طبعة أثرية 2','Calco histórico 2']}
for text in keys:
 for prefix,values in caption_prefixes.items():
  if text.startswith(prefix+' · '):
   for l,value in zip(LANGS,values):dicts[l][text]=value+' · '+text.split(' · ',1)[1]

# Apply only after all languages completed, preserving parity and compact existing format.
assert all(set(dicts[l])==set(dicts['en']) for l in LANGS)
for l in LANGS:Path('locales218/'+l+'.json').write_text(json.dumps(dicts[l],ensure_ascii=False,separators=(',',':'))+'\n')
p=Path('release300/locale-source.json');prior=json.loads(p.read_text()) if p.exists() else []
p.write_text(json.dumps(sorted(set(prior+keys)),ensure_ascii=False,indent=2)+'\n')
print('Catalogue localization complete',flush=True)
