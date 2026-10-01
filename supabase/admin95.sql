-- v95. Run as project owner after schema/community55/roles76/profiles83.
-- Transactional and repeatable. Never exposes auth.users or credentials to the browser.
begin;
create table if not exists public.ink_user_state95 (
 owner uuid primary key references auth.users(id) on delete cascade,
 disabled boolean not null default false, updated_at timestamptz not null default now()
);
create table if not exists public.ink_admin_events95 (
 id bigint generated always as identity primary key,
 kind text not null, owner uuid references auth.users(id) on delete set null,
 label text not null, created_at timestamptz not null default now()
);
create table if not exists public.ink_admin_reads95 (
 owner uuid primary key references auth.users(id) on delete cascade,
 last_id bigint not null default 0
);
alter table public.ink_user_state95 enable row level security;
alter table public.ink_admin_events95 enable row level security;
alter table public.ink_admin_reads95 enable row level security;
drop policy if exists state_admin95 on public.ink_user_state95;
create policy state_admin95 on public.ink_user_state95 for select to authenticated using(public.ink_admin55());
drop policy if exists events_admin95 on public.ink_admin_events95;
create policy events_admin95 on public.ink_admin_events95 for select to authenticated using(public.ink_admin55());
drop policy if exists reads_admin95 on public.ink_admin_reads95;
create policy reads_admin95 on public.ink_admin_reads95 for select to authenticated using(owner=auth.uid() and public.ink_admin55());
revoke all on public.ink_user_state95,public.ink_admin_events95,public.ink_admin_reads95 from anon,authenticated;
grant select on public.ink_user_state95,public.ink_admin_events95,public.ink_admin_reads95 to authenticated;

create or replace function public.ink_claim_membership76()
returns text language plpgsql security definer set search_path='' as $$
declare member_role text;
begin
 if auth.uid() is null then raise exception '请先登录'; end if;
 insert into public.ink_members(owner,role) values(auth.uid(),'书家') on conflict(owner) do nothing;
 select role into member_role from public.ink_members where owner=auth.uid();
 return member_role;
end $$;

create or replace function public.ink_signup_event95()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.ink_admin_events95(kind,owner,label)
 values('signup',new.id,coalesce(nullif(new.email,''),'第三方账号') || ' · 新用户注册');
 return new;
end $$;
revoke all on function public.ink_signup_event95() from public,anon,authenticated;
drop trigger if exists ink_signup95 on auth.users;
create trigger ink_signup95 after insert on auth.users for each row execute function public.ink_signup_event95();

create or replace function public.ink_admin_users95(p_query text default '',p_offset integer default 0)
returns table(owner uuid,email text,display_name text,gender text,role text,disabled boolean,created_at timestamptz,confirmed_at timestamptz,last_sign_in_at timestamptz,work_count bigint)
language plpgsql security definer set search_path='' as $$
begin
 if not public.ink_admin55() then raise exception '仅超级管理员可管理用户'; end if;
 return query select u.id,u.email::text,coalesce(p.display_name,u.raw_user_meta_data->>'full_name','待完善'),
 coalesce(u.raw_user_meta_data->>'gender95',''),coalesce(m.role,'书家'),coalesce(s.disabled,false),u.created_at,u.email_confirmed_at,u.last_sign_in_at,
 (select count(*) from public.ink_works w where w.owner=u.id)
 from auth.users u left join public.ink_profiles83 p on p.owner=u.id
 left join public.ink_members m on m.owner=u.id left join public.ink_user_state95 s on s.owner=u.id
 where coalesce(u.email,'') ilike '%'||left(p_query,100)||'%' or coalesce(p.display_name,u.raw_user_meta_data->>'full_name','') ilike '%'||left(p_query,100)||'%'
 order by u.created_at desc limit 50 offset greatest(0,p_offset);
end $$;

create or replace function public.ink_admin_member95(p_owner uuid,p_role text,p_disabled boolean)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.ink_admin55() then raise exception '仅超级管理员可管理用户'; end if;
 if p_role not in ('书家','书圣','书仙') or p_role is null or p_disabled is null then raise exception '参数无效'; end if;
 if p_owner=auth.uid() and (p_role<>'书仙' or p_disabled) then raise exception '不能停用或降级当前管理员'; end if;
 perform pg_advisory_xact_lock(2026100195);
 if not exists(select 1 from auth.users where id=p_owner) then raise exception '用户不存在'; end if;
 insert into public.ink_members(owner,role) values(p_owner,p_role) on conflict(owner) do update set role=excluded.role;
 insert into public.ink_user_state95(owner,disabled) values(p_owner,p_disabled) on conflict(owner) do update set disabled=excluded.disabled,updated_at=now();
 insert into public.ink_admin_events95(kind,owner,label) values('management',p_owner,'角色：'||p_role||case when p_disabled then ' · 暂停发布与评论' else ' · 正常使用' end);
end $$;

create or replace function public.ink_admin_ack95(p_last_id bigint)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.ink_admin55() then raise exception '仅超级管理员可读取通知'; end if;
 insert into public.ink_admin_reads95(owner,last_id) values(auth.uid(),least(greatest(0,p_last_id),coalesce((select max(id) from public.ink_admin_events95),0)))
 on conflict(owner) do update set last_id=greatest(public.ink_admin_reads95.last_id,excluded.last_id);
end $$;

create or replace function public.ink_can_write95()
returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and (public.ink_admin55() or not exists(select 1 from public.ink_user_state95 where owner=auth.uid() and disabled))
$$;
-- Restrictive policies supplement existing owner policies; a client cannot bypass suspension.
do $$ declare t text;op text;begin
 foreach t in array array['ink_works','ink_comments','ink_likes'] loop
  foreach op in array array['insert','update','delete'] loop
   execute format('drop policy if exists %I on public.%I','active95_'||op,t);
   if op='insert' then execute format('create policy %I on public.%I as restrictive for insert to authenticated with check(public.ink_can_write95())','active95_'||op,t);
   elsif op='update' then execute format('create policy %I on public.%I as restrictive for update to authenticated using(public.ink_can_write95()) with check(public.ink_can_write95())','active95_'||op,t);
   else execute format('create policy %I on public.%I as restrictive for delete to authenticated using(public.ink_can_write95())','active95_'||op,t); end if;
  end loop;
 end loop;
end $$;
revoke all on function public.ink_admin_users95(text,integer),public.ink_admin_member95(uuid,text,boolean),public.ink_admin_ack95(bigint),public.ink_can_write95(),public.ink_claim_membership76() from public,anon;
grant execute on function public.ink_admin_users95(text,integer),public.ink_admin_member95(uuid,text,boolean),public.ink_admin_ack95(bigint),public.ink_can_write95(),public.ink_claim_membership76() to authenticated;
do $$ begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') and not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='ink_admin_events95') then
  alter publication supabase_realtime add table public.ink_admin_events95;
 end if;
end $$;
commit;
