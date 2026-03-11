-- Allow anonymous users to submit reviews (stored as pending)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'reviews' and policyname = 'Anon create reviews pending'
  ) then
    create policy "Anon create reviews pending"
      on reviews
      for insert
      to anon
      with check (status = 'pending');
  end if;
end$$;
