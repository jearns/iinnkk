# Supabase 配置

1. 在 https://supabase.com/dashboard 注册并创建项目。
2. 项目 Connect 中复制 Project URL 和 Publishable Key（也支持 legacy Anon Key）。只把公开浏览器 Key 写入根目录 supabase-config.js。不要使用 service_role 或 Secret Key。
3. SQL Editor 中执行 supabase/schema.sql，建立作品元数据、设置表和私有作品存储桶及 RLS 所有者权限。
4. Authentication → URL Configuration：Site URL 填 https://www.iinnkk.me，将实际 GitHub Pages 地址及使用的 HTTPS 回调地址列入 Redirect URLs。启用 Email 登录，按需要配置确认邮件和 SMTP。
5. 顶部“我的账号”可邮箱注册、密码登录、重置密码。iPad 本地文件可用密码登录；邮件确认和密码恢复通过 HTTPS 网站返回。

不登录即可书写、选字、图文、印章、文创。会员入口只说明当前全功能开放，不在客户端伪造付费权限。云端上传由用户主动点击，原始墨迹及图片保留；云端下载生成本机新副本。全局设置也支持手动同步。所有者权限由 Supabase RLS 校验，而不是前端角色开关。

旧 /api/session 等同源请求已移除；community47.js 已替换为 Supabase SDK 账号模块。SDK 随包分发并按需加载。没有配置时不会发起云端请求。历史自建服务代码不参与静态站点构建。

AI 代理与供应链地址仍在本机管理 → AI 点评与供应链接口中配置，或修改 studio50.js 的 defaults.integrations.ai / webhook；已经保存过本机配置时，应通过管理面板修改以覆盖本机旧值。前端不得保存 OpenAI API 密钥。AI 与供应链接口未进行真实网络验证，Supabase 需要以上真实项目配置后才能实际登录同步。
