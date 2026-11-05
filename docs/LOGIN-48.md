# 用户名与密码登录

新增入口复用原来的账号、作品、云端设置、统计、点赞、点评和管理接口。所有本机创作功能仍然无需登录。

- 用户名：3—32 位字母、数字、点、下划线或横线，不区分大小写。
- 密码：15—128 字符，允许长句。数据库仅保存随机盐及 PBKDF2-SHA256（600,000 次）摘要。
- 注册成功自动登录；会话有效 30 天，使用 HttpOnly / Secure / SameSite Cookie；退出时撤销会话。
- 账号及来源地址均有 15 分钟尝试频率限制。
- 首个账号沿用原来的书仙分配规则，后续账号为书家；全部创作功能开放。
- 暂不支持密码找回，不把未验证邮箱作为账号身份。

## 后端启用

本次提交代码不等于已经部署网站。纯静态 GitHub Pages / EdgeOne 静态目录不会运行 server/worker47.mjs。前端和 `/api/*` 必须接入同源的后端，并配置原有 DB、BUCKET。

现有 Cloudflare Worker 部署：

1. 在 wrangler.jsonc 填写实际 D1 数据库 ID，并绑定 R2 作品桶。
2. 对已有数据库应用新增迁移（保留原数据）：`npx wrangler d1 migrations apply iinnkk --remote`。
3. `npm ci`，`npm run build`，然后 `npx wrangler deploy`。
4. HTTPS 打开 `/api/session`，应返回 `passwordLogin: true`。注册后验证刷新登录状态、设置同步、作品同步及互动。

若前端托管在 EdgeOne，必须把同域 `/api/*` 路由到这套后端，且转发请求方法、正文、Cookie 和 Set-Cookie；不能仅上传静态文件就获得在线账号功能。不要把数据库、OAuth 或云平台密钥放入前端。

## 验证

`npx esbuild server/worker47.mjs --bundle --format=esm --platform=browser --target=es2022 --outfile=dist/server/index.js`

`npm test`

测试使用独立临时 D1/R2，覆盖注册、重复注册、错误密码、重新登录、Cookie 会话、退出、尝试限流、设置、作品及点赞点评，以及私密作品隔离。
