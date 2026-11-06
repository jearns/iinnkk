import json,urllib.request,urllib.parse,concurrent.futures,re,html,os
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
from io import BytesIO
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'features/library/assets/outlines';OUT.mkdir(parents=True,exist_ok=True)
queries={'taj':'Taj Mahal silhouette filetype:bitmap','eiffel':'Eiffel Tower silhouette filetype:bitmap','angkor':'Angkor Wat sunrise silhouette filetype:bitmap','heaven':'Temple Heaven silhouette filetype:bitmap','hagia':'Hagia Sophia sunset filetype:bitmap','notredame':'Notre Dame silhouette filetype:bitmap','burj':'Burj Khalifa sunset filetype:bitmap','sagrada':'Sagrada Familia silhouette filetype:bitmap','petronas':'Petronas towers sunset filetype:bitmap','borobudur':'Borobudur silhouette filetype:bitmap'}
def fetch(u):return urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Shoubi301/1.0(public asset research)'}),timeout=25).read()
def query(item):
 key,q=item
 try:
  u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','generator':'search','gsrsearch':q,'gsrnamespace':6,'gsrlimit':6,'prop':'imageinfo','iiprop':'url|extmetadata|size','iiurlwidth':500,'format':'json'})
  d=json.loads(fetch(u));rows=[]
  for p in d.get('query',{}).get('pages',{}).values():
   v=p.get('imageinfo',[{}])[0]
   if not v.get('url')or v['url'].split('?')[0].lower().endswith(('.svg','.pdf','.webm','.tif','.tiff')):continue
   ext=v.get('extmetadata',{});desc=html.unescape(re.sub('<[^>]+>','',ext.get('ImageDescription',{}).get('value','')))
   row={'key':key,'title':p['title'],'url':v['url'].split('?')[0],'thumburl':v.get('thumburl',v['url']),'width':v.get('width'),'height':v.get('height'),'page':v.get('descriptionurl'),'description':desc,'license':ext.get('LicenseShortName',{}).get('value'),'licenseUrl':ext.get('LicenseUrl',{}).get('value'),'artist':html.unescape(re.sub('<[^>]+>','',ext.get('Artist',{}).get('value','')))}
   try:
    b=fetch(row['thumburl']);path=OUT/(key+'-'+str(len(rows))+'.jpg');path.write_bytes(b);row['preview']=str(path.relative_to(ROOT));rows.append(row)
   except Exception:pass
  return key,rows
 except Exception as e:return key,{'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=5)as pool:results=dict(pool.map(query,queries.items()))
(ROOT/'features/library/image-outline-candidates.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
# Contact sheet for source selection only; source images not modified in published assets.
imgs=[]
for key,rows in results.items():
 if not isinstance(rows,list):continue
 for row in rows:
  im=Image.open(ROOT/row['preview']).convert('RGB');im.thumbnail((230,150));card=Image.new('RGB',(250,190),'#fff');card.paste(im,((250-im.width)//2,0));ImageDraw.Draw(card).text((5,155),row['key']+'-'+str(rows.index(row))+' '+str(row['width'])+'x'+str(row['height']),fill='black');imgs.append(card)
sheet=Image.new('RGB',(250*6,190*((len(imgs)+5)//6)),'#ddd')
for i,im in enumerate(imgs):sheet.paste(im,((i%6)*250,(i//6)*190))
sheet.save('/tmp/outline301-contact.jpg');print({k:len(v)if isinstance(v,list)else v for k,v in results.items()},flush=True)
