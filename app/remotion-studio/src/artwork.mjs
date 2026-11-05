// Decode before replacing the current artwork; MIME alone does not prove it is an image.
export function decodeArtwork(url, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const finish = (error) => {
      clearTimeout(timer);
      image.onload = image.onerror = null;
      error ? reject(error) : resolve(image);
    };
    const timer = setTimeout(() => finish(new Error('图片读取超时，请重新选择。')), timeoutMs);
    image.onerror = () => finish(new Error('图片已损坏或无法读取，请重新选择。'));
    image.onload = async () => {
      try {
        if (image.decode) await image.decode();
        if (!image.naturalWidth || !image.naturalHeight) throw new Error('empty image');
        finish();
      } catch {
        finish(new Error('图片已损坏或无法读取，请重新选择。'));
      }
    };
    image.src = url;
  });
}
