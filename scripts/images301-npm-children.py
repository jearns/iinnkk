import importlib.util,re,json,concurrent.futures
from pathlib import Path
s=importlib.util.spec_from_file_location('npm301',Path(__file__).with_name('images301-npm.py'));m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
root=m.ROOT; old=json.loads((root/'release300/catalogue-enrichment.json').read_text())['shiqi'];html=m.get(old['url']).decode();ids=list(dict.fromkeys(re.findall(r'(?:Collection/Detail/|Pub/Detail/|uid/)(\d+)',html)));wanted={re.search(r'imageId=(\d+)',src['url'])[1]:(p,i) for i,(src,p) in enumerate(zip(old['imageSources300'],old['pages']))};mapped=[];errors=[]
def child(cid):
 try:
  u=f'https://digitalarchive.npm.gov.tw/Collection/Detail/{cid}?dep=P';s=m.get(u).decode();matches=[]
  for tag in re.findall(r'<img\b[^>]*>',s,re.I):
   i=re.search(r'data-image-id="(\d+)"',tag);n=re.search(r'data-image-name="([^"]+)"',tag)
   if i and n and i[1] in wanted:matches.append((i[1],n[1]))
  if not matches:return []
  url=f'https://digitalarchive.npm.gov.tw/opendata/Integrate/GetJson?cid={cid}&dept=P&imageName=';d=json.loads(m.get(url));services={c['label']:c['images'][0]['resource']['service']['@id'] for c in d['sequences'][0]['canvases']};jobs=[]
  for imageid,name in matches:
   if name in services:jobs.append({'old':wanted[imageid][0],'work':'shiqi','name':name,'service':services[name],'manifest':url,'catalogue':u,'pageIndex':wanted[imageid][1]})
  return jobs
 except Exception as e:errors.append({'cid':cid,'error':str(e)});return []
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
 for jobs in ex.map(child,ids):mapped+=jobs
# Skip already replaced cover.
prior_path=root/'release301/image-npm-replacements.json';prior=json.loads(prior_path.read_text()) if prior_path.exists() else {};mapped=list({j['old']:j for j in mapped if j['old'] not in prior}.values())
print('Child jobs',len(mapped),'errors',len(errors),flush=True);rows=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
 for row in ex.map(m.fetch_image,mapped):rows.append(row)
prior.update({r['old']:r for r in rows if 'path' in r});prior_path.write_text(json.dumps(prior,ensure_ascii=False,indent=2));(root/'release301/image-npm-children-report.json').write_text(json.dumps({'jobs':len(mapped),'replaced':sum('path' in r for r in rows),'errors':errors,'unresolved':[r for r in rows if 'path' not in r]},ensure_ascii=False,indent=2));print('Child done',sum('path' in r for r in rows),flush=True)
