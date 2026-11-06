import json,re,urllib.request,urllib.parse,concurrent.futures,hashlib,os,time
from pathlib import Path
from io import BytesIO
from PIL import Image
ROOT=Path('/workspace/scratch/b70d4350fc73/iinnkk300'); OUT=ROOT/'features/library/assets/npm';OUT.mkdir(parents=True,exist_ok=True)
enrich=json.loads((ROOT/'features/calendar/catalogue-enrichment.json').read_text())
works={k:v for k,v in enrich.items() if 'digitalarchive.npm.gov.tw/Collection/Detail/' in v.get('url','')}
def get(url):
 url=urllib.parse.quote(url,safe=':/?=&%[]+,')
 return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read()
def prepare(k,w):
 try:
  cid=re.search(r'/Detail/(\d+)',w['url'])[1];s=get(w['url']).decode();names={}
  for tag in re.findall(r'<img\b[^>]*>',s,re.I):
   i=re.search(r'data-image-id="(\d+)"',tag);n=re.search(r'data-image-name="([^"]+)"',tag)
   if i and n:names[i[1]]=n[1]
  manifest_url='https://digitalarchive.npm.gov.tw/opendata/Integrate/GetJson?cid='+cid+'&dept=P&imageName='
  m=json.loads(get(manifest_url)); canvases=m['sequences'][0]['canvases'];services={c['label']:c['images'][0]['resource']['service']['@id'] for c in canvases}
  sources=w.get('imageSources300') or w.get('sources300') or []
  jobs=[]
  for index,path in enumerate(w['pages']):
   source=sources[index].get('url',sources[index].get('source',''))
   imageid=re.search(r'imageId=(\d+)',source)
   name=names.get(imageid[1]) if imageid else None
   if not name or name not in services:jobs.append({'old':path,'work':k,'error':'Canonical image mapping absent','imageId':imageid[1] if imageid else None});continue
   jobs.append({'old':path,'work':k,'name':name,'service':services[name],'manifest':manifest_url,'catalogue':w['url'],'pageIndex':index})
  return jobs
 except Exception as e:return [{'work':k,'error':str(e)}]
# Regex literals are ordinary raw strings.
def fetch_image(job):
 if job.get('error'):return job
 try:
  info=json.loads(get(job['service']+'/info.json'));size=(info['width'],info['height'])
  if min(size)<1080:return {**job,'error':'Official original short edge below1080','originalSize':size}
  source=job['service']+'/full/full/0/default.jpg';b=get(source);im=Image.open(BytesIO(b));im.load()
  if min(im.size)<1080:return {**job,'error':'Decoded short edge below1080','originalSize':im.size}
  path=OUT/(job['work']+'-'+str(job['pageIndex']+1)+'.webp');tmp=path.with_suffix('.tmp');im.convert('RGB').save(tmp,'WEBP',quality=94,method=6);tmp.replace(path)
  return {**job,'path':str(path.relative_to(ROOT)),'source':source,'width':im.width,'height':im.height,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'license':'CC BY 4.0','credit':'国立故宫博物院，台北，CC BY 4.0 @ www.npm.gov.tw。','watermark':'No digital watermark observed in official photo sample; collection labels and calibration bars may be present outside artwork.'}
 except Exception as e:return {**job,'error':str(e)}
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:groups=list(ex.map(lambda kv:prepare(*kv),works.items()))
 jobs=[j for group in groups for j in group];(ROOT/'features/library/image-npm-plan.json').write_text(json.dumps(jobs,ensure_ascii=False,indent=2));print('Jobs',len(jobs),'mappingErrors',sum('error' in j for j in jobs),flush=True)
 results=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
  for i,row in enumerate(ex.map(fetch_image,jobs),1):
   results.append(row)
   if i%10==0:print('Fetched',i,'valid',sum('path' in r for r in results),flush=True)
 (ROOT/'features/library/image-npm-replacements.json').write_text(json.dumps({r['old']:r for r in results if 'path' in r},ensure_ascii=False,indent=2))
 (ROOT/'features/library/image-npm-report.json').write_text(json.dumps({'works':len(works),'attempted':len(results),'replaced':sum('path' in r for r in results),'unresolved':[r for r in results if 'path' not in r]},ensure_ascii=False,indent=2))
 print('Done',len(results),sum('path' in r for r in results),flush=True)
