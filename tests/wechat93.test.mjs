import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
async function load(name,env,fetch){const source=await readFile(new URL('../supabase/functions/'+name+'/index.ts',import.meta.url),'utf8'),compiled=await transform(source,{loader:'ts',format:'cjs',target:'es2022'}),context={exports:{},module:{exports:{}},Deno:{env:{get:k=>env[k]},serve:()=>{}},crypto:webcrypto,Request,Response,URL,URLSearchParams,TextEncoder,TextDecoder,Uint8Array,Date,JSON,btoa,atob,fetch};context.module.exports=context.exports;vm.runInNewContext(compiled.code,context);return context.module.exports.handler}
test('WeChat OAuth validates callback/client and protects userinfo token',async()=>{
 const env={WECHAT_APP_ID:'wx93',WECHAT_APP_SECRET:'private-secret',BRIDGE_CLIENT_SECRET:'c'.repeat(32),BRIDGE_TOKEN_KEY:'k'.repeat(32),SUPABASE_AUTH_CALLBACK:'https://auth.example/auth/v1/callback'};
 const handler=await load('wechat-oauth',env,async u=>Response.json(String(u).includes('/access_token')?{access_token:'private-access',openid:'openid93',expires_in:7200}:{openid:'openid93',unionid:'union93',nickname:'书家'}));
 const authorize=new URL('https://edge.example/authorize');authorize.search=new URLSearchParams({client_id:'wx93',redirect_uri:env.SUPABASE_AUTH_CALLBACK,response_type:'code',state:'protected-state'});
 const redirect=await handler(new Request(authorize));assert.equal(redirect.status,302);assert.equal(new URL(redirect.headers.get('location')).searchParams.get('state'),'protected-state');
 authorize.searchParams.set('redirect_uri','https://attacker.example');assert.equal((await handler(new Request(authorize))).status,400);
 const token=secret=>handler(new Request('https://edge.example/token',{method:'POST',body:new URLSearchParams({client_id:'wx93',client_secret:secret,redirect_uri:env.SUPABASE_AUTH_CALLBACK,grant_type:'authorization_code',code:'valid-code'})}));
 assert.equal((await token('incorrect')).status,401);const data=await(await token(env.BRIDGE_CLIENT_SECRET)).json();assert(!data.access_token.includes('private-access'));
 const info=await handler(new Request('https://edge.example/userinfo',{headers:{Authorization:'Bearer '+data.access_token}}));assert.equal((await info.json()).sub,'union93');
 assert.equal((await handler(new Request('https://edge.example/userinfo',{headers:{Authorization:'Bearer fake.token'}}))).status,401);
});
test('WeChat share signing rejects foreign origins/URLs and keeps credentials private',async()=>{
 const env={SITE_ORIGINS:'https://site.example',WECHAT_MP_APP_ID:'mp93',WECHAT_MP_APP_SECRET:'private-secret'};let calls=0;
 const handler=await load('wechat-share',env,async u=>{calls++;return Response.json(String(u).includes('getticket')?{ticket:'private-ticket',expires_in:7200}:{access_token:'private-access',expires_in:7200})});
 const request=(origin,url)=>new Request('https://edge.example/wechat-share',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({url})});
 assert.equal((await handler(request('https://attacker.example','https://site.example/'))).status,403);assert.equal((await handler(request('https://site.example','https://attacker.example/'))).status,403);assert.equal((await handler(request('https://site.example','https://site.example/#hash'))).status,403);assert.equal(calls,0);
 const response=await handler(request('https://site.example','https://site.example/?work=93'));const data=await response.json();assert.equal(response.status,200);assert.match(data.signature,/^[a-f0-9]{40}$/);assert.equal(data.appId,'mp93');assert(!JSON.stringify(data).includes('private-'));await handler(request('https://site.example','https://site.example/'));assert.equal(calls,2);
});
