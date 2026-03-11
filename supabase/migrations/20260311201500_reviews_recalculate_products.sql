-- Recalculate product rating and reviews_count after reviews change
create or replace function public.refresh_product_rating(p_product_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_avg numeric(3,2);
  v_count int;
begin
  select avg(rating)::numeric(3,2), count(*)
  into v_avg, v_count
  from reviews
  where product_id = p_product_id
    and status = 'approved';

  update products
  set rating = v_avg,
      reviews_count = v_count
  where id = p_product_id;
end;
$$;

-- Trigger helper to refresh on insert/update/delete
create or replace function public.trigger_refresh_product_rating()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform refresh_product_rating(old.product_id);
  else
    perform refresh_product_rating(new.product_id);
  end if;
  return null;
end;
$$;

drop trigger if exists trg_refresh_product_rating on reviews;

create trigger trg_refresh_product_rating
after insert or update or delete on reviews
for each row
execute procedure trigger_refresh_product_rating();
