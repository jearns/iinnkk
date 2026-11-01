# 303 用户指定音乐来源核验

2026-11-01，14条网易外链均优先通过HTTPS直接公开访问。没有登录、付费接口或绕过限制。仅按HTTP 200判断会误报：其中10条实际返回网易404 HTML。

下列曲名与括号内演奏/演唱者按用户提供的信息记录；不将其标为本站演奏、CC0或开放授权。原词曲及录音权利归原权利人。

| 曲名 | 用户提供演奏/演唱者 | 网易ID | 验证结果 |
| --- | --- | --- | --- |
| 沧海一声笑 | 黄霑 | [3312527187](https://music.163.com/song/media/outer/url?id=3312527187.mp3) | MP3；178.296000秒；ID3、ffprobe及全片解码通过 |
| 云宫迅音 | 许镜清 | [2628466650](https://music.163.com/song/media/outer/url?id=2628466650.mp3) | MP3；116.062041秒；ID3、ffprobe及全片解码通过 |
| 出埃及记 | 马克西姆 | [1695922](https://music.163.com/song/media/outer/url?id=1695922.mp3) | HTML错误页，非音频 |
| 野蜂飞舞 | 马克西姆 | [1915256246](https://music.163.com/song/media/outer/url?id=1915256246.mp3) | HTML错误页，非音频 |
| Moby Dick | 齐柏林飞船 | [2003977754](https://music.163.com/song/media/outer/url?id=2003977754.mp3) | HTML错误页，非音频 |
| 滚核桃 | 山西绛州鼓乐 | [2630864134](https://music.163.com/song/media/outer/url?id=2630864134.mp3) | HTML错误页，非音频 |
| 十面埋伏 | 未指定 | [490637515](https://music.163.com/song/media/outer/url?id=490637515.mp3) | MP3；131.082449秒；ID3、ffprobe及全片解码通过 |
| 小刀会序曲 | 未指定 | [128669](https://music.163.com/song/media/outer/url?id=128669.mp3) | HTML错误页，非音频 |
| 渔舟唱晚 | 未指定 | [62567](https://music.163.com/song/media/outer/url?id=62567.mp3) | HTML错误页，非音频 |
| 将进酒 | 未指定 | [2063436719](https://music.163.com/song/media/outer/url?id=2063436719.mp3) | HTML错误页，非音频 |
| 定风波 | 未指定 | [1859192821](https://music.163.com/song/media/outer/url?id=1859192821.mp3) | MP3；230.034286秒；ID3、ffprobe及全片解码通过 |
| 高山流水 | 未指定 | [1954611957](https://music.163.com/song/media/outer/url?id=1954611957.mp3) | HTML错误页，非音频 |
| 春江花月夜 | 未指定 | [1895373087](https://music.163.com/song/media/outer/url?id=1895373087.mp3) | HTML错误页，非音频 |
| 广陵散 | 未指定 | [396334](https://music.163.com/song/media/outer/url?id=396334.mp3) | HTML错误页，非音频 |

## 可播放来源

- 沧海一声笑：https://music.163.com/song/media/outer/url?id=3312527187.mp3；SHA-256 `e1f3ded1a6528f3ac9886091394dabf29d9ca56e78349fb622b972e8f27c3bdb`。
- 云宫迅音：https://music.163.com/song/media/outer/url?id=2628466650.mp3；SHA-256 `7799a9e6ea536fcccac3f322a4cb28c330df646d01915bca747f523282730ea6`。
- 十面埋伏：https://music.163.com/song/media/outer/url?id=490637515.mp3；SHA-256 `9e1e1f57f5643ed2c292076d5851d8be37ed9ed1cf99fbf2afddbc219c41e4f9`。
- 定风波：https://music.163.com/song/media/outer/url?id=1859192821.mp3；SHA-256 `40469c6a442774880d94f3e50a49d221c85bb6c28be2555320af40ac4a0a84c3`。

本目录仅保存审计说明，没有新增或替换音频资产。成功响应的完整原始音频临时保存在 `/tmp/music303-ID.bin`，可供主任务复用核验；不应把临时文件路径作为网站播放地址。若后续按用户指定接入并裁切转码，应在这里追加实际改动（时长、格式、音量、淡入淡出），保留原始来源和权利归属。

全站统一音乐库建议详见 `release303/music-audit.json`。使用单一曲目注册表和显式播放/导出路径；保留旧资源、用户本机音源和点击后加载，不把失效HTML、异曲或空占位项当作可播放录音。
