create table if not exists public.ink_monitor207 (
 id bigint generated always as identity primary key,
 created_at timestamptz not null default now(),
 session uuid not null, release text not null default '207',
 page text not null check(page in ('home','writer','works','hall')),
 kind text not null check(kind in ('visit','network','resource','longtask','interaction','error','startup','action')),
 action varchar(64) not null check(action ~ '^[a-zA-Z0-9_.-]{1,64}$'),
 duration_ms integer not null check(duration_ms between 0 and 120000),
 status integer not null check(status between 0 and 599)
);
create index if not exists ink_monitor207_time on public.ink_monitor207(created_at desc);
create index if not exists ink_monitor207_session on public.ink_monitor207(session,created_at desc);
alter table public.ink_monitor207 enable row level security;
revoke all on public.ink_monitor207 from anon, authenticated;
grant select on public.ink_monitor207 to authenticated;
create policy monitor207_admin_read on public.ink_monitor207 for select to authenticated using ((select public.ink_admin55()));
create schema if not exists ink_diagnostics207;
revoke all on schema ink_diagnostics207 from public,anon,authenticated;
create or replace function ink_diagnostics207.ingest(p_session uuid,p_events jsonb) returns integer language plpgsql security definer set search_path='' as $$
declare item jsonb; amount integer:=0;
begin
 if p_session is null or jsonb_typeof(p_events)<>'array' or jsonb_array_length(p_events)>20 then return 0; end if;
 perform pg_advisory_xact_lock(207207);
 if (select count(*) from public.ink_monitor207 where created_at>now()-interval '1 hour')>=10000 then return 0; end if;
 if (select count(*) from public.ink_monitor207 where session=p_session and created_at>now()-interval '1 minute')>=40 then return 0; end if;
 delete from public.ink_monitor207 where id in (select id from public.ink_monitor207 where created_at<now()-interval '30 days' limit 500);
 for item in select value from jsonb_array_elements(p_events) loop
  if item->>'kind' not in ('visit','network','resource','longtask','interaction','error','startup','action') or item->>'page' not in ('home','writer','works','hall') or coalesce(item->>'action','') !~ '^[a-zA-Z0-9_.-]{1,64}$' or coalesce(item->>'duration','') !~ '^[0-9]{1,6}$' or coalesce(item->>'status','') !~ '^[0-9]{1,3}$' then continue; end if;
  insert into public.ink_monitor207(session,page,kind,action,duration_ms,status) values(p_session,item->>'page',item->>'kind',item->>'action',least(120000,(item->>'duration')::integer),least(599,(item->>'status')::integer));amount:=amount+1;
 end loop;
 return amount;
end $$;
revoke all on function ink_diagnostics207.ingest(uuid,jsonb) from public;
grant usage on schema ink_diagnostics207 to anon,authenticated;
grant execute on function ink_diagnostics207.ingest(uuid,jsonb) to anon,authenticated;
create or replace function public.ink_monitor_ingest207(p_session uuid,p_events jsonb) returns integer language sql security invoker set search_path='' as $$ select ink_diagnostics207.ingest(p_session,p_events) $$;
revoke all on function public.ink_monitor_ingest207(uuid,jsonb) from public;
grant execute on function public.ink_monitor_ingest207(uuid,jsonb) to anon,authenticated;
