-- Run after schema.sql and roles76.sql in Supabase SQL Editor.
-- A supplier can read only booklets that their authors explicitly submitted.
create table if not exists public.ink_suppliers (
 owner uuid primary key references auth.users(id) on delete cascade,
 studio text not null check (char_length(studio) between 2 and 80),
 contact text not null default '',
 created_at timestamptz not null default now()
);
create table if not exists public.ink_booklets (
 id uuid primary key default gen_random_uuid(),
 owner uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(title) between 1 and 100),
 pdf_path text not null,
 cover_path text,
 submitted boolean not null default false,
 page_count integer not null check (page_count between 2 and 60),
 created_at timestamptz not null default now(),
 check (split_part(pdf_path,'/',1)=owner::text),
 check (cover_path is null or split_part(cover_path,'/',1)=owner::text)
);
create index if not exists ink_booklets_submitted80 on public.ink_booklets(submitted,created_at desc);
alter table public.ink_suppliers enable row level security;
alter table public.ink_booklets enable row level security;
drop policy if exists ink_suppliers_self80 on public.ink_suppliers;
create policy ink_suppliers_self80 on public.ink_suppliers for all to authenticated
 using (owner=(select auth.uid())) with check (owner=(select auth.uid()));
drop policy if exists ink_booklets_owner80 on public.ink_booklets;
create policy ink_booklets_owner80 on public.ink_booklets for all to authenticated
 using (owner=(select auth.uid())) with check (owner=(select auth.uid()));
drop policy if exists ink_booklets_supplier_read80 on public.ink_booklets;
create policy ink_booklets_supplier_read80 on public.ink_booklets for select to authenticated
 using (submitted and exists(select 1 from public.ink_suppliers s where s.owner=(select auth.uid())));
grant select,insert,update,delete on public.ink_booklets,public.ink_suppliers to authenticated;
revoke all on public.ink_booklets,public.ink_suppliers from anon;
update storage.buckets set allowed_mime_types=array['image/png','image/jpeg','application/json','application/pdf'] where id='ink-works';
drop policy if exists ink_booklet_supplier_read80 on storage.objects;
create policy ink_booklet_supplier_read80 on storage.objects for select to authenticated using (
 bucket_id='ink-works' and exists (
   select 1 from public.ink_booklets b where b.pdf_path=name and b.submitted
   and exists (select 1 from public.ink_suppliers s where s.owner=(select auth.uid()))
 )
);
