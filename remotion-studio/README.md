# 手筆 · Remotion 视频工作台

此目录将视频创作与既有书写、实景录屏和 Mediabunny 导出解耦。

## 定位

- 输入：从《手筆》现有“下载作品”导出的 PNG/JPG/WebP。保留原始笔迹、印章、纸纹和装裱，不试图重新描画手写笔迹。
- 输出：独立生成竖屏 1080×1440、30fps、8 秒的作品展示动画。
- 安全边界：不接入首页、书写初始化、Supabase 或 Service Worker；既有实景视频继续走 `scene-video232.js` 的 Mediabunny 链路。
- 此阶段是**仓库内可运行的创作工作台**，并非已部署到 `iinnkk.me` 的手机端一键导出。静态站点不能直接运行基于 Node/Chromium 的 CLI 渲染。

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

## 后续上线接口

未来网站“作品成影”入口应按需加载预览组件并复用现有作品 PNG 的本地 Blob，且只在用户主动导出时调用浏览器端或受控渲染服务。不得将作品 PNG 自动上传到 Supabase，亦不得为渲染重复请求签名 URL。
