import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export type Review = {
  id: string;
  product_id: string;
  author: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
};

export function useReviews(productId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setReviews([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);

    supabase
      .from('reviews')
      .select('id, product_id, author, rating, comment, created_at')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .then((res) => {
        if (!active) return;
        if (res.error) setError(res.error.message);
        else setReviews((res.data as Review[]) ?? []);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productId]);

  return useMemo(() => ({ reviews, loading, error }), [reviews, loading, error]);
}
