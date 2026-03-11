-- Supabase schema additions for subscription & user data

-- 1) Subscriptions table (basic subscription model)
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

-- 2) Example: projects table (user-scoped entity)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamp not null default now()
);
