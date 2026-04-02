-- Core extensions
create extension if not exists "pgcrypto";

-- Shared content blocks
create table if not exists public.site_sections (
  section_key text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Lead / booking requests
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type public.lead_status as enum ('new', 'contacted', 'booked', 'rejected');
  end if;
end$$;

create table if not exists public.consultation_leads (
  id bigserial primary key,
  reference_id text not null unique,
  full_name text not null,
  phone_number text not null,
  procedure text not null,
  message text not null,
  source text not null,
  service_slug text,
  status public.lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Traffic / analytics
create table if not exists public.visitor_events (
  id bigserial primary key,
  event_type text not null,
  page_path text not null,
  section_id text,
  source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Daily summary stats for fast dashboard totals.
create table if not exists public.daily_stats (
  stat_date date primary key,
  visitor_count integer not null default 0,
  consultation_count integer not null default 0,
  booking_count integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Media metadata
create table if not exists public.media_assets (
  id bigserial primary key,
  bucket text not null,
  object_path text not null,
  public_url text not null,
  alt_text text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Audit logs for admin changes
create table if not exists public.audit_logs (
  id bigserial primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

-- Admin users / roles
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.increment_daily_stats(
  p_stat_date date,
  p_visitor_delta integer default 0,
  p_consultation_delta integer default 0,
  p_booking_delta integer default 0
)
returns void
language plpgsql
as $$
begin
  insert into public.daily_stats (
    stat_date,
    visitor_count,
    consultation_count,
    booking_count,
    updated_at
  )
  values (
    p_stat_date,
    greatest(0, p_visitor_delta),
    greatest(0, p_consultation_delta),
    greatest(0, p_booking_delta),
    now()
  )
  on conflict (stat_date)
  do update set
    visitor_count = public.daily_stats.visitor_count + excluded.visitor_count,
    consultation_count = public.daily_stats.consultation_count + excluded.consultation_count,
    booking_count = public.daily_stats.booking_count + excluded.booking_count,
    updated_at = now();
end;
$$;

drop trigger if exists touch_site_sections_updated_at on public.site_sections;
create trigger touch_site_sections_updated_at
before update on public.site_sections
for each row execute function public.touch_updated_at();

drop trigger if exists touch_consultation_leads_updated_at on public.consultation_leads;
create trigger touch_consultation_leads_updated_at
before update on public.consultation_leads
for each row execute function public.touch_updated_at();

drop trigger if exists touch_admin_profiles_updated_at on public.admin_profiles;
create trigger touch_admin_profiles_updated_at
before update on public.admin_profiles
for each row execute function public.touch_updated_at();

drop trigger if exists touch_daily_stats_updated_at on public.daily_stats;
create trigger touch_daily_stats_updated_at
before update on public.daily_stats
for each row execute function public.touch_updated_at();

-- Enable RLS
alter table public.site_sections enable row level security;
alter table public.consultation_leads enable row level security;
alter table public.visitor_events enable row level security;
alter table public.daily_stats enable row level security;
alter table public.media_assets enable row level security;
alter table public.audit_logs enable row level security;
alter table public.admin_profiles enable row level security;

-- Public read for site content
drop policy if exists "site_sections are readable" on public.site_sections;
create policy "site_sections are readable"
on public.site_sections
for select
using (true);

-- Public insert for booking requests
drop policy if exists "leads can be inserted by anyone" on public.consultation_leads;
create policy "leads can be inserted by anyone"
on public.consultation_leads
for insert
with check (true);

-- Public insert for analytics events
drop policy if exists "events can be inserted by anyone" on public.visitor_events;
create policy "events can be inserted by anyone"
on public.visitor_events
for insert
with check (true);

drop policy if exists "daily stats are readable for demo" on public.daily_stats;
create policy "daily stats are readable for demo"
on public.daily_stats
for select
using (true);

drop policy if exists "daily stats can be inserted by anyone" on public.daily_stats;
create policy "daily stats can be inserted by anyone"
on public.daily_stats
for insert
with check (true);

drop policy if exists "daily stats can be updated by anyone" on public.daily_stats;
create policy "daily stats can be updated by anyone"
on public.daily_stats
for update
using (true)
with check (true);

drop policy if exists "admin profiles are readable by owner" on public.admin_profiles;
create policy "admin profiles are readable by owner"
on public.admin_profiles
for select
using (auth.uid() = id);

-- Demo-friendly read access for now.
-- We can tighten this with auth once admin login is added in phase 2.
drop policy if exists "admins can manage site sections" on public.site_sections;
create policy "admins can manage site sections"
on public.site_sections
for all
using (auth.uid() in (select id from public.admin_profiles where role = 'admin'))
with check (auth.uid() in (select id from public.admin_profiles where role = 'admin'));

drop policy if exists "leads are readable for demo" on public.consultation_leads;
create policy "leads are readable for demo"
on public.consultation_leads
for select
using (true);

drop policy if exists "admins can manage leads" on public.consultation_leads;
create policy "admins can manage leads"
on public.consultation_leads
for all
using (auth.uid() in (select id from public.admin_profiles where role = 'admin'))
with check (auth.uid() in (select id from public.admin_profiles where role = 'admin'));

drop policy if exists "events are readable for demo" on public.visitor_events;
create policy "events are readable for demo"
on public.visitor_events
for select
using (true);

drop policy if exists "admins can manage media" on public.media_assets;
create policy "admins can manage media"
on public.media_assets
for all
using (auth.uid() in (select id from public.admin_profiles where role = 'admin'))
with check (auth.uid() in (select id from public.admin_profiles where role = 'admin'));

drop policy if exists "admins can read audit logs" on public.audit_logs;
create policy "admins can read audit logs"
on public.audit_logs
for select
using (auth.uid() in (select id from public.admin_profiles where role = 'admin'));
