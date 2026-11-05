/* Balanced nine-color cycles for paper, ink and seal. */
(function(root){
 const rows=[['朱红','#c71f2b'],['橙霞','#ff8728'],['明黄','#ffe33b'],['翠绿','#22bb79'],['湛蓝','#1667d9'],['靛青','#36348e'],['绛紫','#9b3bc0'],['素白','#ffffff'],['玄黑','#111111']];
 const lum=hex=>{const c=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722};
 const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 let bag=[],turn=0,last=-1,cycle=0;const inks=new Map,seals=new Map;
 function next(){if(!bag.length){bag=rows.map((_,i)=>i);for(let i=bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}if(bag.at(-1)===last)[bag[0],bag[bag.length-1]]=[bag.at(-1),bag[0]];cycle++}
 last=bag.pop();const[name,paper]=rows[last];const choose=(counts,min,avoid)=>rows.filter(r=>r[1]!==paper&&r[1]!==avoid&&contrast(paper,r[1])>=min).sort((a,b)=>(counts.get(a[1])||0)-(counts.get(b[1])||0)||((rows.indexOf(a)+cycle)%9)-((rows.indexOf(b)+cycle)%9))[0][1];
 const ink=choose(inks,3),seal=choose(seals,2,ink);inks.set(ink,(inks.get(ink)||0)+1);seals.set(seal,(seals.get(seal)||0)+1);return{id:'vivid306-'+last,name,paper,ink,seal,family:'鲜彩',idea:'鲜彩纸色，配以对比墨色与印色。'}}
 root.BoldPalettes305={next,nextBold:()=>++turn%2===1,rows};
})(typeof window==='undefined'?globalThis:window);
