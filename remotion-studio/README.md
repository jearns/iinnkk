# 手筆 · Remotion 视频工作台

此目录将视频创作与既有书写、实景录屏和 Mediabunny 导出解耦。

## 定位

- 输入：从《手筆》现有“下载作品”导出的 PNG/JPG/WebP。保留原始笔迹、印章、纸纹和装裱，不试图重新描画手写笔迹。
- 输出：独立生成竖屏 1080×1440、30fps、8 秒的作品展示动画。
- 安全边界：不接入首页、书写初始化、Supabase 或 Service Worker；既有实景视频继续走 `scene-video232.js` 的 Mediabunny 链路。
- CLI 工作台供本地 Studio/桌面渲染使用；新独立页面 `video-studio.html` 使用 `@remotion/player` 预览和 `@remotion/web-renderer` 的 WebCodecs 本机 MP4 合成，不依赖 Node 服务或上传图片。浏览器端渲染的实际兼容性仍须真机验证。

## 操作

```bash
cd remotion-studio
npm install
npm run studio
```

Studio 中可调整标题、落款、纸色和作品图片。作品图片应使用 `public/` 内的相对文件名，例如 `my-artwork.png`。

要生成视频，将你从《手筆》下载的图片放到 `remotion-studio/public/my-artwork.png`，然后：

```bash
npm run render -- --props='{"artwork":"my-artwork.png","title":"我的手筆","signature":"以手为笔 · 随时写字"}'
```

MP4 保存为 `out/shoubi-showcase.mp4`。不输入参数时使用自带的演示纸张（不冒充真实手写字）。

## 网站独立页面

```bash
cd remotion-studio
npm ci
npm run build:web
```

生成的根目录 `video-studio.bundle.js` 只会被 `video-studio.html` 按需下载，不挂到首页或书写启动链路。实验室 `lab257.html` 提供入口。用户在页面里自行选取从《手筆》下载的作品图片，然后预览和导出 MP4。提供 540×720（轻量）及 1080×1440（高清），导出前检查编码器是否支持。

这一模块和 `scene-video232.js` 的实景视频编辑/录制互不替换。不同浏览器的色彩和字体绘制、iPhone/iPad 保存到相册、华为鸿蒙兼容性仍需分别验收。

## 后续上线接口

后续可以把现有“下载作品”面板导出的本地 Blob 直接交给“作品成影”，减少手动选择图片一步。不得将作品 PNG 自动上传到 Supabase，亦不得为渲染重复请求签名 URL。
