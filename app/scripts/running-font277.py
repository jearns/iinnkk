# Rebuild optional running-face supplements: fonttools[woff] required.
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools import subset
from collections import defaultdict
import json,hashlib,shutil
import sys,urllib.request
source=Path(sys.argv[1]) if len(sys.argv)>1 else Path('/tmp/ZhiMangXing277.ttf')
if not source.exists():source.write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/google/fonts/main/ofl/zhimangxing/ZhiMangXing-Regular.ttf',timeout=40).read())
font=TTFont(source);cmap=font.getBestCmap();current=json.loads(Path('fonts241/manifest.json').read_text())['running'];existing=set(current['characters']);missing=[cp for cp in cmap if chr(cp) not in existing and (0x3400<=cp<=0x9fff or chr(cp) in '，。！？；：、（）“”')];groups=defaultdict(list)
for cp in missing:groups[cp>>9].append(cp)
Path('fonts277').mkdir(exist_ok=True);chunks={}
for bucket,points in groups.items():
 f=TTFont(source);opts=subset.Options();opts.flavor='woff2';sub=subset.Subsetter(options=opts);sub.populate(unicodes=points);sub.subset(f)
 for r in f['name'].names:
  if r.nameID in (1,3,4,6):
   value='ShoubiRunningSupplement277' if r.nameID!=3 else 'ShoubiRunningSupplement277-'+str(bucket)
   r.string=value.encode(r.getEncoding(),errors='replace')
 f.flavor='woff2';tmp=Path('/tmp/running277.woff2');f.save(tmp);data=tmp.read_bytes();name='running-'+str(bucket)+'-'+hashlib.sha256(data).hexdigest()[:12]+'.woff2';Path('fonts277',name).write_bytes(data);chunks[str(bucket)]='fonts277/'+name
extra={'characters':''.join(map(chr,missing)),'chunks':chunks,'source':current['source'],'license':'OFL-1.1'}
Path('running-extra277.js').write_text('/* Same Zhi Mang Xing outlines as the evolution running face; missing glyphs only. */\nwindow.RunningExtra277='+json.dumps(extra,ensure_ascii=False,separators=(',',':'))+';\n');shutil.copy('fonts241/running-LICENSE.txt','fonts277/LICENSE.txt')
print('extra glyphs',len(missing),'chunks',len(chunks),'bytes',sum(f.stat().st_size for f in Path('fonts277').glob('*.woff2')))
