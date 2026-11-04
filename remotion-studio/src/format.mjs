export function artworkRatio(draft, surface) {
  surface=surface?.surface||surface;
  if(surface?.tracking308?.pages?.[0]?.aspect>0)return surface.tracking308.pages[0].aspect;
  if(surface?.width>0&&surface?.height>0)return surface.width/surface.height;
  const b=draft?.sheetBounds194;
  return b?.w>0&&b?.h>0?b.w/b.h:Number(draft?.values?.ratio)||.75;
}
// Even encoder dimensions, preserving the artwork aspect to within one pixel.
export function videoFormat(ratio, maxSide=1920) {
  const r=Number.isFinite(+ratio)&&+ratio>0?+ratio:.75;
  const side=Math.max(2,Math.round(maxSide/2)*2),even=n=>Math.max(2,Math.round(n/2)*2);
  const width=r>=1?side:even(side*r),height=r>=1?even(side/r):side;
  return {width,height,orientation:r>=1?'landscape':'portrait',ratio:width+':'+height};
}
