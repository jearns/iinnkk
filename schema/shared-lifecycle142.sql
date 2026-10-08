-- V142: small atomic room/page creation; originals remain in private storage.
alter table public.ink_shared_rooms128 add column closed142 boolean not null default false;
alter table public.ink_shared_rooms128 add constraint shared_closed_members142 check(not closed142 or participants=array[owner]);
alter table public.ink_shared_pages128 add column draft_path142 text;
alter table public.ink_shared_pages128 add column thumbnail142 text;
alter table public.ink_shared_pages128 add constraint shared_thumbnail142 check(thumbnail142 is null or (length(thumbnail142)<=120000 and thumbnail142 like 'data:image/jpeg;base64,%'));
create policy shared_rooms_delete142 on public.ink_shared_rooms128 for delete to authenticated using(owner=(select auth.uid()));
grant delete on public.ink_shared_rooms128 to authenticated;
create policy shared_preview142 on public.ink_shared_pages128 for update to authenticated using(exists(select 1 from public.ink_shared_rooms128 r where r.id=room and not r.closed142 and (select auth.uid())=any(r.participants))) with check(exists(select 1 from public.ink_shared_rooms128 r where r.id=room and not r.closed142 and (select auth.uid())=any(r.participants)));
grant update(thumbnail142) on public.ink_shared_pages128 to authenticated;
create schema if not exists ink_private142;
revoke all on schema ink_private142 from public,anon,authenticated;
create function ink_private142.guard_shared_write() returns trigger language plpgsql security definer set search_path=pg_catalog as $$
declare r public.ink_shared_rooms128; room_id uuid;
begin
 if auth.uid() is null then raise exception '请先登录'; end if;
 if TG_TABLE_NAME='ink_shared_pages128' then
   if new.author<>auth.uid() then raise exception '作者身份不符'; end if;
   room_id:=new.room;
 else
   if new.writer<>auth.uid() then raise exception '书写身份不符'; end if;
   select p.room into room_id from public.ink_shared_pages128 p where p.id=new.page;
 end if;
 select * into r from public.ink_shared_rooms128 where id=room_id for share;
 if r.id is null or r.closed142 or not auth.uid()=any(r.participants) then raise exception '共书已结束或你已离开共书'; end if;
 if TG_TABLE_NAME='ink_shared_pages128' then
  if new.draft_path142 is not null and new.draft_path142 !~ ('^'||r.owner::text||'/'||r.id::text||'/'||auth.uid()::text||'/'||new.id::text||'-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.json(\.gz)?$') then raise exception '原笔迹路径不符'; end if;
 end if;
 return new;
end $$;
revoke all on function ink_private142.guard_shared_write() from public,anon,authenticated;
create trigger shared_page_guard142 before insert on public.ink_shared_pages128 for each row execute function ink_private142.guard_shared_write();
create trigger shared_op_guard142 before insert on public.ink_shared_ops128 for each row execute function ink_private142.guard_shared_write();
create function public.ink_create_shared142(room_id uuid,room_title text,page_id uuid,page_title text,draft_path text,thumbnail text) returns jsonb language plpgsql security invoker set search_path=pg_catalog as $$
declare r public.ink_shared_rooms128; p public.ink_shared_pages128;
begin
 if auth.uid() is null then raise exception '请先登录'; end if;
 if draft_path is null then raise exception '缺少共书原笔迹'; end if;
 insert into public.ink_shared_rooms128(id,owner,title,participants) values(room_id,auth.uid(),room_title,array[auth.uid()]) on conflict(id) do nothing;
 select * into r from public.ink_shared_rooms128 where id=room_id;
 if r.owner is distinct from auth.uid() or r.closed142 then raise exception '无权发起此共书'; end if;
 insert into public.ink_shared_pages128(id,room,author,title,draft,draft_path142,thumbnail142) values(page_id,room_id,auth.uid(),page_title,'{"version":39,"flow":{"strokes":[]}}',draft_path,thumbnail) on conflict(id) do nothing;
 select * into p from public.ink_shared_pages128 where id=page_id and room=room_id;
 if p.id is null then raise exception '共书页面不符'; end if;
 return jsonb_build_object('room',to_jsonb(r),'page',to_jsonb(p));
end $$;
revoke all on function public.ink_create_shared142(uuid,text,uuid,text,text,text) from public,anon;
grant execute on function public.ink_create_shared142(uuid,text,uuid,text,text,text) to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('ink-shared142','ink-shared142',false,52428800,array['application/json','application/octet-stream']) on conflict(id) do nothing;
-- No UPDATE policy: immutable original uploads cannot overwrite another member's file.
create policy shared_files_owner_read142 on storage.objects for select to authenticated using(bucket_id='ink-shared142' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy shared_files_owner_delete142 on storage.objects for delete to authenticated using(bucket_id='ink-shared142' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy shared_files_member_read142 on storage.objects for select to authenticated using(bucket_id='ink-shared142' and exists(select 1 from public.ink_shared_rooms128 r where r.owner::text=(storage.foldername(name))[1] and r.id::text=(storage.foldername(name))[2] and not r.closed142 and (select auth.uid())=any(r.participants)));
create policy shared_files_add142 on storage.objects for insert to authenticated with check(bucket_id='ink-shared142' and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}-[0-9a-f-]{36}\.json(\.gz)?$' and (storage.foldername(name))[3]=(select auth.uid())::text and ((storage.foldername(name))[1]=(select auth.uid())::text or exists(select 1 from public.ink_shared_rooms128 r where r.owner::text=(storage.foldername(name))[1] and r.id::text=(storage.foldername(name))[2] and not r.closed142 and (select auth.uid())=any(r.participants))));
