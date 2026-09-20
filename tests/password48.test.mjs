import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Miniflare} from 'miniflare';
import {readFileSync,readdirSync} from 'node:fs';
test('password registration, login, session, account isolation and signed-in workflows',async()=>{
 const mf=new Miniflare({modules:true,scriptPath:'dist/server/index.js',compatibilityDate:'2026-08-06',d1Databases:['DB'],r2Buckets:['BUCKET']});
 try{
 const db=await mf.getD1Database('DB');
 for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())for(const stmt of readFileSync('drizzle/'+f,'utf8').split('--> statement-breakpoint').filter(s=>s.trim()))await db.prepare(stmt).run();
 const call=async(path,{method='GET',body,cookie,origin='https://ink.test'}={})=>{
 const headers={origin,'content-type':'application/json','cf-connecting-ip':'192.0.2.10'};if(cookie)headers.cookie=cookie;
 const r=await mf.dispatchFetch('https://ink.test'+path,{method,headers,body:body?JSON.stringify(body):undefined});return{status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')};};
 const post=(path,body,cookie)=>call(path,{method:'POST',body,cookie});
 assert.equal((await call('/api/session')).data.passwordLogin,true);
 assert.equal((await post('/api/auth/register',{username:'artist',password:'short'})).status,400);
 assert.equal((await call('/api/auth/register',{method:'POST',origin:'https://evil.test',body:{username:'artist',password:'a long handwritten password'}})).status,403);
 const creds={username:'Artist',password:'a long handwritten password',name:'墨客'};
 const reg=await post('/api/auth/register',creds);assert.equal(reg.status,200);assert.match(reg.cookie,/HttpOnly; Secure; SameSite=Lax/);const a=reg.cookie.split(';')[0];
 const me=(await call('/api/session',{cookie:a})).data.user;assert.equal(me.name,'墨客');assert.equal(me.role,'founder');
 assert.equal((await post('/api/auth/register',creds)).status,409);
 const row=await db.prepare('SELECT * FROM password_accounts WHERE username=?').bind('artist').first();assert.notEqual(row.digest,creds.password);assert.equal(row.digest.length,64);
 assert.equal((await post('/api/auth/login',{username:'artist',password:'a different long password'})).status,401);
 const login=await post('/api/auth/login',creds);assert.equal(login.status,200);const session=login.cookie.split(';')[0];assert.equal((await call('/api/session',{cookie:session})).data.user.id,me.id);
 const other=await post('/api/auth/register',{username:'reader',password:'another handwritten password'});assert.equal(other.status,200);const b=other.cookie.split(';')[0];assert.equal((await call('/api/session',{cookie:b})).data.user.role,'member');assert.equal((await call('/api/admin/users',{cookie:b})).status,403);
 const settings={settings:{values:{ratio:'.75'}}};assert.equal((await call('/api/settings',{method:'PUT',body:settings,cookie:session})).status,200);assert.deepEqual((await call('/api/settings',{cookie:session})).data,settings);
 const w=(await post('/api/works',{title:'亲笔测试'},session)).data;assert.ok(w.id);assert.equal((await call('/api/works/'+w.id,{cookie:b})).status,404);
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=','base64');
 assert.equal((await mf.dispatchFetch('https://ink.test/api/works/'+w.id+'/image',{method:'PUT',headers:{origin:'https://ink.test',cookie:session},body:png})).status,200);
 assert.equal((await call('/api/works/'+w.id+'/draft',{method:'PUT',cookie:session,body:{flow:{strokes:[]}}})).status,200);
 assert.equal((await call('/api/works/'+w.id,{method:'PATCH',cookie:session,body:{visibility:'public'}})).status,200);
 assert.equal((await post('/api/works/'+w.id+'/like',{liked:true},b)).status,200);
 assert.equal((await post('/api/works/'+w.id+'/comments',{body:'见墨如我'},b)).status,200);
 const publicWork=(await call('/api/works/'+w.id)).data;assert.equal(publicWork.likes,1);assert.equal(publicWork.comments.length,1);
 await post('/api/auth/logout',{},session);assert.equal((await call('/api/session',{cookie:session})).data.user,null);
 await db.prepare('UPDATE auth_limits SET attempts=100').run();assert.equal((await post('/api/auth/login',creds)).status,429);
 }finally{await mf.dispose()}
});
