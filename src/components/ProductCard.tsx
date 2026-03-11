import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Product } from '../hooks/useProducts';
import { useCart } from '../lib/cart';
import { useI18n } from '../lib/i18n';
import { showToast } from './Toast';
import { getPublicImageUrl } from '../lib/storage';
const isHttp = (v: string) => /^https?:\/\//i.test(v);

export function ProductCard({ product }: { product: Product }) {
  const placeholder = '/placeholder.png';
  const mainImage = product.image || (product.images?.[0] ?? null);
  const imageUrl = (() => {
    if (!mainImage) return placeholder;
    const candidates = [];
    if (!isHttp(mainImage)) candidates.push(`/${mainImage}`);
    const storageUrl = getPublicImageUrl(mainImage);
    if (storageUrl) candidates.push(storageUrl);
    candidates.push(placeholder);
    return candidates[0];
  })();
  const [src, setSrc] = useState(imageUrl);
  useEffect(() => setSrc(imageUrl), [imageUrl]);
  const { addItem } = useCart();
  const { t } = useI18n();

  const rating = product.rating ?? 4.8;
  const reviews = product.reviews_count ?? 0;

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    addItem(product, 1);
    showToast(t('toast.added'));
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card__image">
        <img
          src={src}
          alt={product.title}
          loading="lazy"
          onError={() => setSrc(placeholder)}
        />
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
          {product.stock != null && (
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
