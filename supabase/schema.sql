-- Run this script once in the Supabase SQL Editor after creating the project.
-- Analytics stores only a random per-tab session ID and daily aggregates.
-- No IP addresses, user agents, referrers, or message sender emails are saved.

create table if not exists public.dashboard_admins (
  email text primary key check (email = lower(email))
);

insert into public.dashboard_admins (email)
values ('duartedigital@icloud.com')
on conflict (email) do nothing;

create table if not exists public.site_sessions (
  session_id uuid primary key,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  last_view_at timestamptz not null default now(),
  last_view_date date not null default ((now() at time zone 'utc')::date)
);

create table if not exists public.site_daily_stats (
  day date primary key,
  page_views bigint not null default 0 check (page_views >= 0),
  visitor_sessions bigint not null default 0 check (visitor_sessions >= 0)
);

create index if not exists site_sessions_last_seen_idx
  on public.site_sessions (last_seen);

create table if not exists public.message_rate_limits (
  session_id uuid primary key,
  last_sent timestamptz not null default now()
);

create index if not exists message_rate_limits_last_sent_idx
  on public.message_rate_limits (last_sent);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  message text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false,
  constraint messages_name_length check (name is null or char_length(name) <= 60),
  constraint messages_body_length check (char_length(message) between 1 and 2000)
);

alter table public.dashboard_admins enable row level security;
alter table public.site_sessions enable row level security;
alter table public.site_daily_stats enable row level security;
alter table public.message_rate_limits enable row level security;
alter table public.messages enable row level security;

revoke all on public.dashboard_admins from anon, authenticated;
revoke all on public.site_sessions from anon, authenticated;
revoke all on public.site_daily_stats from anon, authenticated;
revoke all on public.message_rate_limits from anon, authenticated;
revoke all on public.messages from anon, authenticated;
grant select on public.site_daily_stats, public.messages to authenticated;
grant update (is_read) on public.messages to authenticated;
grant delete on public.messages to authenticated;

create or replace function public.is_dashboard_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.dashboard_admins
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_dashboard_admin() from public, anon;
grant execute on function public.is_dashboard_admin() to authenticated;

drop policy if exists "Admins read daily site stats" on public.site_daily_stats;
create policy "Admins read daily site stats"
  on public.site_daily_stats for select to authenticated
  using (public.is_dashboard_admin());

drop policy if exists "Admins read messages" on public.messages;
create policy "Admins read messages"
  on public.messages for select to authenticated
  using (public.is_dashboard_admin());

drop policy if exists "Admins mark messages read" on public.messages;
create policy "Admins mark messages read"
  on public.messages for update to authenticated
  using (public.is_dashboard_admin())
  with check (public.is_dashboard_admin());

drop policy if exists "Admins delete messages" on public.messages;
create policy "Admins delete messages"
  on public.messages for delete to authenticated
  using (public.is_dashboard_admin());

create or replace function public.record_page_view(p_session_id uuid, p_path text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_day date := (now() at time zone 'utc')::date;
  v_last_seen_date date;
  v_last_view_at timestamptz;
  v_new_session boolean := false;
begin
  if p_session_id is null or p_path is null or char_length(p_path) > 200 or left(p_path, 1) <> '/' then
    raise exception 'INVALID_VISIT';
  end if;

  select last_view_date, last_view_at
    into v_last_seen_date, v_last_view_at
    from public.site_sessions
    where session_id = p_session_id
    for update;

  if found then
    if v_last_view_at > now() - interval '30 seconds' then
      return false;
    end if;
    v_new_session := v_last_seen_date < v_day;
    update public.site_sessions
      set last_seen = now(), last_view_at = now(), last_view_date = v_day
      where session_id = p_session_id;
  else
    insert into public.site_sessions (session_id, first_seen, last_seen, last_view_at, last_view_date)
      values (p_session_id, now(), now(), now(), v_day)
      on conflict (session_id) do nothing;
    if not found then
      return false;
    end if;
    v_new_session := true;
  end if;

  insert into public.site_daily_stats (day, page_views, visitor_sessions)
    values (v_day, 1, case when v_new_session then 1 else 0 end)
    on conflict (day) do update
      set page_views = public.site_daily_stats.page_views + 1,
          visitor_sessions = public.site_daily_stats.visitor_sessions + excluded.visitor_sessions;

  delete from public.site_sessions where last_seen < now() - interval '30 days';
  return true;
end;
$$;

revoke all on function public.record_page_view(uuid, text) from public, authenticated;
grant execute on function public.record_page_view(uuid, text) to anon;

create or replace function public.submit_message(
  p_session_id uuid,
  p_name text,
  p_message text,
  p_website text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := nullif(left(trim(coalesce(p_name, '')), 60), '');
  v_message text := trim(coalesce(p_message, ''));
  v_rate_session uuid;
begin
  if p_website is not null and trim(p_website) <> '' then
    return true;
  end if;

  if p_session_id is null or char_length(v_message) not between 1 and 2000 then
    raise exception 'INVALID_MESSAGE';
  end if;

  delete from public.message_rate_limits where last_sent < now() - interval '1 day';

  insert into public.message_rate_limits (session_id, last_sent)
    values (p_session_id, now())
    on conflict (session_id) do update
      set last_sent = now()
      where public.message_rate_limits.last_sent < now() - interval '1 minute'
    returning session_id into v_rate_session;

  if not found then
    raise exception 'RATE_LIMITED';
  end if;

  insert into public.messages (name, message)
    values (v_name, v_message);

  return true;
end;
$$;

revoke all on function public.submit_message(uuid, text, text, text) from public, authenticated;
grant execute on function public.submit_message(uuid, text, text, text) to anon;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end
$$;

notify pgrst, 'reload schema';
