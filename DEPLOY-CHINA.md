> 第 46 版目录更新：完整包根目录的 index.html 是真实首页，直接托管时上传根目录全部内容，不再上传或指向旧 dist 目录。下文如提到 dist，指开发构建命令 python3 scripts/build-static.py 生成的托管输出，不是下载包中的目录。

# 今日亲笔 39：迁移与持续更新

## 当前运行环境

网页是纯静态 HTML、CSS、JavaScript 与本地字体/图片/音乐。`dist/` 就是完整网站，不需要构建、Node.js 后端、数据库服务器或 OpenAI API。浏览器使用 Canvas 2D、Pointer Events、IndexedDB、Service Worker、MediaRecorder。HTTPS 是离线缓存/系统分享的必要条件；视频编码能力由浏览器决定。

作品、照片、临帖相册、个人文字与设置存于使用者浏览器，本应用没有把它们上传到服务器。更换域名时，本机数据不会自动搬家；先在旧站“完整备份”，到新站恢复。发布代码不包含使用者作品。

## 推荐方案

优先试用腾讯 EdgeOne Makers（原 EdgeOne Pages）。它支持直接上传静态文件、Git 集成、平台分配的访问 URL 与 HTTPS。当前提供免费版；官方额度包括每月500次构建、40个项目、单文件25MB、总存储5GB。以上以2026-09-17公开文档为准，可能调整，不能承诺永久免费无限流量。

- 免费版额度：https://pages.edgeone.ai/document/limits-and-quotas
- 直接上传：https://pages.edgeone.ai/drop
- 部署说明：https://pages.edgeone.ai/document/deployment
- 国内/全球含国内节点的自定义域名需要ICP备案：https://pages.edgeone.ai/document/custom-domain

平台网址无需访客注册 ChatGPT。中国大陆的真实速度仍需在当地不同运营商网络试用，不能用海外测试代替。免费平台域名的有效期、可选地区与流量配额以创建项目时控制台显示为准。**免费平台域名 + 国内节点 + 不备案 + 永久不限流量**无法据现有资料保证同时成立；先用平台分配URL小范围试用，长期运营建议备案域名。

## 最快上线

1. 解压代码包。`dist/` 内的 `index.html` 是网站入口。
2. 登录你自己的 EdgeOne 控制台，新建静态网站；直接上传 `dist/` 的内容（不能再多套一层目录）。
3. 框架选“其他/静态”，构建命令留空，输出目录填 `dist`（直接上传dist内容时不需要输出目录）。
4. 使用返回的平台网址试写。访客不需要注册账号。
5. 在“纸张—离线使用”确认离线已准备好；如需离线模板和音乐，再点下载全部素材。

## 后续同步

当前 ChatGPT 管理的 Git 仓库不会自动授权其他平台读取。本次没有你的外部仓库或 EdgeOne 账号绑定，因此**外部自动同步尚未开通**。

可持续方案：在你自己的 GitHub 或 EdgeOne 支持的 Git 服务建仓库，把此代码包推送进去；EdgeOne 绑定该仓库的 main 分支。每次代码推送后由 EdgeOne 自动部署。开发者可在当前工程增加一个名为 `domestic` 的 Git remote；`scripts/sync-domestic.sh` 会把已提交的当前版本推送过去，不修改账户权限、不保存密钥、不强制覆盖远程提交。后续交给 ChatGPT 的更新仍须具备该仓库写入授权。

首次绑定前，替代办法是每次下载新版代码包，将dist整体覆盖上传；网页里的个人作品不会因更换静态文件而删除。

## 本机运行

安装 Python 3 后，在解压目录执行 `python -m http.server 8080 --directory dist`，浏览器打开 http://localhost:8080 。不要仅双击index.html；file协议无法提供完整Service Worker能力。也可以交给任何HTTPS静态服务器。

## 素材与限制

24张场景为历史题材艺术想象，含600×800预览和1086×1448原始分辨率图；导出使用后者，并非4K素材。历史人物场面不是史实照片。旧场景停止提供，新版会将旧场景设置恢复成常规纸面，已经保存的作品图片不变。

内置录音来源与许可见dist/music/CREDITS.md。《梁祝》没有附带可用授权录音，可导入你有权使用的音频。录屏为实时画面，可选择收录应用音乐与麦克风；不支持的浏览器使用设备系统录屏。

## GitHub → Cloudflare Pages

把源码放入你自己的 GitHub 仓库，在 Cloudflare Pages 选择连接该仓库，生产分支 main，框架 None，构建命令留空，输出目录 dist。每次推送可自动发布。官方说明：https://developers.cloudflare.com/pages/configuration/git-integration/

Cloudflare Pages 可用于全球发布，但免费 Pages 不能等同于中国大陆专线加速。Cloudflare 中国网络属于 Enterprise 客户单独订阅，接入域名需有效备案/许可：https://developers.cloudflare.com/china-network/ 。不能承诺免费服务在中国大陆任何网络都高速可用。

本次已经准备静态代码和同步脚本；尚未连接你的 GitHub、Cloudflare 或 EdgeOne 账号，未创建外部站点。连接后才可在持续修改时同步到用户仓库。
