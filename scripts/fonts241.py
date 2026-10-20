"""Rebuild a renamed educational font subset and 512-codepoint WOFF2 shards.
Usage: python scripts/fonts241.py INPUT.ttf NAME CHARACTERS.txt OUTPUT_DIR
Requires fonttools[woff]. No network access; source URLs/licenses in fonts241/credits.html.
Wang LiSu corresponding modified TTF source is fonts241/clerical-source.ttf.
"""
import sys,copy
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools import subset
source,name,chars,out=sys.argv[1:];out=Path(out);out.mkdir(exist_ok=True)
f=TTFont(source);available=f.getBestCmap();codepoints={ord(c) for c in Path(chars).read_text() if ord(c) in available}
family='Shoubi Education '+name.title()+' 241'
for item in f['name'].names:
 if item.nameID in [1,3,4,6,16,17]:
  text='Regular' if item.nameID==17 else family.replace(' ','') if item.nameID==6 else family
  item.string=text.encode(item.getEncoding(),errors='replace')
ss=subset.Subsetter();ss.populate(unicodes=codepoints);ss.subset(f)
if name=='clerical':f.save(out/'clerical-source.ttf')
for block in sorted({c>>9 for c in codepoints}):
 chunk=copy.deepcopy(f);chunk.flavor='woff2';ss=subset.Subsetter();ss.populate(unicodes={c for c in codepoints if c>>9==block});ss.subset(chunk);chunk.save(out/f'{name}-{block}.woff2')
