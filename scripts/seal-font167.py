"""Route simplified and traditional codepoints to the same original YiShan seal outlines."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools import subset
import json,re
source=Path('seal-chars.js').read_text()
map_=json.loads(re.search(r'SEAL_MAP=(\{.*?\});',source,re.S)[1])
f=TTFont('fonts/YiShanBeiZhuanTi.woff2');cmap=f.getBestCmap()
aliases={ord(trad):cmap[ord(simple)] for simple,trad in map_.items() if ord(simple) in cmap and ord(trad) not in cmap}
for table in f['cmap'].tables:
 if table.isUnicode():table.cmap.update({cp:g for cp,g in aliases.items() if table.format==12 or cp<=65535})
f.flavor='woff2';f.save('fonts/yishan167.woff2')
chars='手筆笔亲親今日真跡迹书書見见墨如我留下以为為随隨时時写寫字深浅淺一方印章字面'
points=sorted(set(map(ord,chars))&set(f.getBestCmap()))
sub=subset.Subsetter();sub.populate(unicodes=points);sub.subset(f);f.flavor='woff2';f.save('fonts/seal-core167.woff2')
rule='@font-face{font-family:YiShanBeiSeal;src:url("fonts/seal-core167.woff2") format("woff2");font-display:swap;unicode-range:'+','.join('U+%X'%x for x in points)+'}'
for css in ['revision65.css','homepage154.css']:
 p=Path(css);s=p.read_text();s=re.sub(r'/\* subset165 start \*/.*?/\* subset165 end \*/\n?','',s,flags=re.S)
 s=s.replace('fonts/YiShanBeiZhuanTi.woff2','fonts/yishan167.woff2')
 m=re.search(r'@font-face\{font-family:YiShanBeiSeal;[^{}]*\}',s);s=s[:m.end()]+'\n'+rule+s[m.end():];p.write_text(s)
print('traditional aliases:',len(aliases),'common glyphs:',len(points),'full bytes:',Path('fonts/yishan167.woff2').stat().st_size,'core bytes:',Path('fonts/seal-core167.woff2').stat().st_size)
