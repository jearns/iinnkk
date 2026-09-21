-- Run once in Supabase SQL Editor. Safe to rerun.
create table if not exists public.ink_works (
 id uuid primary key default gen_random_uuid(), owner uuid not null references auth.users(id) on delete cascade,
 local_id text not null, title text not null default '亲笔真迹', image_path text not null, draft_path text,
 updated_at timestamptz not null default now(), unique(owner,local_id),
 check(split_part(image_path,'/',1)=owner::text),check(draft_path is null or split_part(draft_path,'/',1)=owner::text)
);
create table if not exists public.ink_settings(owner uuid primary key references auth.users(id) on delete cascade,settings jsonb not null);
alter table public.ink_works enable row level security;
alter table public.ink_settings enable row level security;
drop policy if exists ink_works_owner on public.ink_works;
create policy ink_works_owner on public.ink_works for all to authenticated using ((select auth.uid())=owner) with check ((select auth.uid())=owner);
drop policy if exists ink_settings_owner on public.ink_settings;
create policy ink_settings_owner on public.ink_settings for all to authenticated using ((select auth.uid())=owner) with check ((select auth.uid())=owner);
grant select,insert,update,delete on public.ink_works, public.ink_settings to authenticated;
revoke all on public.ink_works, public.ink_settings from anon;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('ink-works','ink-works',false,52428800,array['image/png','image/jpeg','application/json']) on conflict(id) do update set public=false;
drop policy if exists ink_files_owner on storage.objects;
create policy ink_files_owner on storage.objects for all to authenticated using (bucket_id='ink-works' and (storage.foldername(name))[1]=(select auth.uid()::text)) with check (bucket_id='ink-works' and (storage.foldername(name))[1]=(select auth.uid()::text));
