/* Keep artwork dimensions; choose the highest JPEG quality that fits the download budget. */
(function(root){
 async function encode(canvas,budget=2000000){
  if(!Number.isFinite(budget)||budget<=0)throw Error('图片大小限制无效');
  const ctx=canvas.getContext('2d');ctx.save();ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.restore();
  const attempt=q=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('图片编码失败')),'image/jpeg',q));
  let high=.94,low=.18,best=await attempt(high);if(best.size<=budget)return best;
  best=await attempt(low);if(best.size>budget){low=.04;best=await attempt(low)}
  if(best.size>budget)throw Error('图片纹理过于复杂，暂未能压缩至2MB；作品仍保留，可减少纹样后重试');
  for(let i=0;i<7;i++){const mid=(low+high)/2,blob=await attempt(mid);if(blob.size<=budget){best=blob;low=mid}else high=mid}
  return best;
 }
 root.ArtworkEncoder127={encode};
})(globalThis);
