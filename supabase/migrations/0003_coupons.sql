-- Coupon/discount codes, applied at checkout to reduce the paid amount.
-- Percent-off only (keeps it currency-agnostic across the AED/EGP split)
-- and looked up only via the service-role client from server-only payment
-- routes (src/lib/coupons.ts) — there is deliberately no public select
-- policy here: the anon key is public, and a public "active" policy would
-- let anyone dump every active code straight from Supabase's REST API,
-- bypassing this app (and any per-influencer/private code) entirely.
create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  percent_off numeric(5, 2) not null check (percent_off > 0 and percent_off <= 100),
  active boolean not null default true,
  expires_at timestamptz,
  max_redemptions int,
  times_redeemed int not null default 0,
  created_at timestamptz not null default now()
);

alter table coupons enable row level security;

create policy "coupons: admin all" on coupons
  for all using (is_admin()) with check (is_admin());

-- Atomic increment so two near-simultaneous redemptions can't both read the
-- same times_redeemed and undercount.
create function increment_coupon_redemption(coupon_code text)
returns void
language sql
security definer set search_path = public
as $$
  update coupons set times_redeemed = times_redeemed + 1 where code = coupon_code;
$$;

-- Records which code (if any) an order used, for admin visibility.
alter table orders add column coupon_code text;
