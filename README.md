# 今日亲笔 · 完整网页版 46

亲笔手书，见墨如我。

根目录 index.html 就是真正的首页，不跳转、不依赖 dist 路径。全部脚本、模板、字库、音乐在同一包内。下载页面为 download.html。

## 完整部署

先备份旧网站与重要作品。将压缩包完整解压，把 index.html 及其旁边的所有文件、文件夹一起上传到网站根目录。不要再套一层 dist，也不要只复制 index.html。建议使用托管平台整批替换发布，并清理 CDN 文件缓存；不要清除用户浏览器的网站数据。

若手工逐文件上传，先上传素材、脚本与样式，最后上传 index.html、offline-assets.json 和 sw.js。保持原域名，原浏览器里的作品仍位于同一来源的本机存储中。

## 本机运行

电脑安装 Python 3 后，在解压目录运行 `python3 start-local.py`（Windows 可用 `py start-local.py`），浏览器访问 http://localhost:8080 。

iPhone / iPad 可在 a-Shell 用 pickFolder 选择整个解压目录，再运行 python3 start-local.py，并保持 a-Shell 服务运行，用 Safari 或 Chrome 打开 http://localhost:8080 。系统文件预览器不能保证执行完整网页。安卓、鸿蒙等设备优先通过 HTTPS 网站使用，或用能提供 localhost 静态服务的应用打开整个目录。

## 本轮内容

100 条文学佳句、93 篇诗词曲按上传文本完整录入，不自动扩写。文学署名作为用户提供的资料保留，未冒充逐条考据。原有其他篇目和个人句库保留。顶栏摘要仍用于节省书写空间，“阅读全文”和文字库显示完整正文。

## 保存作品

网页提供 PNG 下载、系统分享和长按图片保存。系统、浏览器权限不同，网页不能保证直接写入每一台设备的相册；下载记录一般在浏览器或文件管理的 Download/下载目录。

## 开发与打包

源代码都在根目录。`python3 scripts/offline-manifest.py` 更新离线资源表，`python3 scripts/package-source.py` 生成完整源码包和下载清单。`python3 scripts/build-static.py` 仅为托管构建生成 dist 输出目录；交付的源码包不包含 dist。无需 Node.js 或数据库即可运行应用。

完整源码下载页逐文件校验后合成 ZIP。托管包和生成的完整 ZIP 都包括下载清单，另行托管后下载页仍可使用。录屏、系统分享和后台运行能力受浏览器支持情况影响，未保证所有品牌真机完全一致。
