create table if not exists public.ink_shared_rooms128 (
 id uuid primary key default gen_random_uuid(), owner uuid not null references auth.users(id), title text not null check(length(title) between 1 and 120), participants uuid[] not null, created_at timestamptz not null default now(), check(owner=any(participants)),check(cardinality(participants)<=100));
alter table public.ink_shared_rooms128 enable row level security;
create policy shared_rooms_read128 on public.ink_shared_rooms128 for select to authenticated using(owner=(select auth.uid()) or (select auth.uid())=any(participants));
create policy shared_rooms_create128 on public.ink_shared_rooms128 for insert to authenticated with check(owner=(select auth.uid()) and not exists(select 1 from unnest(participants) p where p<>owner and (not exists(select 1 from public.ink_follows116 f where f.follower=owner and f.followed=p) or not exists(select 1 from public.ink_follows116 f where f.follower=p and f.followed=owner))));
create policy shared_rooms_edit128 on public.ink_shared_rooms128 for update to authenticated using(owner=(select auth.uid())) with check(owner=(select auth.uid()) and not exists(select 1 from unnest(participants) p where p<>owner and (not exists(select 1 from public.ink_follows116 f where f.follower=owner and f.followed=p) or not exists(select 1 from public.ink_follows116 f where f.follower=p and f.followed=owner))));
create table if not exists public.ink_shared_pages128 (
 id uuid primary key default gen_random_uuid(), room uuid not null references public.ink_shared_rooms128(id) on delete cascade, author uuid not null references auth.users(id), title text not null check(length(title)<=120), draft jsonb not null, created_at timestamptz not null default now());
alter table public.ink_shared_pages128 enable row level security;
create policy shared_pages_read128 on public.ink_shared_pages128 for select to authenticated using(exists(select 1 from public.ink_shared_rooms128 r where r.id=room and (r.owner=(select auth.uid()) or (select auth.uid())=any(r.participants))));
create policy shared_pages_insert128 on public.ink_shared_pages128 for insert to authenticated with check(author=(select auth.uid()) and exists(select 1 from public.ink_shared_rooms128 r where r.id=room and (r.owner=(select auth.uid()) or (select auth.uid())=any(r.participants))));
create table if not exists public.ink_shared_ops128 (
 seq bigint generated always as identity primary key,id uuid not null unique, page uuid not null references public.ink_shared_pages128(id) on delete cascade, writer uuid not null references auth.users(id), payload jsonb not null check(jsonb_typeof(payload)='array'), created_at timestamptz not null default now());
create index shared_ops_page_seq128 on public.ink_shared_ops128(page,seq);
create index shared_pages_room128 on public.ink_shared_pages128(room);
alter table public.ink_shared_ops128 enable row level security;
create policy shared_ops_read128 on public.ink_shared_ops128 for select to authenticated using(exists(select 1 from public.ink_shared_pages128 p join public.ink_shared_rooms128 r on r.id=p.room where p.id=page and (r.owner=(select auth.uid()) or (select auth.uid())=any(r.participants))));
create policy shared_ops_insert128 on public.ink_shared_ops128 for insert to authenticated with check(writer=(select auth.uid()) and exists(select 1 from public.ink_shared_pages128 p join public.ink_shared_rooms128 r on r.id=p.room where p.id=page and (r.owner=(select auth.uid()) or (select auth.uid())=any(r.participants))));
grant select,insert,update on public.ink_shared_rooms128 to authenticated;
grant select,insert on public.ink_shared_pages128,public.ink_shared_ops128 to authenticated;
grant usage,select on sequence public.ink_shared_ops128_seq_seq to authenticated;
