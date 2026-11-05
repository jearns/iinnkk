-- Run after schema.sql and community55.sql. Safe to rerun.
-- The first authenticated member to complete sign-in is founder; this avoids granting
-- administration to an unconfirmed signup. All later members start as 书家.
create or replace function public.ink_claim_membership76()
returns text language plpgsql security definer set search_path=public
as $$
declare current_role text;
begin
 if auth.uid() is null then raise exception '请先登录'; end if;
 perform pg_advisory_xact_lock(2026092901);
 insert into public.ink_members(owner,role)
 values(auth.uid(),case when exists(select 1 from public.ink_members where role='书仙') then '书家' else '书仙' end)
 on conflict(owner) do nothing;
 select role into current_role from public.ink_members where owner=auth.uid();
 return current_role;
end $$;
revoke all on function public.ink_claim_membership76() from public;
grant execute on function public.ink_claim_membership76() to authenticated;
