-- Multaqa (ملتقى) initial schema: categories, products, product files,
-- orders (Stripe + InstaPay manual-review), and profiles with an admin flag.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles: one row per authenticated user, mirrors auth.users
-- ---------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ---------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in ('ai_products', 'courses', 'couple_games')),
  name_en text not null,
  name_ar text not null,
  sort_order int not null default 0
);

insert into categories (slug, name_en, name_ar, sort_order) values
  ('ai_products', 'AI Digital Products', 'منتجات رقمية بالذكاء الاصطناعي', 1),
  ('courses', 'Courses', 'دورات', 2),
  ('couple_games', 'Couple Games', 'ألعاب للأزواج', 3);

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid not null references categories (id),
  title_en text not null,
  title_ar text not null,
  description_en text not null,
  description_ar text not null,
  price_aed numeric(10, 2) not null check (price_aed >= 0),
  price_egp numeric(10, 2) not null check (price_egp >= 0),
  cover_image_path text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

create index products_category_idx on products (category_id);

-- The actual deliverable file(s) for a product. Never exposed via a public
-- storage policy — only served through a signed URL after an order is paid.
create table product_files (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  storage_path text not null,
  label text not null default 'Download'
);

-- ---------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id),
  product_id uuid not null references products (id),
  country text not null check (country in ('AE', 'EG')),
  currency text not null check (currency in ('AED', 'EGP')),
  amount numeric(10, 2) not null,
  payment_method text not null check (payment_method in ('stripe', 'instapay')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'rejected')),
  stripe_session_id text unique,
  stripe_payment_intent text,
  instapay_reference text,
  proof_path text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references profiles (id)
);

create index orders_user_idx on orders (user_id);
create index orders_status_idx on orders (status);

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table profiles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_files enable row level security;
alter table orders enable row level security;

-- Helper: is the current user an admin?
create function is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- profiles: users read their own row; admins read all.
create policy "profiles: self or admin select" on profiles
  for select using (id = auth.uid() or is_admin());

-- categories: public read.
create policy "categories: public select" on categories
  for select using (true);

-- products: published products are public; admins see everything and can write.
create policy "products: public select published" on products
  for select using (status = 'published' or is_admin());
create policy "products: admin write" on products
  for insert with check (is_admin());
create policy "products: admin update" on products
  for update using (is_admin());
create policy "products: admin delete" on products
  for delete using (is_admin());

-- product_files: never readable directly by end users (downloads are
-- served via the service-role key after verifying a paid order); admins
-- can manage them.
create policy "product_files: admin all" on product_files
  for all using (is_admin()) with check (is_admin());

-- orders: a buyer can see and create their own orders; only admins can
-- update status (approve/reject) or see everyone else's.
create policy "orders: owner or admin select" on orders
  for select using (user_id = auth.uid() or is_admin());
create policy "orders: owner insert" on orders
  for insert with check (user_id = auth.uid());
create policy "orders: admin update" on orders
  for update using (is_admin());

-- ---------------------------------------------------------------------
-- Storage buckets (private; access goes through signed URLs only)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('product-files', 'product-files', false),
  ('payment-proofs', 'payment-proofs', false),
  ('product-covers', 'product-covers', true)
on conflict (id) do nothing;

create policy "product-covers: public read" on storage.objects
  for select using (bucket_id = 'product-covers');

create policy "product-files: admin manage" on storage.objects
  for all using (bucket_id = 'product-files' and is_admin())
  with check (bucket_id = 'product-files' and is_admin());

create policy "product-covers: admin manage" on storage.objects
  for insert with check (bucket_id = 'product-covers' and is_admin());
create policy "product-covers: admin update" on storage.objects
  for update using (bucket_id = 'product-covers' and is_admin());
create policy "product-covers: admin delete" on storage.objects
  for delete using (bucket_id = 'product-covers' and is_admin());

-- Buyers can upload their own InstaPay proof (path convention:
-- {auth.uid()}/{filename}), but cannot read any proofs back — review
-- happens via the admin panel using the service-role key.
create policy "payment-proofs: owner upload" on storage.objects
  for insert with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "payment-proofs: admin read" on storage.objects
  for select using (bucket_id = 'payment-proofs' and is_admin());
