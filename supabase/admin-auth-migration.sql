-- One-time migration for admin login protection.
-- Run this after the base schema if you already created the tables earlier.

alter table public.admin_profiles enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_profiles'
      and policyname = 'admin profiles are readable by owner'
  ) then
    create policy "admin profiles are readable by owner"
    on public.admin_profiles
    for select
    using (auth.uid() = id);
  end if;
end$$;
