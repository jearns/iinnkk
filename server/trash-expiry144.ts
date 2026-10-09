// Cron uses a Vault-held token; service-role credentials stay in Edge runtime environment.
// This template is deployed with the token supplied in memory, never checked into this repository.
import {createClient} from 'npm:@supabase/supabase-js@2.57.4';
const cronToken='__CRON_TOKEN144__';
Deno.serve(async req=>{
 if(req.method!=='POST'||req.headers.get('x-ink-cron')!==cronToken)return new Response('Unauthorized',{status:401});
 const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await db.rpc('ink_claim_expired_trash144');if(error)return Response.json({error:'claim failed'},{status:500});
 let removed=0,failed=0;
 for(const row of data||[]){try{
  for(const [bucket,path,field]of [['ink-works',row.image_path,'image_path'],['ink-drafts',row.draft_path,'draft_path']]){
   if(!path)continue;if(path.split('/')[0]!==row.owner)throw Error('path');
   const linked=await db.from('ink_works').select('id').eq(field,path).neq('id',row.id).limit(1);if(linked.error)throw linked.error;if(linked.data?.length)continue;
   const deleted=await db.storage.from(bucket).remove([path]);if(deleted.error)throw deleted.error;
  }
  const result=await db.from('ink_works').delete().eq('id',row.id).eq('purging144',true).lte('deleted_at144',new Date(Date.now()-86400000).toISOString());if(result.error)throw result.error;removed++;
 }catch{failed++}}
 return Response.json({removed,failed}, {status:failed?503:200});
});
