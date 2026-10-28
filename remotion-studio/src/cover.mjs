// Embed a compact JPEG cover as well as placing the completed work at frame zero.
export async function coverMetadata(poster, {signal, title = '', signature = '', credit = ''} = {}) {
  const blob = await (await fetch(poster, {signal})).blob();
  const image = await createImageBitmap(blob);
  try {
    if (signal?.aborted) throw new DOMException('已取消', 'AbortError');
    const canvas = document.createElement('canvas');canvas.width = 720;canvas.height = 960;
    const ctx = canvas.getContext('2d');ctx.fillStyle = '#f5f5f7';ctx.fillRect(0, 0, 720, 960);
    const scale = Math.min(676 / image.width, 916 / image.height), w = image.width * scale, h = image.height * scale;
    ctx.drawImage(image, (720 - w) / 2, (960 - h) / 2, w, h);
    const jpeg = await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('封面生成失败，请重试。')), 'image/jpeg', .82));
    return {title, artist: signature, comment: credit, images: [{data: new Uint8Array(await jpeg.arrayBuffer()), mimeType: 'image/jpeg', kind: 'coverFront', name: '作品封面.jpg'}]};
  } finally { image.close(); }
}
