# 224 版书法文化点数据说明

`calligraphy-places224.json` 为顶层数组，共 113 个文化点，其中中国 105 个、南京 15 个，覆盖 72 个城市／县级地区，另含纽约、伦敦、牛津、巴黎、东京、京都、首尔藏馆。它独立于本站收录作品，用于附近距离筛选和地图文化点推荐，不表示这些地点有实时书法展览。

## 字段及维护

- `id` 为稳定标识，不以名称变化而改变。
- `name / country / city / institution / address / type / authors / keywords / source` 为展示和检索元数据；地址只在有把握时精确到门牌，否则保留到馆区、景区或保护片区。
- `lon / lat` 为人工整理的 WGS84 概略位置。`coordinateAccuracyM` 是界面应容许的区域级近似范围，不是实测精度保证；建议导航优先按机构名称和城市检索，不把这些坐标当作精确入口。中国坐标不能直接视作 GCJ-02。
- `sourceType` 区分百科与机构／公共资料；`verification` 明确标记人工整理、位置概略。`curatedAt` 表示本次整理日期，并不代表各来源都通过逐页 HTTP 可用性检查或现场核验。
- `relatedChapter` 仅在确定可关联本站已有封面时给出。关联封面是视觉参考；不表示拍摄于该文化点，亦不保证作品在那里展出。
- 新增或修订时先核馆方／文旅／文物保护资料，再更新地址与坐标；故居须保留是否开放的说明。不要把特展推测成常设，不要根据作者籍贯推断作品藏地。

## 南京核实重点

1. 求雨山馆方《求雨山踏青图鉴》：https://www.njqys.com/content.html?id=1163
   明确林散之、胡小石、高二适、萧娴四馆，地址南京市浦口区雨山路48号。四个分馆和总馆使用同一园区概略坐标，应聚合气泡，不能当作五个独立入口。
2. 求雨山馆方概况：https://www.njqys.com/introduce.html?id=21
3. 南京市城市管理局《300米的巷子，我走了30分钟》：https://cgj.nanjing.gov.cn/bmdt/202501/t20250115_5056109.html
   列出中央路117号林散之居住旧址、高云岭39-1号武中奇旧居。故居数据明确提示不代表对外开放。
4. 南京博物院参观信息：https://www.njmuseum.org.cn/zh/visitIndex
5. 玄武区政府场馆信息：https://www.xwzf.gov.cn/ztzl/szwl/wlzx/202501/t20250126_5066760.html
   六朝博物馆为长江路302号；展览日期未导入，以免过期展讯被当作实时推荐。
6. 明孝陵园区官方资料：https://zschina.nanjing.gov.cn/fjms/jqjd/mxljq/
7. 栖霞寺碑刻官方地方志：https://dfz.nanjing.gov.cn/gzdt/202408/t20240805_4732223.html
8. 南京市政府南朝陵墓石刻保护答复：https://www.nanjing.gov.cn/xxgkn/jytabljggk/2024njytabl/shizxta/202411/t20241120_5013534.html
   该遗产跨栖霞、江宁多个点，数据库只给栖霞片区概略位置，已单独标记较大不确定范围。

## 其他本次重点交叉核实的原始资料

- 汉中石门十三品已迁至汉中市博物馆，不将原水库遗址误作现藏地：
  https://www.htq.gov.cn/hzshtqzf/zjht/lswh/201707/312e445fc8eb26fd26e26ed8d7f0edf8.shtml
- 汉阴三沈纪念馆：https://www.hanyin.gov.cn/Content-2713115.html
- 临沂王羲之故居：https://www.linyi.gov.cn/info/4748/345230.htm
- 云峰山郑文公碑：https://www.laizhou.gov.cn/art/2021/11/12/art_23203_2932809.html
- 泰山经石峪及纪泰山铭：https://whlyj.taian.gov.cn/art/2017/3/8/art_337015_10299587.html
- 桂海碑林景区资料：https://www.glqxjq.cn/post/ghbl.html
- 柳子庙与荔子碑：https://www.yzcity.gov.cn/wlgtj/0204/202102/9fc1a823f7844096a24d20487b283d7f.shtml
- 宜昌三游洞及题刻：https://www.yichang.gov.cn/content-56664-1017898-1.html
- 赵孟頫艺术馆位于莲花庄路湖笔博物馆内，而非衣裳街：
  https://www.huzhou.gov.cn/art/2013/6/20/art_1229213513_55698080.html
- 安吉吴昌硕纪念馆地址由县政府采购公告核对：
  https://ggzy.anji.gov.cn/jyxx/003002/003002011/003002011001/20231214/6aae39d0-edcf-4dd7-9896-2359a1384a6c.html
- 翁同龢纪念馆：https://visitsz.wglj.suzhou.com.cn/venue-detail.aspx?id=2

## 来源边界

73 条使用机构、政府或其他公共资料 URL；40 条使用百科条目作为可复查的地点资料入口。百科条目及部分机构主页并未在此次任务逐个抓取全文。坐标是区域级人工整理，并未声称来自 Wikidata 或 OpenStreetMap；公开 Wikimedia API 抓取尝试返回 403，故没有伪称完成批量开放地理数据导入。文化点事实、机构主页和实际开放状况应持续维护。

本数据不包含图片、不请求 Supabase、不含用户位置数据、不声称提供完整中国书法遗产名录。附近 50 公里是以概略文化点计算的直线距离，不是车程；边界附近结果应视为大致范围。展讯应链接馆方近期展览页面另行核实。
