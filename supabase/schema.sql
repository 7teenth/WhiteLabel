-- Supabase schema additions for subscription & user data

-- Subscriptions removed

-- 2) Example: projects table (user-scoped entity)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamp not null default now()
);
