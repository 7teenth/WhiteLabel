-- Reviews table with moderation statuses
do $$
begin
  if not exists (select 1 from pg_type where typname = 'review_status') then
    create type review_status as enum ('pending', 'approved', 'deleted');
  end if;
end$$;

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author text,
  rating numeric(2,1) not null check (rating >= 1 and rating <= 5),
  comment text,
  status review_status not null default 'pending',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists reviews_product_id_idx on reviews (product_id, status, created_at desc);

alter table reviews enable row level security;

-- Public (anon) can read only approved reviews
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'reviews' and policyname = 'Read approved reviews'
  ) then
    create policy "Read approved reviews"
      on reviews
      for select
      using (status = 'approved');
  end if;
end$$;

-- Authenticated users can create reviews (always stored as pending)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'reviews' and policyname = 'Create reviews pending'
  ) then
    create policy "Create reviews pending"
      on reviews
      for insert
      to authenticated
      with check (status = 'pending');
  end if;
end$$;

-- Service role (admin) can update/delete for moderation
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'reviews' and policyname = 'Moderate reviews'
  ) then
    create policy "Moderate reviews"
      on reviews
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end$$;
