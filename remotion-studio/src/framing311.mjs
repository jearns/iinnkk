// Spatial writing regions: adjacent strokes form a character; long cursive
// connections are divided into local writing regions without changing the ink.
const median=a=>a.length?[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)]:0;
const quantile=(a,q)=>a.length?[...a].sort((x,y)=>x-y)[Math.floor((a.length-1)*q)]:0;
const empty=()=>({x:Infinity,y:Infinity,r:-Infinity,b:-Infinity});
const add=(b,p)=>{b.x=Math.min(b.x,p.x);b.y=Math.min(b.y,p.y);b.r=Math.max(b.r,p.x);b.b=Math.max(b.b,p.y);return b};
const join=(a,b)=>({x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),r:Math.max(a.r,b.r),b:Math.max(a.b,b.b)});
export function writingRegions311(pages,pointFor){
 const result=[];
 for(const p of pages){
  const page=p.page,entries=[];
  for(let index=0;index<(page.records||[]).length;index++){const record=page.records[index],points=record.st.points||[];if(!points.length)continue;const box=empty();for(const point of points){const q=pointFor(page,record,point);add(box,{x:q.x*page.width,y:q.y*page.height})}entries.push({record,index,box})}
  if(!entries.length){result.push({page:p.index,start:p.start,end:p.end,box:{x:0,y:0,r:1,b:1},paperBox:{x:0,y:0,r:1,b:1},ink:false});continue}
  let travelX=0,travelY=0;for(let i=1;i<entries.length;i++){const a=entries[i-1].box,b=entries[i].box;travelX+=Math.abs((a.x+a.r-b.x-b.r)/2);travelY+=Math.abs((a.y+a.b-b.y-b.b)/2)}
  const vertical=page.direction311?page.direction311!=='horizontal':travelY>=travelX;
  const small=Math.min(page.width,page.height),minor=entries.map(e=>vertical?e.box.r-e.box.x:e.box.b-e.box.y).filter(n=>n>small*.003),compact=entries.map(e=>({w:e.box.r-e.box.x,h:e.box.b-e.box.y})).filter(b=>Math.max(b.w,b.h)<Math.min(b.w,b.h)*3&&Math.min(b.w,b.h)>small*.003).map(b=>Math.max(b.w,b.h));
  const size=Math.max(small*.025,Math.min(small*.22,Math.max(quantile(minor,.75),median(compact)*.7,median(entries.map(e=>vertical?e.box.b-e.box.y:e.box.r-e.box.x))*.9,minor.length?0:small*.08)*1.25));
  const chunks=[];
  for(const e of entries){const r=e.record,pts=r.st.points,major=vertical?e.box.b-e.box.y:e.box.r-e.box.x,long=major>size*2.6;let box=empty(),mapped=empty(),from=0,lastT=0,previous=null;
   const emit=to=>{if(!Number.isFinite(box.x)||to<=from)return;chunks.push({start:p.start+p.span*(r.start+from)/(page.total||1),end:p.start+p.span*(r.start+to)/(page.total||1),paperBox:box,box:mapped,stroke:e.index});from=to;box=empty();mapped=empty()};
   for(let i=0;i<pts.length;i++){
    const prev=pts[Math.max(0,i-1)],current=pts[i],a=pointFor(page,r,prev),b=pointFor(page,r,current),distance=Math.hypot((b.x-a.x)*page.width,(b.y-a.y)*page.height),steps=long&&i?Math.max(1,Math.ceil(distance/Math.max(1,size*.35))):1;
    for(let j=i?1:0;j<=steps;j++){const t=i?i-1+j/steps:0,u=i?j/steps:0,raw={x:prev.x+(current.x-prev.x)*u,y:prev.y+(current.y-prev.y)*u},q=pointFor(page,r,raw),physical={x:q.x*page.width,y:q.y*page.height},projected=p.map(q),combined=add({...box},physical),span=vertical?combined.b-combined.y:combined.r-combined.x;
     if(long&&span>size*1.5&&lastT>from&&previous){emit(lastT);add(box,previous.physical);add(mapped,previous.projected)}
     add(box,physical);add(mapped,projected);previous={physical,projected};lastT=t;
    }
   }
   emit(Math.max(1,pts.length-1));
  }
  let group=null;
  const save=()=>{if(group){result.push({...group,page:p.index,ink:true,direction:vertical?'vertical':'horizontal'});group=null}};
  for(const c of chunks){if(!group){group={...c};continue}const a=group.paperBox,b=c.paperBox,combined=join(a,b),majorDelta=vertical?Math.abs((a.y+a.b-b.y-b.b)/2):Math.abs((a.x+a.r-b.x-b.r)/2),minorDelta=vertical?Math.abs((a.x+a.r-b.x-b.r)/2):Math.abs((a.y+a.b-b.y-b.b)/2),majorSpan=vertical?combined.b-combined.y:combined.r-combined.x,minorGap=vertical?Math.max(0,b.x-a.r,a.x-b.r):Math.max(0,b.y-a.b,a.y-b.b);
   const next=majorDelta>size&&majorSpan>size*1.8||minorDelta>size*1.2&&minorGap>size*.2||c.stroke===group.stroke&&majorSpan>size*1.6;
   if(next){save();group={...c}}else{group.end=c.end;group.paperBox=combined;group.box=join(group.box,c.box);group.stroke=c.stroke}
  }
  save();
 }
 return result;
}
