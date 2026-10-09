-- Public previews only. Legacy URL-encoded object IDs must match actual Storage names.
create policy files_public_preview150 on storage.objects for select to anon,authenticated using (bucket_id='ink-works' and exists(select 1 from public.ink_works w where w.published and w.deleted_at144 is null and replace(replace(w.image_path,'%3A',':'),'%7C','|')=objects.name));
