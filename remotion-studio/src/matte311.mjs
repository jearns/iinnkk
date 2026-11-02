import{cameraTransform308}from'./tracking308.mjs';
export function paperViewport311(iw,ih,w,h){const k=Math.min(w/iw,h/ih),width=iw*k,height=ih*k;return{x:(w-width)/2,y:(h-height)/2,width,height}}
export function paperTransform311(iw,ih,w,h,scale,focus){const viewport=paperViewport311(iw,ih,w,h),m=cameraTransform308(iw,ih,viewport.width,viewport.height,scale,focus);return{...m,x:m.x+viewport.x,y:m.y+viewport.y,viewport}}
export function paintMatte311(ctx,v,w,h){ctx.save();ctx.fillStyle='#000';ctx.fillRect(0,0,w,v.y);ctx.fillRect(0,v.y+v.height,w,h-v.y-v.height);ctx.fillRect(0,v.y,v.x,v.height);ctx.fillRect(v.x+v.width,v.y,w-v.x-v.width,v.height);ctx.restore()}
