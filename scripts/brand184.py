"""Render the favicon's canonical vector hand into the touch icon."""
from pathlib import Path
import re
from PIL import Image, ImageDraw
from fontTools.pens.basePen import BasePen
from fontTools.svgLib.path import parse_path
scale=9
im=Image.new('RGBA',(100*scale,100*scale),(0,0,0,0));draw=ImageDraw.Draw(im)
draw.rounded_rectangle((3*scale,3*scale,97*scale,97*scale),radius=4*scale,fill='#ae392e')
draw.rectangle((7*scale,7*scale,93*scale,93*scale),outline='#f5ead5',width=round(1.3*scale))
class Glyph(BasePen):
 def __init__(self):super().__init__(None);self.points=[]
 def _moveTo(self,p):self.points=[p]
 def _lineTo(self,p):self.points.append(p)
 def _qCurveToOne(self,c,p):
  a=self.points[-1]
  for i in range(1,25):
   t=i/24;self.points.append(((1-t)**2*a[0]+2*(1-t)*t*c[0]+t*t*p[0],(1-t)**2*a[1]+2*(1-t)*t*c[1]+t*t*p[1]))
 def _closePath(self):draw.polygon([((19.553903345724905+x*.07434944237918216)*scale,(70.29739776951672-y*.07434944237918216)*scale)for x,y in self.points],fill='#f5ead5')
svg=Path('favicon.svg').read_text();path=re.search(r'<path[^>]* d="([^"]+)"',svg).group(1);parse_path(path,Glyph());im.resize((180,180),Image.Resampling.LANCZOS).save('apple-touch-icon.png')
