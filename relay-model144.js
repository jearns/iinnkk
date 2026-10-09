/* Relay annotations are additive, identity-based records; each writer edits their own additions. */
(function(root){
 function annotationOps(base,draft,writer,seed,uuid=()=>crypto.randomUUID()){
  const payload=[],next={};for(const [field,kind] of [['signatureStrokes','signature144'],['extraSeals','seal144']]){
   const old=new Map((base[field]||[]).map(x=>[x.id144,x]));next[field]=(draft[field]||[]).map((x,i)=>({...x,id144:x.id144||old.get(seed+':'+kind+':'+i)?.id144||uuid(),writer144:x.writer144||writer}));
   for(const x of next[field])if(x.writer144===writer&&JSON.stringify(old.get(x.id144))!==JSON.stringify(x))payload.push({kind,id:x.id144,value:x});
   const ids=new Set(next[field].map(x=>x.id144));for(const x of old.values())if(x.writer144===writer&&!ids.has(x.id144))payload.push({kind,id:x.id144,remove:true});
  }return {payload,next};
 }
 function seedDraft(draft,seed,writer){return {...draft,...Object.fromEntries([['signatureStrokes','signature144'],['extraSeals','seal144']].map(([field,kind])=>[field,(draft[field]||[]).map((x,i)=>({...x,id144:x.id144||seed+':'+kind+':'+i,writer144:x.writer144||writer}))]))}}
 function mergeAnnotations(draft,rows){const maps={signature144:new Map((draft.signatureStrokes||[]).map(x=>[x.id144,x])),seal144:new Map((draft.extraSeals||[]).map(x=>[x.id144,x]))};for(const row of rows)for(const op of row.payload||[]){const map=maps[op.kind];if(!map||!op.id)continue;const previous=map.get(op.id);if(previous&&previous.writer144!==row.writer)continue;if(op.remove)map.delete(op.id);else if(op.value?.writer144===row.writer)map.set(op.id,op.value)}return {signatureStrokes:[...maps.signature144.values()],extraSeals:[...maps.seal144.values()]}}
 root.RelayModel144={annotationOps,seedDraft,mergeAnnotations};
})(typeof window==='undefined'?globalThis:window);
