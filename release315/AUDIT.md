# v315 阶段一：现状审计与验收边界

基线：500f528 / v314.0.0；执行任务： https://github.com/jearns/iinnkk/issues/35 。

## 文件级调用链

| 环节 | 当前入口与复用点 | 问题 / v315 处置 |
|---|---|---|
| 输入 | app.js sample → pointerdown/move → getCoalescedEvents → active.points | 保存 x/y/t/pressure，但缺少设备/能力/压力来源；trackPressure 只按压力变化确认，未限制 pen。新采样器只对明确报告有效压力的笔使用设备压力。 |
| 活笔 | app.js schedule/ensureCache → ParticleBrush.start/advance | 可增量绘制，保留。新引擎使用独立版本分发，不修改旧笔画路径。 |
| 完笔/撤销 | finish → flow.strokes → historyState/restoreHistory | 笔画对象保留字段。墨量起始快照随笔画 settings 保存，后续墨量从最后一个有效新版本笔画派生，撤销后可确定性恢复。 |
| 笔锋/飞白 | brush.js radiusForSpeed/dryForSpeed/ribbon192/mask/tailMask205 | 旧实现靠纹理掩膜、无跨笔画墨池；314 dryUser314 绕过限制，慢笔可能出现纹理。新增连续笔毫束与供墨门控，不为旧作品改样。 |
| 优化轨迹 | app.js displayStroke | 完笔时还会二次修改点位和 dry，可能与实时显示不一致。版本315笔画直接使用采样轨迹，禁止事后换轨迹。 |
| 保存/重开 | snapshot → DraftStore；cloud-draft-codec141 JSON 压缩 | 复用本地对象与JSON，不重建作品ID。版本、设备能力、墨量快照均需随 settings/points 保留。 |
| 高清/图文/实景 | app.js renderInk → composeAsync / sceneOverlayRenderer232 → ParticleBrush.render | 共享笔刷分发；保持几何变换和现有缓存。 |
| 纪录大片 | prepareVideoReplay293 → detached297 → ParticleBrush.render；ink313 原生矢量特写 | 保留 stroke.settings，使用同一个315笔刷，不额外加入位图飞白。需回归局部回放与全笔渲染。 |
| 其他轻量书写 | 手写字库/游戏/肖像等 → brush.js | 没有显式315版本标记时仍走旧引擎；本轮不强行迁移这些输入表面。 |

## 参数与能力约束

- v314“枯笔飞白”0–100 → brush.dry + dryUser314，书风切换可再次改 dry。
- v315独立保存 flyingWhite315、inkLoad315、virtualPressure315、engineVersion315；书风预设不应偷偷覆盖这些独立参数。
- touch/mouse 的 pressure、接触面积不能当作真实压感；只保存设备报告能力，不采集指纹、账号或远端诊断。
- pen 的常数0.5先标为未确认；有效变化/非占位压力才标为笔设备报告。零压抬笔与悬停不落墨。
- 速度用“笔径/秒”归一化，阈值随笔画保存、可在诊断页调整；数值属于实验标定参数，不是已通过所有硬件的物理常数。

## 分阶段安全边界

1. 审计与基线单独提交。
2. 输入/运动层单独提交并测试能力边界。
3. 连续笔毫、墨量、飞白引擎单独提交，默认不替换旧作品。
4. 主书写入口实验开关、含墨量/补墨、保存与高清回放接入后单独提交。
5. 自动化像素/状态、200笔、多页与实际浏览器验证后发布315。旧引擎仍为默认；新实验入口可主动开启并可关闭。

本环境可验证合成轨迹、Canvas像素与当前云端Chrome；不能把合成压力测试称为实体压感笔测试，也不能声称已覆盖鸿蒙、Safari或低端手机硬件。未完成的真机/完整长时录屏验收必须明确保留。

## 两个首页问题

- authors227.js identities.tengwang 写死“文徵明”，优先于 gallery-model148.js 的 author 字段：须改为祝允明并测试最终分组，而非只测JSON。
- 临帖入口的加载来自 home-engine158 的状态罩、writer-entry154 的 Loading205.begin、catalogue-picker183 的 Loading205.run 三层：只在该选单路由取消动画罩，保留选单内状态、超时和重试。
