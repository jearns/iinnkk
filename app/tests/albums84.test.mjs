import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const scope={};
for(const file of ['work-albums84.js','work-meta84.js'])vm.runInNewContext(readFileSync(file,'utf8'),scope);
const M=scope.WorkAlbumModel84,T=scope.WorkMeta84;
test('directories support moving old works, renaming and deleting without deleting artwork ids',()=>{
 let data=M.create({},'唐诗');data=M.create(data,'宋词');data=M.assign(data,['old-1','old-2'],'唐诗');data=M.assign(data,['old-1'],'宋词');
 assert.equal(M.membership(data,'old-1'),'宋词');assert.equal(M.membership(data,'old-2'),'唐诗');
 data=M.rename(data,'宋词','我的词集');assert.equal(M.membership(data,'old-1'),'我的词集');
 data=M.remove(data,'我的词集');assert.equal(M.membership(data,'old-1'),'');assert.equal(M.membership(data,'old-2'),'唐诗');
});
test('duplicate and reserved directory names cannot corrupt selection or storage',()=>{
 assert.throws(()=>M.create(M.create({},'诗'),'诗'));
 for(const name of ['@none','+','__proto__',' ','x'.repeat(37)])assert.throws(()=>M.create({},name));
});
test('homepage attribution keeps the author and work, removes date/time and uses the detected city',()=>{
 const title=T.format('墨客','2026.09.29 17:48 写苏轼《定风波》','2026-10-01','','','杭州');
 assert.equal(title,'墨客 写 苏轼 《定风波》于杭州');
 assert.equal(T.format('新名字',title,'2026-10-02','','','杭州'),'新名字 写 苏轼 《定风波》于杭州');
 assert.equal(T.owner(title),'墨客');
 assert.equal(T.format('墨客','亲笔真迹 · 2026.09.29 17:48','2026-09-29','','','杭州'),'墨客 写 《随手书写》于杭州');
});
