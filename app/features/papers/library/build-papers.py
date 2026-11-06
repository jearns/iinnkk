from PIL import Image,ImageOps,ImageChops,ImageDraw,ImageFilter
import numpy as np,json,hashlib,os,io
W,H=900,1200
specs={
'cloud-dragon': {'texture':(0,490,581,775),'tileScale':1.35,'sealRects':[(236,12,419,260),(244,307,420,481)],'threshold':(1.2,7,23),'positions':[(.94,.09,.13),(.02,.86,.12)]},
'hanshi-gold': {'texture':(225,10,495,650),'tileScale':1.6,'sealRects':[(105,292,211,402),(91,451,221,588)],'threshold':(.42,6,26),'positions':[(.025,.105,.11),(.97,.885,.12)]},
'boyuan-ivory': {'texture':(15,30,380,1760),'tileScale':1.6,'sealRects':[(622,513,870,765),(606,1007,910,1321)],'threshold':(.65,3,14),'positions':[(.965,.11,.105),(.025,.87,.12)]},
'zixu-pattern': {'texture':(0,0,390,180),'tileScale':1.65,'sealRects':[(148,195,278,341)],'threshold':(1.3,6,19),'positions':[(.97,.88,.13)]},
'shusu-colophon': {'texture':(0,251,330,440),'tileScale':1.7,'sealRects':[(45,31,257,247)],'threshold':(.9,7,27),'positions':[(.025,.11,.13)]}
}
rows=json.load(open('features/papers/picker/papers.json'));result=[]
def mirrored_texture(im,rect,scale):
 tile=im.crop(rect);tile=tile.resize((round(tile.width*scale),round(tile.height*scale)),Image.Resampling.LANCZOS)
 out=Image.new('RGB',(W,H));tw,th=tile.size
 # Reflection makes values continuous across each tile boundary.
 for y in range(0,H,th):
  for x in range(0,W,tw):
   t=tile
   if (x//tw)%2:t=ImageOps.mirror(t)
   if (y//th)%2:t=ImageOps.flip(t)
   out.paste(t,(x,y))
 return out

def seal_layer(im,rect,parameters):
 s=im.crop(rect).convert('RGBA');a=np.array(s).astype(np.float32);r,g,b=a[:,:,0],a[:,:,1],a[:,:,2];coef,bias,span=parameters
 alpha=np.clip((r-g-coef*np.maximum(g-b,0)-bias)/span,0,1)
 # Suppress the crop boundary independently of chroma; no rectangular paper patch.
 h,w=alpha.shape;yy,xx=np.mgrid[:h,:w];edge=np.minimum.reduce([xx,yy,w-1-xx,h-1-yy]);alpha*=np.clip(edge/7,0,1)
 a[:,:,3]=np.round(alpha*255);return Image.fromarray(a.astype('uint8'),'RGBA')
for row in rows:
 spec=specs[row['id']];src=Image.open(row['image']).convert('RGB');out=mirrored_texture(src,spec['texture'],spec['tileScale']).convert('RGBA');stamps=[]
 for box,pos in zip(spec['sealRects'],spec['positions']):
  stamp=seal_layer(src,box,spec['threshold']);ww=round(pos[2]*W);hh=round(stamp.height*ww/stamp.width);stamp=stamp.resize((ww,hh),Image.Resampling.LANCZOS);x=round(pos[0]*W-ww/2);y=round(pos[1]*H-hh/2);out.alpha_composite(stamp,(x,y));stamps.append({'sourceRect312':dict(zip(['x','y','w','h'],[box[0],box[1],box[2]-box[0],box[3]-box[1]])),'x':x,'y':y,'width':ww,'height':hh,'relativeWidth':pos[2]})
 out=out.convert('RGB');path='timeline/pages/papers313/'+row['id']+'.png';buffer=io.BytesIO();out.save(buffer,format='PNG',optimize=True);data=buffer.getvalue();temp=path+'.tmp';f=open(temp,'wb');f.write(data);f.flush();os.fsync(f.fileno());f.close();os.replace(temp,path);thumb=out.copy();thumb.thumbnail((240,320));thumbpath='timeline/pages/papers313/'+row['id']+'-thumb.webp';thumb.save(thumbpath,'WEBP',quality=88,method=6)
 r=dict(row);r.update(image=path,thumbnail=thumbpath,width=W,height=H,imageSha256=hashlib.sha256(open(path,'rb').read()).hexdigest(),processing='取原图天然留白纸纹作镜像平铺，原有朱印提取后缩小靠边排版；属于设计排版，不是完整历史原纸照片。未生成假印或手写文字。',naturalBlank=True,hasOriginalSeals=True)
 r['story']=row['story']+' 此版本取原纸纹与原印作设计排版，朱印缩小置于边缘，不代表原卷的实际布局。'
 r['layout313']={'kind':'original-texture-and-edge-seals','source312':row['image'],'textureRect312':dict(zip(['x','y','w','h'],[spec['texture'][0],spec['texture'][1],spec['texture'][2]-spec['texture'][0],spec['texture'][3]-spec['texture'][1]])),'textureMethod':'reflected tiling','textureScale':spec['tileScale'],'sealExtraction':{'method':'red-chroma alpha, soft crop-edge mask','coefficient':spec['threshold'][0],'bias':spec['threshold'][1],'range':spec['threshold'][2]},'seals':stamps,'centerWritingArea':{'x':.175,'y':0,'w':.65,'h':1}}
 result.append(r)
json.dump(result,open('features/papers/library/papers.json','w'),ensure_ascii=False,indent=2);open('features/papers/library/papers.json','a').write('\n')
out=Image.new('RGB',(1250,375),'#efebe3');d=ImageDraw.Draw(out)
for i,r in enumerate(result):
 im=Image.open(r['image']);im.thumbnail((240,320));out.paste(im,(i*250+5,20));d.text((i*250+5,350),r['id'],fill='black')
out.save('/tmp/papers313-contact.jpg')
print('5 papers composed')
