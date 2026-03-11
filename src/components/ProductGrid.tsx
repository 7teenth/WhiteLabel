import { Product } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { useI18n } from '../lib/i18n';

export function ProductGrid({ products }: { products: Product[] }) {
  const { t } = useI18n();
  if (products.length === 0) {
    return <p style={{ marginTop: '1.5rem' }}>{t('products.empty') || 'No products found.'}</p>;
  }

  return (
    <div className="grid" style={{ marginTop: '1.25rem' }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
