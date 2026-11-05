import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Miniflare} from 'miniflare';
import {readFileSync,readdirSync} from 'node:fs';

test('retired password endpoints cannot authenticate or create a legacy account',async()=>{
 const mf=new Miniflare({modules:true,scriptPath:'dist/server/index.js',compatibilityDate:'2026-08-06',d1Databases:['DB'],r2Buckets:['BUCKET']});
 try{
  const db=await mf.getD1Database('DB');
  for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())
   for(const stmt of readFileSync('drizzle/'+f,'utf8').split('--> statement-breakpoint').filter(s=>s.trim()))await db.prepare(stmt).run();
  const request=async(path,{origin='https://ink.test',cookie='',method='GET',body=null}={})=>{
   const response=await mf.dispatchFetch('https://ink.test'+path,{method,headers:{origin,cookie,'content-type':'application/json'},body:body?JSON.stringify(body):undefined});
   const text=await response.text();let data;try{data=JSON.parse(text)}catch{data=text}
   return {status:response.status,data,cookie:response.headers.get('set-cookie')};
  };
  const credentials={username:'artist',password:'a long handwritten password'};
  const session=await request('/api/session');
  assert.equal(session.status,200);assert.equal(session.data.user,null);assert.equal(session.data.passwordLogin,undefined);
  for(const path of ['/api/auth/register','/api/auth/login']){
   const response=await request(path,{method:'POST',body:credentials});
   assert.equal(response.status,404);assert.equal(response.cookie,null);
  }
  assert.equal((await request('/api/session',{cookie:'ink_session=forged'})).data.user,null);
  assert.equal((await request('/api/works',{method:'POST',body:{title:'不应保存'}})).status,401);
  assert.equal((await request('/api/auth/register',{origin:'https://evil.test',method:'POST',body:credentials})).status,403);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM users').first()).n,0);
 }finally{await mf.dispose()}
});
