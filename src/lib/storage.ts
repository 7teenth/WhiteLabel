import { supabase } from './supabaseClient';

const PRODUCT_BUCKET = 'product-images';

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

export function getPublicImageUrl(path?: string | null): string | null {
  if (!path) return null;
  if (isHttpUrl(path)) return path;
  const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
  return data.publicUrl ?? null;
}
