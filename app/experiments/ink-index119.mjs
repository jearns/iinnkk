// Detached viewport lookup prototype; no canvas or pointer events.
export class InkViewportIndex{
 constructor(box,cell=1){this.box=box;this.cell=cell;this.strokes=[];this.tiles=new Map()}
 setStrokes(strokes){this.strokes=strokes;this.tiles.clear();for(let i=0;i<strokes.length;i++)this.add(i,strokes[i])}
 add(index,stroke){const b=this.box(stroke);if(!b||!Number.isFinite(b.x+b.y+b.w+b.h))return;const x0=Math.floor(b.x/this.cell),x1=Math.floor((b.x+b.w)/this.cell),y0=Math.floor(b.y/this.cell),y1=Math.floor((b.y+b.h)/this.cell);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const key=x+','+y;if(!this.tiles.has(key))this.tiles.set(key,[]);this.tiles.get(key).push(index)}}
 visible(rect){const x0=Math.floor(rect.x/this.cell),x1=Math.floor((rect.x+rect.w)/this.cell),y0=Math.floor(rect.y/this.cell),y1=Math.floor((rect.y+rect.h)/this.cell),indices=new Set();for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)for(const i of this.tiles.get(x+','+y)||[])indices.add(i);return [...indices].sort((a,b)=>a-b).filter(i=>{const b=this.box(this.strokes[i]);return b&&b.x+b.w>=rect.x&&b.x<=rect.x+rect.w&&b.y+b.h>=rect.y&&b.y<=rect.y+rect.h}).map(i=>this.strokes[i])}
}
