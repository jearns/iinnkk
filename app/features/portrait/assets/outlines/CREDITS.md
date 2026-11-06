# 304 轮廓素材与来源

原50项的 id/name/group/words 完整保留，另保留303新增双子塔与埃菲尔铁塔，共52项。22张真实摄影，30个品牌精确矢量；缺失0项。

摄影仅缩小/编码WebP，预览与实际选用调用 photoMask301(item) 从原照片亮度提取明暗轮廓，包含现场背景，并非精密无背景建筑测绘。麦加为实景局部（钟塔顶部与钟面）；已另尝试整塔摄影，但公开原图服务429，因此不冒称完整外轮廓。

品牌使用精确标志图形，不是手绘近似图。爱马仕从品牌官方网站的 ng__hermes-logo SVG符号直接提取原始路径，已核验马车标志，避免误用同名物流公司。品牌版权与商标权保留；素材库许可不等于商标授权。

接入 features/portrait/outlines.json 为唯一清单，不合并旧地标SVG。photoDerived=true 项使用摄影阈值剪影，品牌 photoDerived=false 直接使用真实精确标志矢量。图片仅展示或选择时加载，不全量预取。

摄影预览、选择与导出保留作者、来源、许可和改编说明；CC BY-SA照片衍生剪影按相同许可提供。每项尺寸、SHA256和来源见 credits.json，逐项完整性核验见 validation.json。

| ID | 名称 | 分组 | 类型 | 作者/素材库 | 许可 | 来源 |
|---|---|---|---|---|---|---|
| burj | 哈利法塔 | 地标轮廓 | 摄影 | Laika ac | CC BY-SA 2.0 | [来源](https://commons.wikimedia.org/wiki/File:Burj_Khalifa_(16260269606).jpg) |
| merdeka | 默迪卡一一八 | 地标轮廓 | 摄影 | Ahmad Ali Karim | CC0 | [来源](https://commons.wikimedia.org/wiki/File:Merdeka_Tower_20241022_-_full_2.jpg) |
| shanghai | 上海中心 | 地标轮廓 | 摄影 | Stefan Fussan | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:Shanghai_-_Shanghai_Tower_-_0003(cropped).jpg) |
| makkah | 麦加皇家钟塔 | 地标轮廓 | 摄影 | King Eliot | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:Abraj_al_bait_Clock_1.jpg) |
| pingan | 平安金融中心 | 地标轮廓 | 摄影 | Charlie fong | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:Pingan_International_Finance_Center2020.jpg) |
| lotte | 乐天世界塔 | 地标轮廓 | 摄影 | kallerna | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:Lotte_World_morning_view_8.jpg) |
| oneworld | 世贸一号楼 | 地标轮廓 | 摄影 | Christian David | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:One_World_Trade_Center_at_blue_hour,_New_York_City.jpg) |
| guangzhou | 广州周大福中心 | 地标轮廓 | 摄影 | Milkomède | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:Guangzhou_CTF_Finance_Centre_02-10-2018.jpg) |
| tianjin | 天津周大福中心 | 地标轮廓 | 摄影 | BD2412 | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:Tianjin_CTF_Finance_Centre,_24_of_24(cropped).jpg) |
| citic | 中国尊 | 地标轮廓 | 摄影 | N509FZ | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:China_Zun_in_2020_(cropped).jpg) |
| sagrada | 圣家堂 | 宗教建筑 | 摄影 | Bernard Gagnon | CC BY-SA 3.0 | [来源](https://commons.wikimedia.org/wiki/File:Sagrada_Familia_03.jpg) |
| borobudur | 婆罗浮屠 | 宗教建筑 | 摄影 | Photo Dharma from Penang, Malaysia | CC BY 2.0 | [来源](https://commons.wikimedia.org/wiki/File:Borobudur_Stupas_and_Chaityas_-_076_Silhouette_(11678315845).jpg) |
| angkor | 吴哥窟 | 宗教建筑 | 摄影 | User: (WT-shared) Jpatokal at  wts wikivoyage | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:Angkor_Sunrise_Silhouette.JPG) |
| taj | 泰姬陵 | 宗教建筑 | 摄影 | Sdnphotoholic | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:Silhouette_of_Taj_Mahal_at_Sunset.jpg) |
| zayed | 谢赫扎耶德清真寺 | 宗教建筑 | 摄影 | PotatoWitch | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:Sheikh_Zayed_Mosque_Silhouette.jpg) |
| hagia | 圣索菲亚 | 宗教建筑 | 摄影 | Arild Vågen | CC BY-SA 3.0 | [来源](https://commons.wikimedia.org/wiki/File:Hagia_Sophia_Mars_2013.jpg) |
| peter | 圣彼得大教堂 | 宗教建筑 | 摄影 | Alvesgaspar | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg) |
| notredame | 巴黎圣母院 | 宗教建筑 | 摄影 | P e z i | CC BY-SA 3.0 | [来源](https://commons.wikimedia.org/wiki/File:Notre-Dame_de_Paris_2013-07-24.jpg) |
| shwedagon | 仰光大金塔 | 宗教建筑 | 摄影 | Jakub Hałun | CC BY-SA 4.0 | [来源](https://commons.wikimedia.org/wiki/File:20160813_Shwedagon_Pagoda_9949_DxO.jpg) |
| heaven | 天坛祈年殿 | 宗教建筑 | 摄影 | Bernhard Wintersperger | CC BY 2.0 | [来源](https://commons.wikimedia.org/wiki/File:Hall_of_Prayer_for_Good_Harvests_2013.jpg) |
| huawei | 华为 | 科技品牌 | 品牌精确矢量 | Lobe Icons contributors | Lobe Icons (MIT; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/huawei.svg) |
| apple | 苹果 | 科技品牌 | 品牌精确矢量 | Lobe Icons contributors | Lobe Icons (MIT; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/apple.svg) |
| gemini | 谷歌双子 | 科技品牌 | 品牌精确矢量 | Lobe Icons contributors | Lobe Icons (MIT; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/gemini.svg) |
| openai | 聊天伙伴 | 科技品牌 | 品牌精确矢量 | Lobe Icons contributors | Lobe Icons (MIT; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/openai.svg) |
| doubao | 豆包 | 科技品牌 | 品牌精确矢量 | Lobe Icons contributors | Lobe Icons (MIT; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/doubao.svg) |
| workbuddy | 腾讯办公伙伴 | 科技品牌 | 品牌精确矢量 | Lobe Icons contributors | Lobe Icons (MIT; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/workbuddy.svg) |
| qwen | 千问 | 科技品牌 | 品牌精确矢量 | Lobe Icons contributors | Lobe Icons (MIT; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/qwen.svg) |
| deepseek | 深度求索 | 科技品牌 | 品牌精确矢量 | Lobe Icons contributors | Lobe Icons (MIT; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/deepseek.svg) |
| claude | 克劳德 | 科技品牌 | 品牌精确矢量 | Lobe Icons contributors | Lobe Icons (MIT; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/claude.svg) |
| tesla | 特斯拉 | 汽车品牌 | 品牌精确矢量 | Simple Icons contributors | Simple Icons (CC0; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/tesla.svg) |
| aito | 问界 | 汽车品牌 | 品牌精确矢量 | Seres Group | Public domain | [来源](https://commons.wikimedia.org/wiki/File:AITO_logo_(transparent).svg) |
| liauto | 理想 | 汽车品牌 | 品牌精确矢量 | Li Auto | Public domain | [来源](https://commons.wikimedia.org/wiki/File:Li_Auto_logo.svg) |
| nio | 蔚来 | 汽车品牌 | 品牌精确矢量 | Original:  NIO (car company)  Vectorization:  UnknownUnknown  | Public domain | [来源](https://commons.wikimedia.org/wiki/File:NIO_logo.svg) |
| mercedesbenz | 奔驰 | 汽车品牌 | 品牌精确矢量 | Mercedes-Benz | Public domain | [来源](https://commons.wikimedia.org/wiki/File:Mercedes-Benz_Star.svg) |
| bmw | 宝马 | 汽车品牌 | 品牌精确矢量 | Simple Icons contributors | Simple Icons (CC0; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/bmw.svg) |
| audi | 奥迪 | 汽车品牌 | 品牌精确矢量 | Simple Icons contributors | Simple Icons (CC0; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/audi.svg) |
| maybach | 迈巴赫 | 汽车品牌 | 品牌精确矢量 | DaimlerChrysler AG | Public domain | [来源](https://commons.wikimedia.org/wiki/File:Maybach_symbol.svg) |
| rollsroyce | 劳斯莱斯 | 汽车品牌 | 品牌精确矢量 | Simple Icons contributors | Simple Icons (CC0; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/rollsroyce.svg) |
| porsche | 保时捷 | 汽车品牌 | 品牌精确矢量 | Simple Icons contributors | Simple Icons (CC0; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/porsche.svg) |
| hermes | 爱马仕 | 奢侈品牌 | 品牌精确矢量 | Hermès International S.A. | Official brand logo; copyright and trademark retained | [来源](https://www.hermes.com/us/en/) |
| louisvuitton | 路易威登 | 奢侈品牌 | 品牌精确矢量 | Louis Vuitton | Public domain | [来源](https://commons.wikimedia.org/wiki/File:Louis_Vuitton_logo_and_wordmark.svg) |
| dior | 迪奥 | 奢侈品牌 | 品牌精确矢量 | Simple Icons contributors | Simple Icons (CC0; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/dior.svg) |
| gucci | 古驰 | 奢侈品牌 | 品牌精确矢量 | Gucci | Public domain | [来源](https://commons.wikimedia.org/wiki/File:Gucci_Logo.svg) |
| prada | 普拉达 | 奢侈品牌 | 品牌精确矢量 | Prada S.p.A. | Public domain | [来源](https://commons.wikimedia.org/wiki/File:Prada-Logo.svg) |
| burberry | 博柏利 | 奢侈品牌 | 品牌精确矢量 | Burberry Group | Public domain | [来源](https://commons.wikimedia.org/wiki/File:Burberry_Logo.svg) |
| cartier | 卡地亚 | 奢侈品牌 | 品牌精确矢量 | Unknown authorUnknown author | Public domain | [来源](https://commons.wikimedia.org/wiki/File:Cartier_logo.svg) |
| bvlgari | 宝格丽 | 奢侈品牌 | 品牌精确矢量 | Bulgari | Public domain | [来源](https://commons.wikimedia.org/wiki/File:Bulgari_logo.svg) |
| microsoft | 微软 | 科技品牌 | 品牌精确矢量 | Lobe Icons contributors | Lobe Icons (MIT; underlying brand trademark retained) | [来源](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/microsoft.svg) |
| chanel | 香奈儿 | 奢侈品牌 | 品牌精确矢量 | Unknown authorUnknown author | Public domain | [来源](https://commons.wikimedia.org/wiki/File:Chanel_logo.svg) |
| tiffany | 蒂芙尼 | 奢侈品牌 | 品牌精确矢量 | Tiffany &amp; Co. of New York Limited | Public domain | [来源](https://commons.wikimedia.org/wiki/File:Tiffany_%26_Co._2024_logo.svg) |
| petronas | 双子塔 | 地标轮廓 | 摄影 | Michael | Public domain | [来源](https://commons.wikimedia.org/wiki/File:Petronas_Towers_Silver_Sunset.jpg) |
| eiffel | 埃菲尔铁塔 | 地标轮廓 | 摄影 | Jan.Keromnes | CC0 | [来源](https://commons.wikimedia.org/wiki/File:The_Eiffel_Tower_2.jpg) |
