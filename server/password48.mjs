// Username/password authentication shares the existing account, ownership and session model.
const ITERATIONS=600000;
const json=(data,status=200,headers={})=>Response.json(data,{status,headers:{'cache-control':'no-store',...headers}});
const hex=bytes=>Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
const unhex=s=>Uint8Array.from(s.match(/../g),x=>parseInt(x,16));
async function derive(password,salt){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
 return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:unhex(salt),iterations:ITERATIONS},key,256)));
}
function equal(a,b){let mismatch=a.length^b.length;for(let i=0;i<a.length;i++)mismatch|=a.charCodeAt(i)^(b.charCodeAt(i)||0);return mismatch===0}
async function limited(env,key,limit,now){
 const row=await env.DB.prepare('INSERT INTO auth_limits(key,attempts,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN expires<=? THEN 1 ELSE attempts+1 END,expires=CASE WHEN expires<=? THEN excluded.expires ELSE expires END RETURNING attempts').bind(key,now+900000,now,now).first();
 return row.attempts>limit;
}
export async function passwordAuth(request,env,path,{hash,uid}){
 if(request.method!=='POST')return json({error:'请使用 POST 提交'},405);
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'请从本站提交'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'请提交 JSON 格式'},415);
 if(Number(request.headers.get('content-length')||0)>4096)return json({error:'内容太长'},413);
 const raw=await request.text();if(new TextEncoder().encode(raw).length>4096)return json({error:'内容太长'},413);
 let data;try{data=JSON.parse(raw)}catch{return json({error:'内容格式不正确'},400)}
 const username=String(data?.username||'').trim().toLowerCase(),password=data?.password;
 if(!/^[a-z0-9][a-z0-9_.-]{2,31}$/.test(username))return json({error:'用户名请用 3—32 位字母、数字、点、横线或下划线'},400);
 if(typeof password!=='string'||password.length<15||password.length>128)return json({error:'密码请用 15—128 个字符，可使用长句'},400);
 const now=Date.now(),ip=request.headers.get('cf-connecting-ip')||'unknown';
 const limits=await Promise.all([limited(env,'ip:'+await hash(ip),40,now),limited(env,'name:'+await hash(username),10,now)]);
 if(limits.some(Boolean))return json({error:'尝试次数较多，请 15 分钟后再试'},429,{'retry-after':'900'});
 await env.DB.prepare('DELETE FROM auth_limits WHERE expires<?').bind(now-900000).run();
 const credential=await env.DB.prepare('SELECT * FROM password_accounts WHERE username=?').bind(username).first();
 let userId;
 if(path==='/api/auth/register'){
  if(credential)return json({error:'此用户名已注册，请登录或换一个用户名'},409);
  const salt=hex(crypto.getRandomValues(new Uint8Array(16))),digest=await derive(password,salt),id=uid();
  const name=String(data.name||username).trim().slice(0,50)||username;
  try{await env.DB.batch([
   env.DB.prepare('INSERT INTO users(id,identity,name,role,created) VALUES (?,?,?,?,?)').bind(id,'password:'+username,name,'member',now),
   env.DB.prepare('INSERT INTO password_accounts(username,user_id,salt,digest) VALUES (?,?,?,?)').bind(username,id,salt,digest),
   env.DB.prepare("INSERT OR IGNORE INTO site_state(key,value) VALUES ('founder',?)").bind(id),
   env.DB.prepare("UPDATE users SET role='founder' WHERE id=(SELECT value FROM site_state WHERE key='founder')")
  ])}catch(e){if(await env.DB.prepare('SELECT username FROM password_accounts WHERE username=?').bind(username).first())return json({error:'此用户名已注册，请登录'},409);throw e}
  userId=id;
 }else{
  // Do the same password work for unknown users; return one generic failure message.
  const digest=await derive(password,credential?.salt||'00000000000000000000000000000000');
  if(!credential||!equal(digest,credential.digest))return json({error:'用户名或密码不正确'},401);
  userId=credential.user_id;
 }
 const token=uid()+uid();
 await env.DB.batch([
  env.DB.prepare('INSERT INTO sessions(id,user_id,expires) VALUES (?,?,?)').bind(await hash(token),userId,now+30*86400000),
  env.DB.prepare('DELETE FROM sessions WHERE expires<?').bind(now)
 ]);
 return json({ok:true},200,{'set-cookie':`ink_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`});
}
