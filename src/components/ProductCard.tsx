import { Link } from 'react-router-dom';
import { Product } from '../hooks/useProducts';
import { useCart } from '../lib/cart';
import { useI18n } from '../lib/i18n';

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.image || 'https://via.placeholder.com/400x300?text=Tool';
  const { addItem } = useCart();
  const { t } = useI18n();

  const rating = product.rating ?? 4.8;
  const reviews = product.reviews_count ?? 0;

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    addItem(product, 1);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card__image">
        <img src={imageUrl} alt={product.title} loading="lazy" />
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__desc">
          {product.description?.slice(0, 90) ?? t('product.description.fallback')}
          {product.description && product.description.length > 90 ? '…' : ''}
        </p>
        <div className="product-card__meta">
          <span className="product-card__pill product-card__rating">★ {rating.toFixed(1)}</span>
          <span className="product-card__pill">{reviews} {t('product.reviews')}</span>
          {product.stock !== undefined && (
            <span className="product-card__pill">{product.stock > 0 ? t('filters.inStock') : t('filters.outOfStock')}</span>
          )}
        </div>
        <div className="product-card__actions">
          <button type="button" className="wl-btn wl-btn--primary wl-btn--sm" onClick={handleAdd}>
            {t('product.add')}
          </button>
          <span className="product-card__price-inline">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}
