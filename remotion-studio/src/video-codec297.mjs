import{canEncodeAudio}from'mediabunny';
export * from'mediabunny';
let registered=false;
export async function ensureAudio297(){if(!registered&&!await canEncodeAudio('aac')){const{registerAacEncoder}=await import('@mediabunny/aac-encoder');registerAacEncoder();registered=true}}
