"""Subset upstream LXGW WenKai Light into one consistent, lazy-loaded grid family.
Usage: PYTHONPATH=... python3 scripts/grid-font287.py /path/LXGWWenKai-Light.ttf
Source: https://github.com/lxgw/LxgwWenKai (OFL-1.1); no outline changes.
"""
from fontTools.ttLib import TTFont
from fontTools import subset
from pathlib import Path
import sys,json,concurrent.futures
source=sys.argv[1];out=Path('grid-font287');font=TTFont(source);available=set(font.getBestCmap());font.close()
reading=json.loads(Path('reading239.json').read_text());grid=json.loads(Path('grid-text235.json').read_text())
priority='手笔今日大昨天小确幸静思伊人恋物去空愁'+grid['qian']+grid['lv']+''.join(q['q'] for q in reading['graded'])+''.join(c['simple286'] for b in reading['books'] for c in b['chapters'])
used=set(map(ord,priority));ordered=list(dict.fromkeys(ord(c) for c in priority if ord(c) in available));ordered+=sorted(cp for cp in available if cp not in set(ordered) and (0x20<=cp<=0x7e or 0x3400<=cp<=0x9fff or cp in used))
groups=[ordered[i:i+512] for i in range(0,len(ordered),512)]
def make(item):
 i,points=item;f=TTFont(source);options=subset.Options();options.flavor='woff2';options.name_IDs=['*'];s=subset.Subsetter(options=options);s.populate(unicodes=points);s.subset(f)
 for rec in f['name'].names:
  if rec.nameID in (1,3,4,6):
   name='Shoubi Grid WenKai 287' if rec.nameID!=6 else 'ShoubiGridWenKai287'
   rec.string=name.encode(rec.getEncoding(),errors='replace')
 f.flavor='woff2';p=out/('glyph-'+str(i)+'.woff2');f.save(p);return {'file':p.name,'chars':''.join(map(chr,points)),'bytes':p.stat().st_size}
with concurrent.futures.ProcessPoolExecutor(max_workers=4) as pool:rows=list(pool.map(make,enumerate(groups)))
(out/'manifest.json').write_text(json.dumps({'family':'Shoubi Grid WenKai 287','source':'https://github.com/lxgw/LxgwWenKai','license':'OFL-1.1','packs':rows},ensure_ascii=False,separators=(',',':')))
print('packs',len(rows),'bytes',sum(x['bytes'] for x in rows),'missing corpus',''.join(chr(cp) for cp in used-available))
