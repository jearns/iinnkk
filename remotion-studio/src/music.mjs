export const MUSIC_TRACKS = [
 {id:'qiannian',title:'千年之后',directory:'video-music296',credit:'用户指定音源：https://music.163.com/song/media/outer/url?id=3442664844.mp3；轻量AAC裁切、音量与淡入淡出调整；原录音权利归原权利人。'},
  {
    "id": "strauss",
    "title": "施特劳斯 · 蓝色多瑙河",
    "credit": "United States Marine Band; 美国联邦政府作品 · 公有领域; https://commons.wikimedia.org/wiki/Template:PD-USGov-Military-Marines; https://commons.wikimedia.org/wiki/File:\"An der schönen, blauen Donau\" performed by the U.S. Marine Band.flac; AAC excerpt, volume and fades adjusted; video-music295/CREDITS.md"
  },
  {
    "id": "mozart",
    "title": "莫扎特 · G大调弦乐小夜曲·快板",
    "credit": "Advent Chamber Orchestra；Roxanna Pavel Goldstein（音乐指导）; CC BY-SA 2.0; https://creativecommons.org/licenses/by-sa/2.0; https://commons.wikimedia.org/wiki/File:Mozart - Eine kleine Nachtmusik - 1. Allegro.ogg; AAC excerpt, volume and fades adjusted; video-music295/CREDITS.md"
  },
  {
    "id": "chopin",
    "title": "肖邦 · 降E大调夜曲 Op.9 No.2",
    "credit": "Beeswaxcandle at English Wikisource and Londonjackbooks at English Wikisource; CC BY-SA 3.0; https://creativecommons.org/licenses/by-sa/3.0; https://commons.wikimedia.org/wiki/File:Chopin Nocturne Op 9 No 2.ogg; AAC excerpt, volume and fades adjusted; video-music295/CREDITS.md"
  },
  {
    "id": "spring",
    "title": "维瓦尔第 · 四季·春·快板 RV269",
    "credit": "John Harrison（小提琴）；Robert Turizziani（指挥）；Wichita State University Chamber Players; CC BY-SA 4.0; https://creativecommons.org/licenses/by-sa/4.0/; https://commons.wikimedia.org/wiki/File:Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga; AAC excerpt, volume and fades adjusted; video-music295/CREDITS.md"
  },
  {
    "id": "focus-goldberg",
    "title": "专注精选 · 巴赫《哥德堡变奏曲》咏叹调",
    "credit": "Kimiko Ishizaka（钢琴）; 公有领域演奏; https://creativecommons.org/publicdomain/mark/1.0/; https://commons.wikimedia.org/wiki/File:Goldberg_Variations_01_Aria.ogg; AAC excerpt, volume and fades adjusted; video-music295/CREDITS.md"
  },
  {
    "id": "focus-satie",
    "title": "专注精选 · 萨蒂《第一号裸体歌舞》",
    "credit": "Robin Alciatore（钢琴）; 公有领域演奏; https://creativecommons.org/publicdomain/mark/1.0/; https://commons.wikimedia.org/wiki/File:Erik_Satie_-_gymnopedies_-_la_1_ere._lent_et_douloureux.ogg; AAC excerpt, volume and fades adjusted; video-music295/CREDITS.md"
  },
  {
    "id": "focus-debussy",
    "title": "专注精选 · 德彪西《月光》",
    "credit": "Laurens Goedhart（钢琴）; CC BY 3.0; https://creativecommons.org/licenses/by/3.0/; https://commons.wikimedia.org/wiki/File:Clair_de_lune_(Claude_Debussy)_Suite_bergamasque.ogg; AAC excerpt, volume and fades adjusted; video-music295/CREDITS.md"
  },
  {
    "id": "bach",
    "title": "巴赫 · 第一大提琴组曲·前奏曲",
    "credit": "John Michel（大提琴）; CC BY-SA 3.0; https://creativecommons.org/licenses/by-sa/3.0/; https://commons.wikimedia.org/wiki/File:JOHN_MICHEL_CELLO-J_S_BACH_CELLO_SUITE_1_in_G_Prelude.ogg; AAC excerpt, volume and fades adjusted; video-music295/CREDITS.md"
  },
  {
    "id": "nature",
    "title": "山林共鸣 · 鸟鸣虫鸣风声滴水落叶",
    "credit": "nille Public domain; ZooFari CC BY-SA 3.0; Wilfredor CC0; music/CREDITS.md; AAC transcode and fades adjusted; video-music295/CREDITS.md"
  },
  {
    "id": "water",
    "title": "山水白噪音 · 流水声",
    "credit": "GOLD TAPE 53/54 field recording, CC0; music/CREDITS.md; AAC transcode and fades adjusted; video-music295/CREDITS.md"
  },
  {
    "id": "rain",
    "title": "山水白噪音 · 下雨声",
    "credit": "Silencyo CC0; music/CREDITS.md; AAC transcode and fades adjusted; video-music295/CREDITS.md"
  },
  {
    "id": "ocean",
    "title": "山水白噪音 · 海浪声",
    "credit": "Rmutt CC0; music/CREDITS.md; AAC transcode and fades adjusted; video-music295/CREDITS.md"
  }
];
export function musicTrack(id){return MUSIC_TRACKS.find(x=>x.id===id)||null;}
export function musicSource(id,seconds){return musicTrack(id)?`${musicTrack(id).directory||'video-music295'}/${id}-${[8,15,30,60,120].includes(Number(seconds))?Number(seconds):30}.m4a`:null;}
