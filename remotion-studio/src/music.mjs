export const MUSIC_TRACKS = [
  {id: 'yangguan', title: '古风 · 阳关三叠', credit: '阳关三叠 — Charlie Huang; CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/); excerpt, volume and fades adjusted, AAC transcode; https://commons.wikimedia.org/wiki/File:Guqin-Yangguan_Sandie.ogg'},
  {id: 'fisher', title: '古风 · 醉渔唱晚', credit: '醉渔唱晚 — Charlie Huang; CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/); excerpt, volume and fades adjusted, AAC transcode; https://commons.wikimedia.org/wiki/File:Guqin-Zuiyu_Changwan.ogg'},
  {id: 'satie', title: '古典 · 萨蒂第一号裸体歌舞', credit: 'Gymnopédie No.1 — Erik Satie; piano Robin Alciatore; Public domain; https://commons.wikimedia.org/wiki/File:Erik_Satie_-_gymnopedies_-_la_1_ere._lent_et_douloureux.ogg'},
  {id: 'bach', title: '古典 · 巴赫哥德堡咏叹调', credit: 'Goldberg Variations Aria — J.S. Bach; piano Kimiko Ishizaka; Public domain; https://commons.wikimedia.org/wiki/File:Goldberg_Variations_01_Aria.ogg'},
];
export function musicTrack(id) { return MUSIC_TRACKS.find(track => track.id === id) || null; }

export function musicSource(id, seconds) { return musicTrack(id) ? `video-music292/${id}-${[8,15,30,60,120].includes(Number(seconds)) ? Number(seconds) : 30}.m4a` : null; }
