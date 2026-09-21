# 今日亲笔 · 本机创作工作台

## 打开与保存

首页底部点「本机管理」，或在纸张设置底部展开「本机管理」。键盘可按 Alt+Shift+M。第一次设置至少八位本机管理口令，以后解锁后编辑。口令只防止本机误操作，不构成联网身份或跨设备权限控制。所有创作功能保持开放，不依赖注册登录。

导航、独立模式预设、品牌文字和接口地址在修改时自动保存至 LocalStorage `iinnkk.studio.v1`；管理口令以加盐 PBKDF2 摘要保存在 `iinnkk.studio.admin.v1`。全局「保存当前设置」改用 LocalStorage `zhenji.settings.v1`，第一次兼容迁移旧 IndexedDB 设置。作品和图片仍保留在原 IndexedDB 作品库，避免 LocalStorage 容量不足造成丢失。

管理员可以新增、删除、重命名入口，拖动排序，也可用上下箭头调整。预设包括字数、参考诗文、横竖方向、幅式、纸色材质纹样、笔径书风、飞白提按、墨色与不透明度、格线。点「预览此入口」查看实际书写环境。单字模式固定标准米字格。普通首页入口仍然点击直接进入，没有副标题和确认弹窗。

「导出配置」生成可迁移的 JSON；在另一浏览器或设备的本机管理中导入即可复用。导出不包含口令、作品、照片或 API 密钥。本机配置不会因 GitHub 更新被覆盖，也不会自动同步到其他访客。请在清理浏览器数据前备份配置和作品。

## 文创生产参考包

在生成作品或打开作品集的作品后，保存窗口新增「文创二创画布预览」。可旋转查看马克杯、文化衫、手办底座；拖动旋转、双指缩放，调整产品颜色及墨迹贴图大小和位置。Three.js 已随源码打包，本地使用无需 CDN。仅打开预览时加载三维模块，关闭释放 WebGL 资源，没有持续动画循环影响书写。

「导出文创生产文件」下载 ZIP，包含：

- `ink-300dpi.png`：原始笔迹透明图，按输入毫米宽度生成 300 DPI 像素，PNG 写入 pHYs 分辨率。纸张、图片和印章不混入墨迹。旧作品只有合成图片时明确提示无法无损分离。
- `ink-outline.svg`：实际闭合路径，毫米尺寸，evenodd 保留孔洞；没有把 PNG 嵌入 SVG 伪装矢量。
- `ink-outline.dxf`：毫米单位、闭合 LWPOLYLINE。孔洞按嵌套关系交由供应商确认。
- `*-preview.glb`：含嵌入贴图的三维效果模型，单位米。设备不支持 WebGL 时仍可导出 PNG/SVG/DXF。
- `production.json`：图稿尺寸、阈值、预览贴图位置等参数。

矢量由透明墨迹的 alpha 阈值描边生成，最长边最多 1024 采样点；浓淡转为单色轮廓，微小飞白会随阈值变化。彩色和细腻浓淡请使用 PNG。图稿毫米宽度用于生产墨稿；三维贴图位置是效果参考。模型未经壁厚、流形、支撑与打印机校验，不能当作直接开机打印的 STL。印刷出血、CMYK、最细笔画、雕刻孔洞及工艺尺寸均须供应商复核。

## AI 老师点评

本机管理 → AI 点评与供应链接口：填写已有代理完整 HTTPS 地址，选择 Responses 或 Chat Completions 协议，填写代理支持的视觉模型（代理自行默认时可留空）。前端不保存、不传入 OpenAI 密钥。没有代理时不生成假评分。

用户点击「请老师点评」后才发送作品图（最长边 1200 像素 JPEG）。代理应转发 OpenAI 兼容图像输入与严格 JSON Schema，并返回标准 Responses `output[].content[].text` / `output_text` 或 Chat `choices[0].message.content`。代理须自行持有服务端凭据、控制访问、限流计费，并配置 CORS；本地 file:// 的来源可能为 `null`，建议用 localhost 或 HTTPS。不要在静态代码里放密钥。

输出含表达感染力、专业完成度两个 0–100 参考评分，鼓励、结字、章法、墨法，以及一至两条可操作建议。错误、超时和格式不符均明确提示，关闭窗口可取消请求。模型评分属于主观教学参考。

官方图像输入说明：https://developers.openai.com/api/docs/guides/images-vision

## 供应链 Webhook

填写 HTTPS Webhook 后，先生成生产文件，再点「发送供应链」，确认接收域名后提交。请求为 POST multipart/form-data：`file` 是 ZIP，`metadata` 是 JSON 字符串。不携带站点 cookies；不自动下单、扣款。接口应允许 CORS 并自行鉴权、校验文件和处理工艺。HTTP 成功只代表接收状态，不能代表已投产。

## 构建和检查

`npm ci` 后可用 `npm run build:studio` 重建本地三维包。根目录 `index.html` 及 site-assets 清单可静态托管。现有完整 build 仍保留历史在线服务的构建步骤；本机模式不调用它。

浏览器回归测试：安装 Playwright 并安装 Chromium 后，执行 `node tests/studio50.cjs`。可用 `PLAYWRIGHT_MODULE` 指定 Playwright 模块位置、`CHROMIUM_PATH` 指定浏览器可执行文件。测试使用隔离浏览器数据与本地模拟 AI 代理，不产生实际模型费用。
