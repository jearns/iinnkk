# 第95版用户后台

2026-10-01 已通过 Supabase 插件在 `iinnkk.me` 项目安装 `v95_user_management_registration_notices`，用户不需要复制或执行 SQL。升级保留既有书仙管理员；新用户一律从书家开始，不再由首个登录者自动取得管理员身份。

## 怎么使用

1. 用原来的书仙账号登录网站。首页头像旁会出现通知铃铛；点铃铛打开「管理后台 · 用户与通知」。个人账号页也有「管理后台」。普通用户没有这些入口。
2. 搜索昵称或邮箱，查看注册时间、邮箱验证状态、性别、作品数。每页50位用户，可翻页。
3. 选择书家、书圣或书仙，勾选「暂停发布与评论」，点「保存用户设置」。授予书仙会再次提醒其可查看用户并管理角色。当前管理员不能从此面板停用或降级自己。
4. 新注册在服务端立即生成通知。网站运行且管理员已登录时，Realtime 更新通知栏；断线时15秒轮询补漏，重新打开网站会加载未读通知。每位管理员分别保存已读位置，不互相清空通知。
5. 想要浏览器系统弹窗，点「启用浏览器通知」并允许浏览器授权。已授权的浏览器后续会自动使用此权限。不支持系统通知的浏览器仍有站内通知栏。关闭网站后持续推送需要另接 Web Push，当前实现不冒充后台推送。

暂停发布与评论限制云端作品、点赞和评论的写入；用户仍可看自己的作品、修改资料和本机写字。此操作不删除用户，也不等同于封禁 Supabase 登录。云端删除作品需用户确认，本机原笔迹保留。

## 数据与权限

- `ink_admin_users95`：数据库端检查调用者为书仙后才读取 Auth 用户清单。
- `ink_admin_member95`：改角色和发布状态，保留操作记录。
- `ink_admin_events95`：注册与管理操作通知，只有书仙可读；注册触发器由服务端写入。
- `ink_admin_reads95`：按管理员保存通知已读位置。
- `ink_user_state95`：用户发布状态；普通用户不能修改。
- 新表启用 RLS；管理 RPC 不开放给匿名用户。`SECURITY DEFINER` 使用固定空 `search_path` 和明确表名，管理函数内部再校验书仙。
- Supabase 顾问对已登录用户可调用的 `SECURITY DEFINER` RPC 提示人工审查；这些是本应用刻意提供的受权限校验的入口。旧 `ink_admin55` 仅返回当前请求是否为书仙，其匿名可执行提醒为原项目既有项。密码泄露保护也是既有未启用配置，本次没有改动 Auth 全局设置。

源码见 [数据库升级](supabase/admin95.sql)。仅恢复或安装新项目时才需要执行；已经升级的线上项目无需重复操作。

官方说明：[RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)、[数据库函数](https://supabase.com/docs/guides/database/functions)、[Realtime 权限](https://supabase.com/docs/guides/realtime/authorization)、[顾问提示解释](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable)。
