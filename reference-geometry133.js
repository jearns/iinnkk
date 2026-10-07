/* Three vertical columns, with the writing column always centred. */
(function(root){
 function threeColumns(columns,index,fallback={x:0,w:1}){const c=columns[index]||{x:fallback.x+fallback.w/2,w:fallback.w},center=c.x,width=Math.max(.01,c.w||fallback.w),neighbors=[columns[index-1],columns[index+1]].filter(Boolean),half=Math.max(width*1.5,...neighbors.map(n=>Math.abs(n.x-center)+(n.w||width)/2));return{center,w:Math.min(3,half*2)}}
 function placement(bounds,width,height,crop={x:0,y:0,w:1,h:1}){const k=Math.min(bounds.w/(width*crop.w),bounds.h/(height*crop.h)),w=width*crop.w*k,h=height*crop.h*k;return{x:(bounds.w-w)/2,y:(bounds.h-h)/2,w,h,crop}}
 function paperToSource(p,bounds,width,height,crop){const r=placement(bounds,width,height,crop);return{x:r.crop.x+(p.x-r.x)/r.w*r.crop.w,y:r.crop.y+(p.y-r.y)/r.h*r.crop.h}}
 function sourceToPaper(p,bounds,width,height,crop){const r=placement(bounds,width,height,crop);return{x:r.x+(p.x-r.crop.x)/r.crop.w*r.w,y:r.y+(p.y-r.crop.y)/r.crop.h*r.h}}
 root.ReferenceGeometry133={threeColumns,paperToSource,sourceToPaper};
})(typeof window==='undefined'?globalThis:window);
