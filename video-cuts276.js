/* Shared edit decisions for playback, the timeline, history and exported samples. */
(function(root){
function clean(rows,duration){const out=[];for(const r of rows||[]){const a=Math.max(0,Number(r[0])||0),b=Math.min(duration,Number(r[1])||0);if(b-a>=.08&&(!out.length||a>=out.at(-1)[1]))out.push([a,b])}return out.length?out:[[0,duration]]}
const total=rows=>rows.reduce((s,[a,b])=>s+b-a,0);
function source(rows,time){let t=Math.max(0,Math.min(total(rows),Number(time)||0));for(const[a,b]of rows){if(t<b-a)return a+t;t-=b-a}return Math.max(rows.at(-1)[0],rows.at(-1)[1]-.001)}
function time(rows,source){let t=0;for(const[a,b]of rows){if(source<a)return t;if(source<b)return t+source-a;t+=b-a}return t}
function span(rows,start,duration){let t=0;for(const[a,b]of rows){const x=Math.max(a,start),y=Math.min(b,start+duration);if(y>x)return{timestamp:t+x-a,duration:y-x,start:x};t+=b-a}return null}
root.VideoTimeline276={clean,total,source,time,span};
})(typeof window==='undefined'?globalThis:window);
