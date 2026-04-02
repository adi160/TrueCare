-- One-time migration for visitor summary stats.
-- Run this only once after the base schema already exists.

create table if not exists public.daily_stats (
  stat_date date primary key,
  visitor_count integer not null default 0,
  consultation_count integer not null default 0,
  booking_count integer not null default 0,
  updated_at timestamptz not null default now()
);

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

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'touch_daily_stats_updated_at'
  ) then
    create trigger touch_daily_stats_updated_at
    before update on public.daily_stats
    for each row execute function public.touch_updated_at();
  end if;
end$$;

alter table public.daily_stats enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'daily_stats'
      and policyname = 'daily stats are readable for demo'
  ) then
    create policy "daily stats are readable for demo"
    on public.daily_stats
    for select
    using (true);
  end if;
end$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'daily_stats'
      and policyname = 'daily stats can be inserted by anyone'
  ) then
    create policy "daily stats can be inserted by anyone"
    on public.daily_stats
    for insert
    with check (true);
  end if;
end$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'daily_stats'
      and policyname = 'daily stats can be updated by anyone'
  ) then
    create policy "daily stats can be updated by anyone"
    on public.daily_stats
    for update
    using (true)
    with check (true);
  end if;
end$$;
