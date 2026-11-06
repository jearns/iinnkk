import os,re,json,math,urllib.request,urllib.parse,html,concurrent.futures,hashlib
from PIL import Image
from io import BytesIO
Image.MAX_IMAGE_PIXELS=500_000_000
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));OUT=ROOT+'/features/library/assets/dpm';os.makedirs(OUT,exist_ok=True)
items=[
('boyuan','王珣行书伯远帖卷.png','伯远帖卷，故宫博物院藏。完整卷分段，原作与卷后题跋按原图顺序保留。','Public domain (PD-Art)'),
('zhongqiu','王献之行草书中秋帖卷.png','中秋帖卷，故宫博物院藏。完整卷分段，传世本的归属依馆方研究。','Public domain (PD-Art)'),
('liqi','汉 佚名 礼器碑 0.jpg','礼器碑拓本图；与旧版故宫明拓册页不同装帧和拓印版本，不将新图与旧册页逐页混排。','Public domain (PD-Art)'),
('xuanmi','唐 柳公权 玄秘塔碑整拓.jpg','玄秘塔碑整拓；替换旧版低清册页。拓印年代与原碑建刻年代分别理解。','Public domain (PD-Art)'),
('shichen','史晨前后碑拓本.jpg','史晨碑前后整拓；替换旧版故宫低清册页，不宣称与旧版是同一拓本。','Public domain (PD-Art)'),
('tianfa','天发神谶碑之一.jpg','天发神谶碑摹本之一；这是摹本图，不冒称原石或旧拓。','Public domain'),
('shimen','石门十三品 石门颂.jpg','石门颂原刻照片，不是拓片；替换低清拓本时须同步保留图像类型说明。','CC BY-SA (author per Commons page)')]
def fetch(u,timeout=90):
 return urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Shoubi301 image curation / public domain art audit'}),timeout=timeout).read()
def go(item):
 k,title,note,license=item;page='https://commons.wikimedia.org/wiki/File:'+urllib.parse.quote(title)
 try:
  s=fetch(page,30).decode();m=re.search(r'class="fullImageLink"[^>]*>\s*<a href="([^"]+)',s)
  if not m:raise RuntimeError('No published original image link')
  src=html.unescape(m[1]).split('?')[0];raw=fetch(src);im=Image.open(BytesIO(raw));im.load();ow,oh=im.size
  if min(im.size)<1080:raise RuntimeError('Original below 1080 shortedge: '+str(im.size))
  # Preserve 2160px-high scrolls, split into manageable continuous panels. No upscaling.
  pages=[];meta=[];frames=[]
  if ow/oh>4:
   n=math.ceil(ow/3500)
   for i in range(n):frames.append(im.crop((round(ow*i/n),0,round(ow*(i+1)/n),oh)))
  else:
   frame=im.copy();frame.thumbnail((3600,4800));frames=[frame]
  for i,fr in enumerate(frames,1):
   if min(fr.size)<1080:raise RuntimeError('Derived below threshold '+str(fr.size))
   rel='features/library/assets/dpm/'+k+'-'+str(i)+'.webp';p=ROOT+'/'+rel;fr.convert('RGB').save(p,'WEBP',quality=93,method=5)
   pages.append(rel);meta.append({'path':rel,'width':fr.width,'height':fr.height,'bytes':os.path.getsize(p),'sha256':hashlib.sha256(open(p,'rb').read()).hexdigest(),'source':src})
  return k,{'title':title,'pages':pages,'cover143':pages[0],'originalSize':[ow,oh],'source':src,'sourcePage':page,'license':license,'versionNote301':note,'images':meta,'watermarkReview':'pending-visual-review'}
 except Exception as e:return k,{'error':str(e),'sourcePage':page}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:result=dict(pool.map(go,items))
json.dump(result,open(ROOT+'/features/library/image-dpm-replacements.json','w'),ensure_ascii=False,indent=2)
print(json.dumps({k:({'pages':len(v['pages']),'size':v['originalSize']} if 'pages'in v else v) for k,v in result.items()},ensure_ascii=False),flush=True)
