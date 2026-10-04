-- Public writing totals, likes and follows. No contact details or private works are exposed.
create table if not exists public.ink_writing116 (
  owner uuid primary key references auth.users(id) on delete cascade,
  strokes integer not null default 0 check (strokes between 0 and 100000000),
  seconds integer not null default 0 check (seconds between 0 and 100000000),
  updated_at timestamptz not null default now()
);
alter table public.ink_writing116 enable row level security;
create policy ink_writing116_read on public.ink_writing116 for select to anon, authenticated using (true);
create policy ink_writing116_insert on public.ink_writing116 for insert to authenticated with check (owner = (select auth.uid()));
create policy ink_writing116_update on public.ink_writing116 for update to authenticated using (owner = (select auth.uid())) with check (owner = (select auth.uid()));
grant select on public.ink_writing116 to anon;
grant select, insert, update on public.ink_writing116 to authenticated;

create table if not exists public.ink_writing_likes116 (
  owner uuid not null references auth.users(id) on delete cascade,
  admirer uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (owner, admirer),
  check (owner <> admirer)
);
alter table public.ink_writing_likes116 enable row level security;
create policy ink_writing_likes116_read on public.ink_writing_likes116 for select to anon, authenticated using (true);
create policy ink_writing_likes116_add on public.ink_writing_likes116 for insert to authenticated with check (admirer = (select auth.uid()));
create policy ink_writing_likes116_remove on public.ink_writing_likes116 for delete to authenticated using (admirer = (select auth.uid()));
grant select on public.ink_writing_likes116 to anon;
grant select, insert, delete on public.ink_writing_likes116 to authenticated;

create table if not exists public.ink_follows116 (
  followed uuid not null references auth.users(id) on delete cascade,
  follower uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (followed, follower),
  check (followed <> follower)
);
alter table public.ink_follows116 enable row level security;
create policy ink_follows116_read on public.ink_follows116 for select to anon, authenticated using (true);
create policy ink_follows116_add on public.ink_follows116 for insert to authenticated with check (follower = (select auth.uid()));
create policy ink_follows116_remove on public.ink_follows116 for delete to authenticated using (follower = (select auth.uid()));
grant select on public.ink_follows116 to anon;
grant select, insert, delete on public.ink_follows116 to authenticated;
