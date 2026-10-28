# 手筆 · 作品成影

从“我的作品”选择已保存的真实笔迹，生成 8 秒、30fps 的书写影片。无需导出或重新选择图片文件。仅有合成图片的旧作明确提示没有轨迹，多页临帖使用当前保存页。

## 网页流程

- 实验室 → 作品成影 → 从我的作品选择；作品卡片也提供“成影”按钮。
- 本机作品只读取选中的记录；云端作品沿用现有作品库的登录和权限，只按当前 owner/id 精确读取一幅原笔迹。账号切换使已选云端作品失效。没有上传、数据库修改、轮询或全库预取。
- 使用校验来源、窗口和通道的同源消息传递，不复制作品，不另建作品 ID。
- 选中后才载入原书写引擎；通过原 renderSavedDraft179 生成 73 个回放画面，保留笔压、笔刷、几何变换、纸张、照片和印章。时间按影片节奏安排，不宣称恢复原始实时速度。
- 提供 540×720 和 1080×1440 MP4；准备和导出均可取消。渲染失败或超时不会修改原作品。

## 构建与验证

```bash
cd remotion-studio
npm ci
npm run build:web
```

构建生成 video-studio.<内容哈希>.js/.css，只由独立页面加载。不会增加首页和首次书写的加载。既有 scene-video232.js 链路不修改。

```bash
node --test tests/video290.test.mjs
CHROMIUM_EXECUTABLE_PATH=/path/to/chromium node tests/ui-video290.cjs
```

浏览器验证使用实际书写输入保存的草稿、原渲染器、真实 WebCodecs 导出和完整解码，并模拟缺少 Symbol.dispose 的环境。VIDEO_SKIP_EXPORT=1 仅供已有同一构建的两档导出结果后，分开复测作品库和账号隔离；默认执行两档导出。iPhone/iPad 和鸿蒙的真实设备表现仍需分别验证。

## 兼容处理

- disposal-prelude.mjs 通过 bundle banner 在依赖执行前统一 Symbol.dispose/asyncDispose，避免旧 Safari 上依赖内部释放标记不一致引发 Object not disposable。
- telemetry-compat.mjs 只补充 Remotion 4.0.539 用量上报的错误捕获，保留请求、载荷、超时和重试。SDK 结构变化时停止构建，要求重新检查。页面说明有限使用统计；作品像素不参与上报。

## 桌面 Studio

```bash
cd remotion-studio
npm run studio
```

桌面示例仍使用 public/sample-paper.svg。可把作品图片放入 public 并用 npm run render 生成图片展示影片；这与网页的原笔迹回放入口分开。
