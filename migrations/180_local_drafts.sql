create policy ink_drafts_shared_insert180 on storage.objects as restrictive for insert to authenticated with check (bucket_id <> 'ink-drafts' or split_part(name,'/',2) ~ '^shared[-_:]');
create policy ink_drafts_shared_update180 on storage.objects as restrictive for update to authenticated using (bucket_id <> 'ink-drafts' or split_part(name,'/',2) ~ '^shared[-_:]') with check (bucket_id <> 'ink-drafts' or split_part(name,'/',2) ~ '^shared[-_:]');
create or replace function ink_private142.guard_local_drafts180() returns trigger language plpgsql set search_path='pg_catalog' as $$
begin
 if new.draft_path is not null and not (new.local_id like 'shared:%' or new.local_id like '%shared-work:%' or new.local_id like '%shared-book:%') then
  if TG_OP='INSERT' or new.draft_path is distinct from old.draft_path or new.local_id is distinct from old.local_id then raise exception '普通作品原始笔迹仅保存在本机；发起共书后可上传共书笔迹'; end if;
 end if;
 return new;
end $$;
create trigger ink_works_local_drafts180 before insert or update on public.ink_works for each row execute function ink_private142.guard_local_drafts180();