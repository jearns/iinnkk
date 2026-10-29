-- Explicitly published group previews only. No draft trajectories become public.
create or replace function public.ink_page_paths295(paths text[], uid uuid) returns boolean language sql immutable security invoker set search_path=pg_catalog as $$
 select coalesce(bool_and(path is not null and split_part(path,'/',1)=uid::text and path !~ '(^|/)\.\.(/|$)' and path ~ '\.jpg$'),true) from unnest(paths) as path;
$$;
alter table public.ink_works add column if not exists pages295 text[] not null default '{}';
alter table public.ink_works add constraint ink_works_pages295 check(cardinality(pages295)<=200 and public.ink_page_paths295(pages295,owner));
create policy files_group_pages295 on storage.objects for select to anon,authenticated using(bucket_id='ink-works' and exists(select 1 from public.ink_works w where w.published and w.deleted_at144 is null and w.pages295 @> array[objects.name]));
