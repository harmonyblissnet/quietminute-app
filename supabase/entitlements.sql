-- The Daily Practice — account-based entitlements
-- =================================================
-- Run this once in your Supabase project:
--   Dashboard → SQL Editor → New query → paste this → Run.
--
-- It creates one row per paying account. The Lemon Squeezy webhook (Phase 2,
-- using the service-role key) is the ONLY thing that writes here, so access can't be
-- faked from the browser. The schema is deliberately subscription-ready: a
-- future monthly/yearly plan reuses the same row.

create table if not exists public.entitlements (
  user_id            uuid primary key references auth.users (id) on delete cascade,
  daily_practice     boolean     not null default false,        -- the access gate
  plan               text,                                      -- 'one_time' | 'monthly' | 'yearly'
  status             text,                                      -- 'active' | 'canceled' | 'past_due' (subscriptions)
  current_period_end timestamptz,                               -- subscriptions only; null for one-time
  stripe_customer_id text,
  updated_at         timestamptz not null default now()
);

alter table public.entitlements enable row level security;

-- Users may read only their own entitlement. There is intentionally no insert/
-- update/delete policy: the webhook uses the service-role key, which bypasses
-- RLS, so clients can never grant themselves access.
drop policy if exists "read own entitlement" on public.entitlements;
create policy "read own entitlement"
  on public.entitlements for select
  using (auth.uid() = user_id);


-- ---------------------------------------------------------------------------
-- Optional: preview The Daily Practice on your own account before Stripe is
-- wired up. Replace the email with yours, then run just these lines.
-- ---------------------------------------------------------------------------
-- insert into public.entitlements (user_id, daily_practice, plan)
-- select id, true, 'one_time' from auth.users where email = 'you@example.com'
-- on conflict (user_id) do update set daily_practice = true, updated_at = now();
