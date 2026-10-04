/* Ink-only closed vector silhouettes. Paper, photos and stamps are deliberately excluded. */
(function(root){
 const n=v=>Number(v.toFixed(5)),esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 const multiply=(m,b)=>[m[0]*b[0]+m[2]*b[1],m[1]*b[0]+m[3]*b[1],m[0]*b[2]+m[2]*b[3],m[1]*b[2]+m[3]*b[3],m[0]*b[4]+m[2]*b[5]+m[4],m[1]*b[4]+m[3]*b[5]+m[5]];
 class Recorder{
  constructor(){this.vectorInk125=true;this.m=[1,0,0,1,0,0];this.stack=[];this.parts=[];this.path=[];this.globalAlpha=1;this.fillStyle='#000000';}
  save(){this.stack.push({m:[...this.m],alpha:this.globalAlpha,fill:this.fillStyle})}
  restore(){const s=this.stack.pop();this.m=s.m;this.globalAlpha=s.alpha;this.fillStyle=s.fill}
  translate(x,y){this.m=multiply(this.m,[1,0,0,1,x,y])}
  scale(x,y){this.m=multiply(this.m,[x,0,0,y,0,0])}
  rotate(a){this.m=multiply(this.m,[Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0])}
  beginPath(){this.path=[]}
  ellipse(x,y,rx,ry,a){const m=multiply(this.m,[Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),x,y]);this.path.push({d:`M ${n(rx)} 0 A ${n(rx)} ${n(ry)} 0 1 0 ${n(-rx)} 0 A ${n(rx)} ${n(ry)} 0 1 0 ${n(rx)} 0 Z`,m})}
  fill(){for(const p of this.path)this.parts.push(`<path d="${p.d}" transform="matrix(${p.m.map(n).join(' ')})" fill="${esc(this.fillStyle)}"/>`)}
  fillRect(x,y,w,h){this.parts.push(`<path d="M ${n(x)} ${n(y)} h ${n(w)} v ${n(h)} h ${n(-w)} Z" transform="matrix(${this.m.map(n).join(' ')})" fill="${esc(this.fillStyle)}"/>`)}
 }
 function validate(width,height){if(!(width>0&&height>0&&Number.isFinite(width)&&Number.isFinite(height)))throw Error('纸面尺寸无效')}
 function addStroke(t,st,monochrome){if(!st.points?.length)return;t.save();const g=st.geometry;if(g){t.translate(g.x*390,g.y*390);t.rotate(g.r||0);t.scale(g.k,g.k)}
  root.ParticleBrush.render({...st,done:true,settings:{...st.settings,color:monochrome?'#000000':st.settings.color}},t,390,390);t.restore()}
 function documentSVG(t,width,height){return `<svg xmlns="http://www.w3.org/2000/svg" width="${n(width*25)}mm" height="${n(height*25)}mm" viewBox="0 0 ${n(width*390)} ${n(height*390)}"><title>今日亲笔 · 矢量笔迹</title><desc>Closed ink silhouettes; vector grain approximates raster paper texture. Union overlapping paths before mesh extrusion. Mirror only for stamp printing.</desc>${t.parts.join('')}</svg>`}
 function exportInk(strokes,{width=4,height=4,monochrome=false}={}){validate(width,height);const t=new Recorder();for(const st of strokes)addStroke(t,st,monochrome);return documentSVG(t,width,height)}
 async function exportInkAsync(strokes,{width=4,height=4,monochrome=false}={}){validate(width,height);const t=new Recorder();for(let i=0;i<strokes.length;i++){addStroke(t,strokes[i],monochrome);if(i%20===19)await new Promise(resolve=>(root.requestAnimationFrame||setTimeout)(resolve,0))}return documentSVG(t,width,height)}
 root.InkVector125={exportInk,exportInkAsync,Recorder};
 if(!root.document)return;
 function init(){if(!root.AnnotationApp?.ready){setTimeout(init,60);return}const A=root.AnnotationApp,button=document.createElement('button');button.type='button';button.textContent='导出 SVG 矢量笔迹';button.title='透明底笔迹，不含照片、纸张和印章；Blender 挤出前需合并重叠轮廓';
  button.onclick=async()=>{button.disabled=true;try{A.finish();await new Promise(r=>setTimeout(r,0));const s=A.getState(),p=A.paperFrame107(),svg=await exportInkAsync([...(s.flow?.strokes||[]),...(s.signatureStrokes||[])],{width:p.w/p.scale,height:p.h/p.scale}),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),link=document.createElement('a');link.href=url;link.download='今日亲笔-矢量笔迹.svg';link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);A.toast('已导出 SVG：3D 挤出前需合并轮廓，印刷用时再镜像')}catch(e){A.toast('SVG 导出未完成：'+e.message)}finally{button.disabled=false}};
  (document.querySelector('#downloadDialog .dialogBody')||document.querySelector('#imageDialog .dialogBody'))?.append(button);
 }
 init();
})(typeof window==='undefined'?globalThis:window);
