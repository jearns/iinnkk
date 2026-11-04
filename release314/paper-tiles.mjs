// Genuine blank-paper texture repeats independently of the small edge seals.
// One provider is shared by the writer, film preview, poster and export.
const cache314=new Map();
const decode314=async src=>{const im=new Image();im.src=src;await im.decode();return im};
export function paperLayout314(row,width,height){const short=Math.min(width,height),tile=row.tile314,k=short/(tile.referenceShortSide||900)*(tile.referenceScale||1);return{tileWidth:tile.width*k,tileHeight:tile.height*k,seals:(row.seals314||[]).map(s=>{const w=short*s.relativeWidth,h=w*s.height/s.width,inset=short*s.insetRatio;return{...s,x:s.edge==='right'?width-w-inset:inset,y:height*s.centerY-h/2,w,h}})}}
export async function preparePaper314(row){if(!row?.tile314)return null;let flight=cache314.get(row.id);if(!flight){flight=Promise.all([decode314(row.tile314.image),...row.seals314.map(s=>decode314(s.image))]).then(([tile,...seals])=>({row,tile,seals})).catch(e=>{cache314.delete(row.id);throw e});cache314.set(row.id,flight)}return flight}
const ready314=new Map();
export async function loadPaper314(row){const p=await preparePaper314(row);if(p)ready314.set(row.id,p);return p}
export function paintPaper314(ctx,row,x,y,width,height,prepared=ready314.get(row?.id)){
 if(!prepared)return false;const layout=paperLayout314(row,width,height),sx=layout.tileWidth/prepared.tile.width,sy=layout.tileHeight/prepared.tile.height;
 ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.rect(0,0,width,height);ctx.clip();ctx.save();ctx.scale(sx,sy);ctx.fillStyle=ctx.createPattern(prepared.tile,'repeat');ctx.fillRect(0,0,width/sx,height/sy);ctx.restore();for(const [i,s]of layout.seals.entries())ctx.drawImage(prepared.seals[i],s.x,s.y,s.w,s.h);ctx.restore();return true;
}
if(typeof window!=='undefined')window.PaperTiles314={load:loadPaper314,paint:paintPaper314};
