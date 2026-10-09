"""Generate display-only covers; original facsimiles and their crop metadata are untouched."""
from PIL import Image,ImageOps
from pathlib import Path
import json,hashlib
root=Path.cwd();folder=root/'home-covers154';folder.mkdir(exist_ok=True);rows={};keep=set()
def number(value,low,high,default):
 try:return min(high,max(low,float(value)))
 except (TypeError,ValueError):return default
for key,c in json.loads((root/'timeline/manifest.json').read_text())['entries'].items():
 source=c.get('cover143') or next(iter(c.get('pages') or []),'');path=root/source
 if not source.startswith('timeline/pages/') or not path.is_file() or '..' in Path(source).parts:continue
 raw=c.get('coverCrop145') or {};crop={'zoom':number(raw.get('zoom'),1,4,1),'x':number(raw.get('x'),0,100,50),'y':number(raw.get('y'),0,100,50)}
 try:
  with Image.open(path) as original:
   im=ImageOps.exif_transpose(original).convert('RGB');w,h=im.size;cw,ch=(h*4/3,h) if w/h>4/3 else (w,w*3/4);cw/=crop['zoom'];ch/=crop['zoom'];x=(w-cw)*crop['x']/100;y=(h-ch)*crop['y']/100;im=im.crop((round(x),round(y),round(x+cw),round(y+ch)));im.thumbnail((960,720),Image.Resampling.LANCZOS);fingerprint=hashlib.sha256(path.read_bytes()+b'ratio4:3-v155'+json.dumps(crop,sort_keys=True).encode()).hexdigest()[:12];target=folder/(key+'-'+fingerprint+'.webp');im.save(target,'WEBP',quality=80,method=5);keep.add(target.name);rows[key]={'source':source,'crop':crop,'url':'home-covers154/'+target.name}
 except (OSError,ValueError):continue
for p in folder.glob('*.webp'):
 if p.name not in keep:p.unlink()
(root/'home-covers154.json').write_text(json.dumps(rows,ensure_ascii=False,separators=(',',':')))
print('Light covers:',len(rows),sum(p.stat().st_size for p in folder.glob('*.webp')),'bytes')
