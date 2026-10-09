/* Source images remain intact. Segments are normalized view rectangles, in reading order. */
(function(root){
function author(data){return String(data.author||(/·/.test(data.title||'')?data.title.split('·')[0]:'作者待考')).trim()}
function groups(chapters,data){const out=[],map=new Map();for(const chapter of chapters){const d=data(chapter);if(d.deleted)continue;const name=author(d),key=name==='作者待考'?chapter.id:(d.era||'')+'|'+name;let g=map.get(key);if(!g){g={name,era:d.era||'',chapters:[]};map.set(key,g);out.push(g)}g.chapters.push(chapter)}return out}
function segments(width,height){const ratio=width/height;if(!Number.isFinite(ratio)||ratio<2.8)return[{x:0,w:1}];const n=Math.min(48,Math.max(2,Math.ceil(ratio/.8)));return Array.from({length:n},(_,i)=>({x:(n-i-1)/n,w:1/n}))}
function text(data,corpus){if(data.fullText148)return data.fullText148;const name=String(data.title||'').split('·').at(-1).replace(/[\s《》]/g,'');if(!name)return '';const normal=s=>s.replace('兰亭集序','兰亭序').replace('黄州寒食帖','寒食帖').replace('滕王阁序并诗','滕王阁序');const matches=(corpus||[]).filter(x=>{const title=String(x.name||'').split('·').at(-1).replace(/[\s《》]/g,'');return normal(title)===normal(name)||name.includes('千字文')&&title.includes('千字文')});return matches[0]?.text||''}
function link(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:''}catch{return ''}}
root.GalleryModel148={author,groups,segments,text,link};
})(typeof window==='undefined'?globalThis:window);
