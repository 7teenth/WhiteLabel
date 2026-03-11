import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  old_price?: number | null;
  image: string | null;
  images?: string[] | null;
  category?: string | null;
  stock?: number | null;
  rating?: number | null;
  reviews_count?: number | null;
  is_featured?: boolean | null;
  created_at?: string | null;
};

type SortKey = 'new' | 'price-asc' | 'price-desc' | 'rating';

type UseProductsArgs = {
  search?: string;
  limit?: number;
  category?: string;
  minRating?: number;
  sort?: SortKey;
  minPrice?: number;
  maxPrice?: number;
  availability?: 'any' | 'in' | 'out';
};

export function useProducts({
  search = '',
  limit = 24,
  category,
  minRating = 0,
  sort = 'new',
  minPrice = 0,
  maxPrice,
  availability = 'any',
}: UseProductsArgs) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    let query = supabase
      .from('products')
      .select('id, title, description, price, old_price, image, images, category, stock, rating, reviews_count, is_featured, created_at');

    if (category) query = query.eq('category', category);
    if (minRating > 0) query = query.gte('rating', minRating);
    if (typeof minPrice === 'number') query = query.gte('price', minPrice);
    if (typeof maxPrice === 'number' && !Number.isNaN(maxPrice)) query = query.lte('price', maxPrice);
    if (availability === 'in') query = query.gt('stock', 0);
    if (availability === 'out') query = query.lte('stock', 0);
    if (search) query = query.ilike('title', `%${search}%`);

    switch (sort) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    query = query.limit(limit);

    query.then((result) => {
      if (!isMounted) return;
      if (result.error) setError(result.error.message);
      else setProducts(result.data ?? []);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [search, limit, category, minRating, sort, minPrice, maxPrice, availability]);

  return useMemo(() => ({ products, loading, error }), [products, loading, error]);
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    supabase
      .from('products')
      .select('id, title, description, price, old_price, image, images, category, stock, rating, reviews_count, is_featured, created_at')
      .eq('id', id)
      .single()
      .then((result) => {
        if (!isMounted) return;
        if (result.error) {
          setError(result.error.message);
          setProduct(null);
        } else {
          setProduct(result.data);
        }
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return useMemo(() => ({ product, loading, error }), [product, loading, error]);
}
