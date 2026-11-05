/* Shared album data: removing a directory never removes its artworks. */
(function(root){
 const valid=name=>typeof name==='string'&&name.trim().length>0&&name.trim().length<=36&&!['__proto__','constructor','prototype','@none','+'].includes(name.trim());
 function normalize(value){const out=Object.create(null);if(!value||typeof value!=='object'||Array.isArray(value))return out;for(const [name,ids] of Object.entries(value).slice(0,100)){if(valid(name)&&Array.isArray(ids))out[name.trim()]=[...new Set(ids.filter(id=>typeof id==='string'&&id.length<200))]}return out}
 function label(name){name=String(name||'').trim();if(!valid(name))throw Error('专辑名称须为 1—36 个字');return name}
 function create(data,name){const out=normalize(data);name=label(name);if(Object.hasOwn(out,name))throw Error('已有同名专辑');if(Object.keys(out).length>=100)throw Error('最多创建 100 个专辑');out[name]=[];return out}
 function rename(data,oldName,newName){const out=normalize(data);newName=label(newName);if(!Object.hasOwn(out,oldName))throw Error('专辑不存在');if(oldName===newName)return out;if(Object.hasOwn(out,newName))throw Error('已有同名专辑');out[newName]=out[oldName];delete out[oldName];return out}
 function remove(data,name){const out=normalize(data);delete out[name];return out}
 function assign(data,ids,name){const out=normalize(data),selected=new Set(ids);if(name&&!Object.hasOwn(out,name))throw Error('请先创建专辑');for(const key of Object.keys(out))out[key]=out[key].filter(id=>!selected.has(id));if(name)out[name].push(...selected);return out}
 function membership(data,id){return Object.keys(data).find(name=>data[name].includes(id))||''}
 function merge(local,remote){const out=normalize(local);for(const [name,ids] of Object.entries(normalize(remote)))out[name]=[...new Set([...(out[name]||[]),...ids])];return out}
 root.WorkAlbumModel84={normalize,create,rename,remove,assign,membership,merge};
})(typeof window==='undefined'?globalThis:window);
