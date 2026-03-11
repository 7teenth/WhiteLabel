-- Bucket for product images (public read, auth upload/update/delete)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public read
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and policyname = 'Public read product images'
  ) then
    create policy "Public read product images"
      on storage.objects
      for select
      using (bucket_id = 'product-images');
  end if;
end$$;

-- Authenticated users can upload
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and policyname = 'Auth upload product images'
  ) then
    create policy "Auth upload product images"
      on storage.objects
      for insert
      to authenticated
      with check (bucket_id = 'product-images');
  end if;
end$$;

-- Authenticated users can update their objects
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and policyname = 'Auth update product images'
  ) then
    create policy "Auth update product images"
      on storage.objects
      for update
      to authenticated
      using (bucket_id = 'product-images')
      with check (bucket_id = 'product-images');
  end if;
end$$;

-- Authenticated users can delete their objects
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and policyname = 'Auth delete product images'
  ) then
    create policy "Auth delete product images"
      on storage.objects
      for delete
      to authenticated
      using (bucket_id = 'product-images');
  end if;
end$$;
