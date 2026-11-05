-- Preserve administrator feature restrictions while permitting owner trash/restore transitions.
create or replace function public.guard_feature55() returns trigger language plpgsql set search_path='pg_catalog' as $$
begin
 if (tg_op='INSERT' and new.featured) or (tg_op='UPDATE' and new.featured is distinct from old.featured) then
  if not public.ink_admin55() then
   if tg_op='UPDATE' and auth.uid()=old.owner and (
    (old.deleted_at144 is null and new.deleted_at144 is not null and new.featured=false) or
    (old.deleted_at144>clock_timestamp()-interval '24 hours' and not old.purging144 and new.deleted_at144 is null and new.featured=old.trash_featured144)
   ) then return new; end if;
   raise exception '仅云端书仙可推荐首页';
  end if;
 end if;
 return new;
end $$;
