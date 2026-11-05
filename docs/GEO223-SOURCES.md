# 书迹地图资料

作品名称、年代与藏馆沿用 `home-data154.json`、`timeline/manifest.json` 和既有世界文字条目。版本或收藏机构不明的作品不放虚构地图点。吉尔伽美什条目同时列牛津与伦敦两处藏馆。

地图陆地数据为 Natural Earth 1:110m land，公共领域，取两位小数以压缩大小：
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson
https://www.naturalearthdata.com/about/terms-of-use/

机构坐标用于世界分布与 50km 粗略距离；不是景区或博物馆入口坐标。实地出行的主要按钮按机构名称、城市打开高德地点检索，以馆方和地图当天的入口、预约、开放信息为准；另提供明确 WGS84 的坐标定位链接。

核对资料（2026-10-17）：
- 故宫： https://commons.wikimedia.org/wiki/Institution:Palace_Museum
- 辽宁省博物馆： https://www.wikidata.org/wiki/Q3330767
- 湖南博物院： https://www.wikidata.org/wiki/Q5942029
- 西安碑林： https://www.wikidata.org/wiki/Q641427
- 宝鸡青铜器博物院： https://www.wikidata.org/wiki/Q48162947 ，官网 https://www.bjqtm.com/
- 隆兴寺： https://www.wikidata.org/wiki/Q1507370
- 殷墟博物馆： https://www.wikidata.org/wiki/Q130483400 ，官网现跳转 https://www.yinxubwg.cn/yxgw/
- 苏州博物馆： https://www.wikidata.org/wiki/Q998042
- 焦山： https://en.wikipedia.org/w/api.php?action=query&prop=coordinates&titles=Jiaoshan&format=json
- 龙门、台北故宫、大都会、阿什莫林、大英、卢浮宫、以色列博物馆、圣三一、切斯特·比蒂坐标核对： Wikimedia API 的机构坐标字段。
- 九成宫、兰亭、三苏祠为景区概略位置，需用高德按名字查出行入口。

高德 URI 官方文档：
https://lbs.amap.com/api/uri-api/guide/mobile-web/point
https://developer.amap.com/api/uri-api/guide/search/search

定位仅保存在当前浏览器本机；没有上传定位、持续定位、地图 SDK、外部地图瓦片或地理数据库查询。展讯入口为机构官网，不伪造当前展览。
