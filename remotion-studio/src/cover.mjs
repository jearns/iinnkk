// Embed a compact JPEG cover as well as placing the completed work at frame zero.
export async function coverMetadata(poster, {signal, title = '', signature = '', credit = '',width=1080,height=1920} = {}) {
  const blob = await (await fetch(poster, {signal})).blob();
  const image = await createImageBitmap(blob);
  try {
    if (signal?.aborted) throw new DOMException('已取消', 'AbortError');
    const canvas = document.createElement('canvas');canvas.width = width>=height?960:540;canvas.height = width>=height?540:960;
    const ctx = canvas.getContext('2d');ctx.fillStyle = '#08090b';ctx.fillRect(0,0,canvas.width,canvas.height);
    const scale = Math.min(canvas.width / image.width, canvas.height / image.height), w = image.width * scale, h = image.height * scale;
    ctx.drawImage(image, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    const jpeg = await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('封面生成失败，请重试。')), 'image/jpeg', .82));
    return {title, artist: signature, comment: credit, images: [{data: new Uint8Array(await jpeg.arrayBuffer()), mimeType: 'image/jpeg', kind: 'coverFront', name: '作品封面.jpg'}]};
  } finally { image.close(); }
}
