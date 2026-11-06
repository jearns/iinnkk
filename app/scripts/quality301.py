import json
from pathlib import Path
from PIL import Image
m=json.loads(Path('timeline/manifest.json').read_text());previous=json.loads(Path('features/library/image-resolution-audit.json').read_text())['images'];paths={}
for id,w in m['entries'].items():
 for p in [*w.get('pages',[]),w.get('cover143')]:
  p=p if isinstance(p,str) else p.get('image','') if isinstance(p,dict) else ''
  if p:paths.setdefault(p,[]).append(id)
rows={}
for p,ids in paths.items():
 r={**previous.get(p,{}),'works':list(dict.fromkeys(ids))}
 if p.startswith('features/library/assets/') and Path(p).exists():
  with Image.open(p) as im:r.update(width=im.width,height=im.height,shortEdge=min(im.size),strict1080=min(im.size)>=1080)
  r.update(watermarkReview='No overlaid digital watermark observed in 301 contact review. Original seals, colophons and museum calibration labels are not classified as added watermarks.',review301=True);r.pop('error',None)
 rows[p]=r
report={'criterion':'Still images: actual short edge >=1080 pixels; no upscaling. Long scrolls may have a different aspect ratio.','total':len(rows),'pass':sum(r.get('strict1080',False) for r in rows.values()),'below1080':sum(r.get('shortEdge',1080)<1080 for r in rows.values()),'unverified':sum(not r.get('width') or 'error' in r for r in rows.values()),'watermarkReviewIncomplete':sum(not r.get('review301') for r in rows.values()),'images':rows}
Path('features/library/quality-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print({k:v for k,v in report.items() if k!='images'})
