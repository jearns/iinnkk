-- Owner recoverable deletion; expiry is enforced by PostgreSQL, not the client clock.
alter table public.ink_works add column deleted_at144 timestamptz;
alter table public.ink_works add column purging144 boolean not null default false;
alter table public.ink_works add column trash_published144 boolean not null default false;
alter table public.ink_works add column trash_featured144 boolean not null default false;
create index ink_works_trash144 on public.ink_works(deleted_at144) where deleted_at144 is not null;
create policy works_trash_visibility144 on public.ink_works as restrictive for select to anon,authenticated using(deleted_at144 is null or (owner=(select auth.uid()) and deleted_at144>now()-interval '24 hours' and not purging144));
create function public.ink_trash_work144(work_id uuid) returns public.ink_works language plpgsql security invoker set search_path=pg_catalog as $$
declare result public.ink_works;
begin
 if auth.uid() is null then raise exception '请先登录'; end if;
 update public.ink_works set deleted_at144=clock_timestamp(),trash_published144=published,trash_featured144=featured,published=false,featured=false where id=work_id and owner=auth.uid() and deleted_at144 is null returning * into result;
 if result.id is null then select * into result from public.ink_works where id=work_id and owner=auth.uid() and deleted_at144 is not null and not purging144; end if;
 if result.id is null then raise exception '作品已过期或无权删除'; end if;return result;
end $$;
create function public.ink_restore_work144(work_id uuid) returns public.ink_works language plpgsql security invoker set search_path=pg_catalog as $$
declare result public.ink_works;
begin
 if auth.uid() is null then raise exception '请先登录'; end if;
 update public.ink_works set deleted_at144=null,published=trash_published144,featured=trash_featured144,updated_at=clock_timestamp() where id=work_id and owner=auth.uid() and deleted_at144>clock_timestamp()-interval '24 hours' and not purging144 returning * into result;
 if result.id is null then raise exception '作品已超过24小时或无权恢复'; end if;return result;
end $$;
revoke all on function public.ink_trash_work144(uuid),public.ink_restore_work144(uuid) from public,anon;
grant execute on function public.ink_trash_work144(uuid),public.ink_restore_work144(uuid) to authenticated;
create function ink_private142.guard_trash144() returns trigger language plpgsql security invoker set search_path=pg_catalog as $$
begin
 if current_user in ('postgres','service_role') then return new; end if;
 if TG_OP='INSERT' then if new.deleted_at144 is not null or new.purging144 then raise exception '不能新建回收站作品';end if;return new;end if;
 if old.deleted_at144 is not null then
  if auth.uid() is distinct from old.owner or old.purging144 or old.deleted_at144<=clock_timestamp()-interval '24 hours' then raise exception '作品已过期或无权恢复';end if;
  if new.deleted_at144 is not null then raise exception '请先从回收站恢复作品';end if;
 elsif new.deleted_at144 is not null then
  if auth.uid() is distinct from old.owner then raise exception '只能删除自己的作品';end if;
  new.deleted_at144:=clock_timestamp();new.trash_published144:=old.published;new.trash_featured144:=old.featured;new.published:=false;new.featured:=false;
 end if;
 if new.purging144 is distinct from old.purging144 then raise exception '不可修改清理状态';end if;return new;
end $$;
revoke all on function ink_private142.guard_trash144() from public,anon,authenticated;
create trigger ink_works_trash_guard144 before insert or update on public.ink_works for each row execute function ink_private142.guard_trash144();
create function public.ink_claim_expired_trash144() returns setof public.ink_works language sql security invoker set search_path=pg_catalog as $$
 update public.ink_works set purging144=true where id in (select id from public.ink_works where deleted_at144<=clock_timestamp()-interval '24 hours' order by deleted_at144 limit 100 for update skip locked) returning *;
$$;
revoke all on function public.ink_claim_expired_trash144() from public,anon,authenticated;
grant execute on function public.ink_claim_expired_trash144() to service_role;
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
