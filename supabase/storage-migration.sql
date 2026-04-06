-- Supabase Storage setup for clinic image uploads.
-- Run this once after the base schema is installed.

insert into storage.buckets (id, name, public)
values ('clinic-assets', 'clinic-assets', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "clinic assets are readable" on storage.objects;
create policy "clinic assets are readable"
on storage.objects
for select
using (bucket_id = 'clinic-assets');

drop policy if exists "admins can upload clinic assets" on storage.objects;
create policy "admins can upload clinic assets"
on storage.objects
for insert
with check (
  bucket_id = 'clinic-assets'
  and auth.uid() in (select id from public.admin_profiles where role = 'admin')
);

drop policy if exists "admins can update clinic assets" on storage.objects;
create policy "admins can update clinic assets"
on storage.objects
for update
using (
  bucket_id = 'clinic-assets'
  and auth.uid() in (select id from public.admin_profiles where role = 'admin')
)
with check (
  bucket_id = 'clinic-assets'
  and auth.uid() in (select id from public.admin_profiles where role = 'admin')
);

drop policy if exists "admins can delete clinic assets" on storage.objects;
create policy "admins can delete clinic assets"
on storage.objects
for delete
using (
  bucket_id = 'clinic-assets'
  and auth.uid() in (select id from public.admin_profiles where role = 'admin')
);
