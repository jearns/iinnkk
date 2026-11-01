# 摄影轮廓来源与接入说明

核验日期：2026-11-01。以下均为真实现场摄影；由原照片像素的亮度阈值提取剪影，没有卡通转PNG或合成建筑。图片仅缩小至最长边2400px并转换WebP。

| 项目 | 摄影作者 | 许可 | 原始尺寸 | 本地尺寸 | 来源 |
|---|---|---|---|---|---|
| 双子塔 | Michael | [Public domain](https://commons.wikimedia.org/wiki/File:Petronas_Towers_Silver_Sunset.jpg) | 5312×2988 | 2400×1350 | [Commons文件页](https://commons.wikimedia.org/wiki/File:Petronas_Towers_Silver_Sunset.jpg) |
| 埃菲尔铁塔 | Jan.Keromnes | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) | 4048×3036 | 2400×1800 | [Commons文件页](https://commons.wikimedia.org/wiki/File:The_Eiffel_Tower_2.jpg) |
| 泰姬陵 | Sdnphotoholic | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 3600×2400 | 2400×1600 | [Commons文件页](https://commons.wikimedia.org/wiki/File:Silhouette_of_Taj_Mahal_at_Sunset.jpg) |
| 吴哥窟 | User: (WT-shared) Jpatokal at  wts wikivoyage | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 3008×2000 | 2400×1596 | [Commons文件页](https://commons.wikimedia.org/wiki/File:Angkor_Sunrise_Silhouette.JPG) |
| 婆罗浮屠 | Photo Dharma from Penang, Malaysia | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 4320×3240 | 2400×1800 | [Commons文件页](https://commons.wikimedia.org/wiki/File:Borobudur_Stupas_and_Chaityas_-_076_Silhouette_(11678315845).jpg) |

接入时使用 release303/outlines.json 作为地标和建筑预设的唯一清单。预览和实际选用都调用 photoMask301(item)，不能只显示原照片，也不能在失败时回退到旧SVG。旧品牌项目如需保留，应另行仅筛选品牌组。

预览、选中状态与导出保留摄影作者、来源链接、许可证及“由照片提取明暗剪影”改编说明。CC BY-SA照片的剪影改编依其许可提供；许可证不能仅在仓库文件中隐藏。

当前精选5项，不宣称已为旧20项逐一找到照片。以下未列入本次选择器的旧地标/建筑ID应移除，不能回退旧卡通：burj, merdeka, shanghai, makkah, pingan, lotte, oneworld, guangzhou, tianjin, citic, sagrada, zayed, hagia, peter, notredame, shwedagon, heaven。

历史源文件留存不等同于继续作为活动预设展示。
