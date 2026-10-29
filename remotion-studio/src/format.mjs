export function artworkRatio(draft, surface) {
  if(surface?.width>0&&surface?.height>0)return surface.width/surface.height;
  const b=draft?.sheetBounds194;
  return b?.w>0&&b?.h>0?b.w/b.h:Number(draft?.values?.ratio)||.75;
}
export function videoFormat(ratio) {return ratio>=1?{width:1920,height:1080,orientation:'landscape',ratio:'16:9'}:{width:1080,height:1920,orientation:'portrait',ratio:'9:16'};}
