/* Standards adapter: Supabase custom OAuth -> WeChat website OAuth.
 * Never expose WECHAT_APP_SECRET or BRIDGE_CLIENT_SECRET in browser configuration. */
const env=(key:string)=>Deno.env.get(key)||'';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const fail=(error:string,status=400)=>json({error},status);
async function key(){const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(env('BRIDGE_TOKEN_KEY')));return crypto.subtle.importKey('raw',digest,{name:'AES-GCM'},false,['encrypt','decrypt'])}
function b64(bytes:Uint8Array){return btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replaceAll('=','')}
function unb64(text:string){return Uint8Array.from(atob(text.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0))}
async function seal(data:unknown){const iv=crypto.getRandomValues(new Uint8Array(12)),body=await crypto.subtle.encrypt({name:'AES-GCM',iv},await key(),new TextEncoder().encode(JSON.stringify(data)));return b64(iv)+'.'+b64(new Uint8Array(body))}
async function equal(a:string,b:string){if(!a||!b)return false;const digest=async(s:string)=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));const [x,y]=await Promise.all([digest(a),digest(b)]);let diff=0;for(let i=0;i<x.length;i++)diff|=x[i]^y[i];return diff===0}
export async function handler(request:Request){try{
 if(!env('WECHAT_APP_ID')||!env('WECHAT_APP_SECRET')||env('BRIDGE_CLIENT_SECRET').length<32||env('BRIDGE_TOKEN_KEY').length<32||!env('SUPABASE_AUTH_CALLBACK'))return fail('provider_not_configured',503);
 const u=new URL(request.url),action=u.pathname.split('/').at(-1),callback=env('SUPABASE_AUTH_CALLBACK');
 if(action==='authorize'&&request.method==='GET'){
  if(u.searchParams.get('client_id')!==env('WECHAT_APP_ID')||u.searchParams.get('redirect_uri')!==callback||u.searchParams.get('response_type')!=='code'||!u.searchParams.get('state'))return fail('invalid_request');
  const target=new URL('https://open.weixin.qq.com/connect/qrconnect');target.search=new URLSearchParams({appid:env('WECHAT_APP_ID'),redirect_uri:callback,response_type:'code',scope:'snsapi_login',state:u.searchParams.get('state')!}).toString();target.hash='wechat_redirect';return Response.redirect(target.href,302);
 }
 if(action==='token'&&request.method==='POST'){
  const p=new URLSearchParams(await request.text());let client=p.get('client_id')||'',secret=p.get('client_secret')||'';const auth=request.headers.get('Authorization')||'';if(auth.startsWith('Basic ')){const decoded=atob(auth.slice(6)),colon=decoded.indexOf(':');client=decodeURIComponent(decoded.slice(0,colon));secret=decodeURIComponent(decoded.slice(colon+1))}
  if(client!==env('WECHAT_APP_ID')||!await equal(secret,env('BRIDGE_CLIENT_SECRET')))return fail('invalid_client',401);
  if(p.get('grant_type')!=='authorization_code'||!p.get('code')||p.get('redirect_uri')!==callback)return fail('invalid_grant');
  const target=new URL('https://api.weixin.qq.com/sns/oauth2/access_token');target.search=new URLSearchParams({appid:env('WECHAT_APP_ID'),secret:env('WECHAT_APP_SECRET'),code:p.get('code')!,grant_type:'authorization_code'}).toString();const r=await fetch(target),wx=await r.json();if(!r.ok||wx.errcode||!wx.access_token||!wx.openid)return fail('invalid_grant');
  const lifetime=Math.min(Number(wx.expires_in)||7200,3600),token=await seal({access:wx.access_token,openid:wx.openid,exp:Math.floor(Date.now()/1000)+lifetime});return json({access_token:token,token_type:'Bearer',expires_in:lifetime,scope:'profile'});
 }
 if(action==='userinfo'&&request.method==='GET'){
  const token=(request.headers.get('Authorization')||'').replace(/^Bearer /i,'');const [iv,encrypted]=token.split('.');if(!iv||!encrypted||token.length>8000)return fail('invalid_token',401);let data;try{data=JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(iv)},await key(),unb64(encrypted))))}catch{return fail('invalid_token',401)}if(data.exp<Math.floor(Date.now()/1000))return fail('invalid_token',401);
  const target=new URL('https://api.weixin.qq.com/sns/userinfo');target.search=new URLSearchParams({access_token:data.access,openid:data.openid,lang:'zh_CN'}).toString();const r=await fetch(target),wx=await r.json();if(!r.ok||wx.errcode||wx.openid!==data.openid)return fail('invalid_token',401);
  return json({id:wx.unionid||wx.openid,sub:wx.unionid||wx.openid,name:wx.nickname||'亲笔书家',full_name:wx.nickname||'亲笔书家',avatar_url:wx.headimgurl||'',email_verified:false});
 }
 return fail('not_found',404);
 }catch{return fail('provider_error',502)}}
Deno.serve(handler);
