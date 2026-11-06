import json,urllib.request,urllib.parse,concurrent.futures,time,hashlib
from pathlib import Path
from PIL import Image,ImageFile
from io import BytesIO
ROOT=Path(__file__).resolve().parents[1]
m=json.loads((ROOT/'timeline/manifest.json').read_text()); paths={}
for id,w in m['entries'].items():
 for p in [*w.get('pages',[]),w.get('cover143')]:
  p=p if isinstance(p,str) else p.get('image','') if isinstance(p,dict) else ''
  if p:paths.setdefault(p,[]).append(id)
known=json.loads((ROOT/'features/calendar/catalogue-images.json').read_text())
existing={}
out=ROOT/'features/library/image-resolution-audit.json'
if out.exists():existing=json.loads(out.read_text()).get('images',{})
def check(item):
 p,ids=item
 if p in existing:return p,existing[p]
 row={'works':list(dict.fromkeys(ids)),'watermarkReview':'unreviewed'}
 try:
  local=ROOT/p
  if local.exists():
   with Image.open(local) as im:row.update(width=im.width,height=im.height)
   row['source']='local-bytes'
  elif p in known:row.update(width=known[p]['width'],height=known[p]['height'],source='audited300-metadata')
  else:
   u=p if p.startswith('https://') else 'https://iinnkk.me/'+urllib.parse.quote(p,safe='/')
   r=urllib.request.urlopen(urllib.request.Request(u,headers={'Range':'bytes=0-65535'}),timeout=9)
   parser=ImageFile.Parser();read=0
   try:
    while read<65536 and parser.image is None:
     b=r.read(min(4096,65536-read))
     if not b:break
     read+=len(b);parser.feed(b)
   finally:r.close()
   if parser.image is None:raise ValueError('image header not found in first64KiB')
   row.update(width=parser.image.width,height=parser.image.height,source='published-header',headerBytes=read)
  row['shortEdge']=min(row['width'],row['height']);row['longEdge']=max(row['width'],row['height']);row['strict1080']=row['shortEdge']>=1080;row['atLeast2MP']=row['width']*row['height']>=1920*1080;row['aspectRatio']=round(row['width']/row['height'],3)
 except Exception as e:row['error']=str(e)[:150]
 return p,row
start=time.time();data={}
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
 for i,(p,r) in enumerate(pool.map(check,paths.items()),1):
  data[p]=r
  if i%100==0:
   print(i,'/',len(paths),flush=True)
   out.write_text(json.dumps({'criterion':'Strict still image: short edge >=1080 actual pixels. Long scrolls additionally report area/aspect ratio; no upscaling. Watermarks require visual review.','images':data},ensure_ascii=False,indent=2))
report={'criterion':'Strict still image: short edge >=1080 actual pixels. Long scrolls additionally report area/aspect ratio; no upscaling. Watermarks require visual review.','total':len(data),'strictPass':sum(r.get('strict1080',False) for r in data.values()),'below1080':sum(r.get('shortEdge',1080)<1080 for r in data.values()),'unreadable':sum('error'in r for r in data.values()),'seconds':round(time.time()-start),'images':data}
out.write_text(json.dumps(report,ensure_ascii=False,indent=2));print({k:v for k,v in report.items()if k!='images'},flush=True)
