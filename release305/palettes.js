/* Seven vivid paper families, shuffled without repetition before a refill. */
(function(root){
 const rows=[['朱红','#c71f2b','#fff4ce','#132f48'],['橙霞','#ff8728','#233048','#742061'],['明黄','#ffe33b','#23304b','#a52b49'],['翠绿','#22bb79','#112e33','#74204f'],['湛蓝','#1667d9','#fff4c8','#ffb343'],['靛青','#36348e','#fff0c7','#ee9071'],['绛紫','#9b3bc0','#fff4d4','#183c35']];
 let bag=[],turn=0,last=-1;
 function next(){if(!bag.length){bag=rows.map((_,i)=>i);for(let i=bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}if(bag.at(-1)===last)[bag[0],bag[bag.length-1]]=[bag.at(-1),bag[0]]}last=bag.pop();const[name,paper,ink,seal]=rows[last];return{id:'vivid305-'+last,name,paper,ink,seal,family:'鲜彩',idea:'鲜彩纸色，配以对比墨色与印色。'}}
 root.BoldPalettes305={next,nextBold:()=>++turn%2===1,rows};
})(typeof window==='undefined'?globalThis:window);
