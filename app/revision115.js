(function init(){if(!window.MomentsCover114?.ready){setTimeout(init,40);return}
 const A=AnnotationApp,$=id=>document.getElementById(id),dock=$('copyDock111'),touches=new Map();let gesture=null,start=null;
 const center=()=>{const p=[...touches.values()];return{x:p.reduce((n,v)=>n+v.x,0)/p.length,y:p.reduce((n,v)=>n+v.y,0)/p.length,d:p.length>1?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0}};
 function change(id,value){$(id).value=String(value);A.refresh();A.persist()}
 dock.onpointerdown=e=>{e.preventDefault();e.stopPropagation();touches.set(e.pointerId,{x:e.clientX,y:e.clientY});dock.setPointerCapture(e.pointerId);gesture=center();start={x:e.clientX,y:e.clientY,touches:touches.size}};
 dock.onpointermove=e=>{if(!touches.has(e.pointerId))return;e.preventDefault();e.stopPropagation();touches.set(e.pointerId,{x:e.clientX,y:e.clientY});const next=center();if(gesture){if(next.d&&gesture.d){change('copyZoom115',Math.max(1,Math.min(12,+$('copyZoom115').value*next.d/gesture.d)));start.touches=2}else{const top=$('copyLayout111').value==='top',delta=top?next.x-gesture.x:next.y-gesture.y,span=top?dock.clientWidth:dock.clientHeight;change('copyPan115',Math.max(0,Math.min(100,+$('copyPan115').value-delta/Math.max(1,span)*100/Math.max(1,+$('copyZoom115').value))));}}gesture=next};
 dock.onpointerup=e=>{if(start&&start.touches===1&&$('copyLayout111').value==='left'&&Math.abs(e.clientX-start.x)>Math.max(35,Math.abs(e.clientY-start.y)*1.5))Revision111.moveColumn(e.clientX>start.x?1:-1);touches.delete(e.pointerId);gesture=touches.size?center():null;if(!touches.size)start=null;e.stopPropagation()};
 dock.onpointercancel=dock.onlostpointercapture=e=>{touches.delete(e.pointerId);gesture=touches.size?center():null;if(!touches.size)start=null};
 window.Revision115={ready:true};
})();
