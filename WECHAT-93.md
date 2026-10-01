# 第93版：必须由网站所有者完成的配置

代码已包含邮箱回跳、个人资料、微信 OAuth 适配器、微信分享签名和分享贴图。下面是配置清单，不代表平台申请或真实收信联调已经完成。密钥只填后台，不发聊天、不写 GitHub。

## 1. 先完成邮箱注册（无需微信资格）

1. 登录 https://supabase.com/dashboard/project/mymubscofhvnjixdupbh 。进入 Authentication → Sign In / Providers → Email，开启 Email 注册与 Confirm email，不关闭验证来绕过邮件问题。
2. Authentication → URL Configuration：Site URL 填 `https://www.iinnkk.me/`。Redirect URLs 增加你实际使用的地址：`https://www.iinnkk.me/?account=profile`、`https://iinnkk.me/?account=profile`。如果也使用 GitHub Pages，增加实际 Pages 地址及其 `?account=profile` 地址；不要填写未使用的域名。生产地址使用精确路径。
3. Authentication → Email Templates → Confirm signup：保留 Supabase 的 `{{ .ConfirmationURL }}` 作为确认按钮链接，例如 `<a href="{{ .ConfirmationURL }}">确认邮箱并进入个人资料</a>`。不要把确认按钮直接指向首页，也不要把邮件里的临时令牌改成明文密码。
4. Authentication → SMTP Settings：启用自己已经拥有的邮件发送服务，填它提供的 SMTP Host、Port、Username、Password、Sender email、Sender name。默认 Supabase 邮件服务不是公众注册的生产邮件服务，会限制收件人及发送数量。发送服务要求的 SPF、DKIM、DMARC 记录须在域名 DNS 后台添加。不要凭示例猜凭据或购买未经确认的套餐。
5. Supabase → SQL Editor：检查已有 `ink_profiles83` 表；若未创建，运行仓库的 `supabase/profiles83.sql`。已有表不要删除重建。昵称显示在公开作品，微信和电话默认仅保存在个人账号；只有勾选“允许公开展示”才写入公开资料表。
6. 用非项目管理员的测试邮箱，在正式域名注册：页面应显示提交中，再显示查收邮件；点邮件确认按钮后应回到个人资料，填写昵称，选填联系信息并保存。回到原注册页面点登录，无需重填；刷新或关掉页面后密码不会由本站明文保存，请用浏览器密码管理器。确认链接跨浏览器时如没有恢复会话，返回原页面登录或重发确认邮件。
7. 再测试：错误密码、未验证邮箱、过期邮件、重发限流、退出再登录。网络故障或平台错误会在表单下方显示，不应显示虚假的“注册成功”。

## 2. 开通网站微信登录（扫码，不等于公众号内授权）

必须由你做：主体认证、提交网站应用和授权申请、接受平台协议、审核或费用确认。网站代码不能替你取得这些资格。

1. 登录 https://open.weixin.qq.com/ ，在管理中心创建“网站应用”，名称“今日亲笔”，填写实际网站 `https://www.iinnkk.me/`、主体资料、应用介绍、隐私政策、平台要求的证明/备案材料。以后台当前必填项与资格要求为准；若你的个人主体不满足条件，先用邮箱登录，不能以公众号或别人的 AppID 冒充网站应用。
2. 申请网站应用的“微信登录”权限并等审核通过。记下 **网站应用 AppID**；AppSecret 保留在密钥管理界面。
3. 本仓库已实现 `supabase/functions/wechat-oauth/index.ts`：把 Supabase 的标准 OAuth 参数转换成微信要求的 `appid`、`secret`、`openid` 参数；用加密临时令牌封装微信访问令牌；不假造邮箱、不把微信凭据交给浏览器。
4. 在你的电脑使用 Supabase CLI（安装按官方 https://supabase.com/docs/guides/cli），在仓库根目录运行：

   ```sh
   supabase login
   supabase link --project-ref mymubscofhvnjixdupbh
   supabase functions deploy wechat-oauth --no-verify-jwt
   ```

5. Supabase → Edge Functions → Secrets，添加以下值：

   | 名称 | 值 |
   | --- | --- |
   | `WECHAT_APP_ID` | 网站应用 AppID |
   | `WECHAT_APP_SECRET` | 网站应用 AppSecret |
   | `BRIDGE_CLIENT_SECRET` | 密码管理器生成的至少32位随机密钥（不是微信 AppSecret） |
   | `BRIDGE_TOKEN_KEY` | 另一条独立的至少32位随机密钥 |
   | `SUPABASE_AUTH_CALLBACK` | 下一步 Supabase 后台显示的 Callback URL，通常为 `https://mymubscofhvnjixdupbh.supabase.co/auth/v1/callback`，以后台实际值为准 |

6. Supabase → Authentication → Sign In / Providers → Custom OAuth Providers → New Provider → Manual configuration：

   | 字段 | 值 |
   | --- | --- |
   | Identifier | `custom:wechat` |
   | Client ID | 网站应用 AppID |
   | Client Secret | 上一步的 `BRIDGE_CLIENT_SECRET` |
   | Authorization URL | `https://mymubscofhvnjixdupbh.supabase.co/functions/v1/wechat-oauth/authorize` |
   | Token URL | `https://mymubscofhvnjixdupbh.supabase.co/functions/v1/wechat-oauth/token` |
   | UserInfo URL | `https://mymubscofhvnjixdupbh.supabase.co/functions/v1/wechat-oauth/userinfo` |
   | Scopes | `profile`（适配器内部使用微信的 `snsapi_login`） |
   | Email optional | `true`，微信不提供可验证邮箱 |
   | PKCE enabled | `false`，微信本身不支持标准 PKCE；适配器校验客户端密钥、固定回调，Supabase 负责 state 校验 |

   部分高级字段需通过管理 API/官方客户端设置。若后台没有对应选项，不要猜填或仅开启 Provider 后声称接通，请把不含密钥的配置界面交给我继续处理。

7. 复制 Supabase 实际 Callback URL，回微信开放平台的该网站应用，设置对应“授权回调域”，一般填 `mymubscofhvnjixdupbh.supabase.co`（只填域名，不填 `https://` 或路径）。平台审核若不接受此域名，需要你拥有并配置 Supabase 自定义认证域名，更新固定 Callback 与微信回调域；不要把授权放行到任意域名。
8. 后台 Provider 配置好后，仓库 `supabase-config.js` 中把 `oauthProviders.wechat` 从空字符串改为 `custom:wechat` 并发布。没有完成前前端不冒充“微信登录已开通”。公开配置只放 Provider 名称，不放任何 AppSecret。
9. 正式环境验收：电脑点微信登录 → 手机扫码并同意 → 回本站个人资料 → 保存昵称 → 退出 → 用同一微信再登录仍是同一账号。拒绝授权、无效 code、伪造 token、错误密钥、回调域不匹配应失败。适配器已写好并做本地安全路径检查，但真实微信与 Supabase Provider 间的字段兼容必须在上述配置后联调。

网站扫码登录与手机微信内网页授权属于不同能力。当前实现是网站应用扫码登录；不要保证一台手机在所有浏览器中都能无扫码一键拉起微信。若要微信内直接授权，还需单独申请对应公众号网页授权能力。

## 3. 微信朋友圈与贴图

不需要后台配置即可使用：作品下的“微信朋友圈”“微信贴图”“小红书贴图”准备分享图片，支持系统分享、保存图片、复制链接。私藏作品只放网站二维码，**不会自动公开**。点作品“发布”后，二维码才直达原作，用户在本站点赞、评论、注册。

公众平台限制：网页不能代替用户自动发布朋友圈或小红书。系统分享菜单里的应用与目标由操作系统决定；发布仍需要用户确认。小红书没有在此集成未获授权的自动发帖接口。

如果要微信内分享显示自己的标题/图片，还必须由你完成：

1. 登录 https://mp.weixin.qq.com/ ，使用已有且具备相应接口权限的公众号。在公众号设置/功能设置配置实际网站的 **JS接口安全域名** `www.iinnkk.me`（也使用裸域时另加 `iinnkk.me`）。按后台要求下载验证文件并放到网站根目录；文件是每个账号独有的，不能由我编造。
2. 公众号 AppID/AppSecret 与网站微信登录的 AppID/AppSecret 不同。Supabase Edge Functions Secrets 添加 `WECHAT_MP_APP_ID`、`WECHAT_MP_APP_SECRET`，及 `SITE_ORIGINS=https://www.iinnkk.me,https://iinnkk.me`（只列你使用的站点）。
3. 运行 `supabase functions deploy wechat-share --no-verify-jwt`。签名函数只给白名单中的站点 URL 签名，不返回公众号密钥或 access_token。
4. 如公众号要求服务器出口 IP 白名单，先确认部署环境的固定出口 IP 是否可用。Supabase Edge Functions 不应被假定拥有固定出口 IP；若必须固定 IP，这个签名函数需迁到你已拥有的固定出口服务器，保留同样的域名校验与私密配置。
5. `supabase-config.js` 添加 `wechatShareEndpoint:'https://mymubscofhvnjixdupbh.supabase.co/functions/v1/wechat-share'` 后发布。
6. 用微信打开一幅已发布作品，点“微信朋友圈”，然后点右上角“…”→ 分享到朋友圈；确认标题与预览图片正确。这是准备分享内容，不是强制自动发送。签名未开通时仍可保存贴图、复制链接。

## 4. 参考依据（查阅于2026-10-01）

- Supabase 邮箱与密码：https://supabase.com/docs/guides/auth/passwords
- Supabase 回跳白名单：https://supabase.com/docs/guides/auth/redirect-urls
- Supabase 公众注册邮件限制与 SMTP：https://supabase.com/docs/guides/auth/auth-smtp
- Supabase 自定义 OAuth/OIDC：https://supabase.com/docs/guides/auth/custom-oauth-providers
- 微信网站登录官方入口：https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html
- 微信 JS-SDK 官方入口：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html

本次微信官方文档页面未能直接读取；申请资格、认证费用、最新界面及接口权限以你账号的开放平台/公众平台后台为准，不在这里假造已完成或已验证的状态。
