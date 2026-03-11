-- Initial database schema migration
-- Run with Supabase CLI:
--   supabase db reset (or supabase db push / supabase db migrate)

-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists "pgcrypto";

-- Users are managed by Supabase Auth (auth.users)

-- Products (existing starter data model)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric not null,
  image_url text,
  created_at timestamp not null default now()
);

-- Subscriptions (basic SaaS model)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan text not null default 'free',
  status text not null default 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamp,
  created_at timestamp not null default now()
);

-- Example user-scoped data to enforce per-user limits (projects)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamp not null default now()
);

-- Optional future tables for orders / order items (not yet used by UI)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  total numeric not null,
  status text not null default 'pending',
  created_at timestamp not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity int not null,
  unit_price numeric not null,
  created_at timestamp not null default now()
);
