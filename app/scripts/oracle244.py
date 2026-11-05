"""Regenerate the source-backed oracle SVG packs: python scripts/oracle244.py FONT.woff."""
import hashlib,json,sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
font=Path(sys.argv[1]);out=Path('oracle244');out.mkdir(exist_ok=True)
f=TTFont(font);glyphs=f.getGlyphSet();packs={};characters={}
for cp,name in f.getBestCmap().items():
    shape=SVGPathPen(glyphs);glyphs[name].draw(shape);bounds=BoundsPen(glyphs);glyphs[name].draw(bounds)
    if not bounds.bounds:continue
    x,y,r,t=bounds.bounds;scale=84/max(r-x,t-y);tx=50-(x+r)*scale/2;ty=50+(y+t)*scale/2
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="甲骨字形"><path fill="currentColor" transform="translate({round(tx,4)} {round(ty,4)}) scale({round(scale,6)} {round(-scale,6)})" d="{shape.getCommands()}"/></svg>'
    bucket=str(cp>>9);packs.setdefault(bucket,{})[chr(cp)]=svg;characters[chr(cp)]=bucket
for bucket,rows in packs.items():(out/('p'+bucket+'.json')).write_text(json.dumps(rows,ensure_ascii=False,separators=(',',':')))
manifest=json.loads((out/'manifest.json').read_text());mapping=json.loads(Path('fonts241/manifest.json').read_text())['seal']['mapping']
manifest.update(characters=characters,count=len(characters),fontSha256=hashlib.sha256(font.read_bytes()).hexdigest(),aliases={c:t for c,t in mapping.items() if c!=t and c not in characters and t in characters})
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')))
print(f'{len(characters)} mapped glyphs; {len(packs)} lazy packs')
