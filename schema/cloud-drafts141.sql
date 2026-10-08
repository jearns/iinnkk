-- Private editable drafts, separate from public artwork images. Applied to the production project in V141.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('ink-drafts','ink-drafts',false,52428800,array['application/json','application/octet-stream']) on conflict(id) do nothing;
create policy ink_drafts_owner141 on storage.objects for all to authenticated
using (bucket_id='ink-drafts' and (storage.foldername(name))[1]=(select auth.uid()::text))
with check (bucket_id='ink-drafts' and (storage.foldername(name))[1]=(select auth.uid()::text));
