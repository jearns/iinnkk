"""Rebuild small UI/seal font faces without changing their original outlines (fontTools)."""
from pathlib import Path
import json,re
from fontTools import subset
from fontTools.ttLib import TTFont
sources=['index-source106.html','app.js','revision38.js','revision39.js','revision41.js','revision42.js','revision43.js','revision47.js','studio50.js','revision53.js','revision54.js','revision55.js','revision88.js','revision97.js','revision100.js','revision129.js','revision145.js']
ui=''.join(Path(p).read_text() for p in sources)
seals='手筆笔亲親今日真跡迹书書見见墨如我留下以为為随隨时時写寫字深浅淺一方印章字面'
def build(src,dst,text,family,css):
    font=TTFont(src); points=sorted(set(map(ord,text))&set(font.getBestCmap()))
    options=subset.Options(); options.recalc_timestamp=False
    sub=subset.Subsetter(options=options);sub.populate(unicodes=points);sub.subset(font);font.flavor='woff2';font.save(dst)
    ranges=[]
    for p in points:
        if ranges and p==ranges[-1][1]+1:ranges[-1][1]=p
        else:ranges.append([p,p])
    ur=','.join('U+%X'%a+('-%X'%b if b!=a else '') for a,b in ranges)
    rule='@font-face{font-family:'+family+';src:url("'+dst+'") format("woff2");font-display:swap;unicode-range:'+ur+'}'
    path=Path(css);s=path.read_text();s=re.sub(r'/\* subset165 start \*/.*?/\* subset165 end \*/\n?','',s,flags=re.S)
    # Later matching face wins only for its glyph range; other glyphs retain the full original font.
    end=s.index('\n',s.index('font-family:'+family))
    s=s[:end+1]+'/* subset165 start */\n'+rule+'\n/* subset165 end */\n'+s[end+1:];path.write_text(s)
    print(dst,Path(dst).stat().st_size,'bytes',len(points),'glyphs')
build('fonts/interface39.woff2','fonts/interface-core165.woff2',ui,'Caption38','annotation.css')
build('fonts/YiShanBeiZhuanTi.woff2','fonts/seal-core165.woff2',seals,'YiShanBeiSeal','revision65.css')
