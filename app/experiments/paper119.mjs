// Data-only prototype. Nothing imports this into the writing page.
export function expandPaper(draft,edge,amount){
 if(!['left','right','top','bottom'].includes(edge)||!Number.isFinite(amount)||amount<=0)throw Error('无效的拓纸方向或长度');
 const oldWidth=draft.values?.paperExtent==='infinite'?draft.infiniteExtent?.w:4;
 const oldHeight=draft.values?.paperExtent==='infinite'?draft.infiniteExtent?.h:4/Number(draft.values?.ratio||.75);
 if(!Number.isFinite(oldWidth)||!Number.isFinite(oldHeight)||oldWidth<=0||oldHeight<=0)throw Error('纸张尺寸无效');
 const dx=edge==='left'?amount:0,dy=edge==='top'?amount:0;
 const width=oldWidth+(edge==='left'||edge==='right'?amount:0);
 const height=oldHeight+(edge==='top'||edge==='bottom'?amount:0);
 const move=st=>dx||dy?{...st,geometry:{x:dx+(st.geometry?.x||0),y:dy+(st.geometry?.y||0),k:st.geometry?.k??1,r:st.geometry?.r||0}}:st;
 const seals=Object.fromEntries(Object.entries(draft.sealPositions||{}).map(([key,p])=>[key,{...p,x:(p.x*oldWidth+dx)/width,y:(p.y*oldHeight+dy)/height}]));
 const extras=(draft.extraSeals||[]).map(p=>({...p,x:(p.x*oldWidth+dx)/width,y:(p.y*oldHeight+dy)/height}));
 const photos=(draft.photos||[]).map(p=>p.frame?{...p,frame:{...p.frame,x:p.frame.x+dx,y:p.frame.y+dy}}:p);
 return {...draft,values:{...draft.values,paperExtent:'infinite'},infiniteExtent:{w:width,h:height},flow:{...draft.flow,strokes:(draft.flow?.strokes||[]).map(move)},signatureStrokes:(draft.signatureStrokes||[]).map(move),sealPositions:seals,extraSeals:extras,photos,camera:draft.camera?{...draft.camera,x:draft.camera.x+dx,y:draft.camera.y+dy}:draft.camera,
  writingView110:draft.writingView110?{...draft.writingView110,camera:{...draft.writingView110.camera,x:(draft.writingView110.camera?.x||0)+dx,y:(draft.writingView110.camera?.y||0)+dy}}:undefined};
}
