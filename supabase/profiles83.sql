-- Run once after schema.sql and community55.sql in Supabase SQL Editor.
create table if not exists public.ink_profiles83 (
  owner uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '亲笔书家' check(char_length(display_name) between 1 and 50),
  wechat text not null default '' check(char_length(wechat)<=50),
  contact text not null default '' check(char_length(contact)<=120),
  updated_at timestamptz not null default now()
);
alter table public.ink_profiles83 enable row level security;
drop policy if exists ink_profiles83_public on public.ink_profiles83;
create policy ink_profiles83_public on public.ink_profiles83 for select to anon,authenticated using(true);
drop policy if exists ink_profiles83_owner on public.ink_profiles83;
create policy ink_profiles83_owner on public.ink_profiles83 for all to authenticated
  using(owner=(select auth.uid())) with check(owner=(select auth.uid()));
grant select on public.ink_profiles83 to anon;
grant select,insert,update,delete on public.ink_profiles83 to authenticated;
