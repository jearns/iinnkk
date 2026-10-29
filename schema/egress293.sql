-- Applied 2026-10-29. Keep existing Vault expressions and credentials inside the database.
-- Visibility/restoration still expires at 24 hours. Physical cleanup runs daily only if needed.
do $guard293$
declare j record; guarded text;
begin
 select jobid,command into j from cron.job where jobname='ink-trash-expiry144';
 if j.jobid is null then raise exception 'cleanup job missing'; end if;
 if j.command not like '%guard293%' then
  if j.command !~* '^\s*select\s+net.http_post\s*\(' then raise exception 'unexpected cleanup command'; end if;
  guarded:=rtrim(trim(j.command),';')||' WHERE EXISTS (SELECT 1 FROM public.ink_works WHERE deleted_at144 <= now()-interval ''24 hours'') /* guard293 */;';
  perform cron.alter_job(job_id:=j.jobid,schedule:='17 3 * * *',command:=guarded);
 end if;
end $guard293$;
