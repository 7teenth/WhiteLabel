import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { Spinner } from '../components/Spinner';
import { useCart } from '../lib/cart';
import { useI18n } from '../lib/i18n';

export default function ProductPage() {
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug ?? '');
  const { addItem } = useCart();
  const { t } = useI18n();

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, 1);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <p style={{ color: '#b00020' }}>{t('product.error')}</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr', maxWidth: 1080 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <img
            src={product.image || 'https://via.placeholder.com/800x600?text=Tool'}
            alt={product.title}
            style={{ width: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 420 }}
          />
        </div>
        <div>
          <h1 style={{ marginTop: 0 }}>{product.title}</h1>
          <p style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0.25rem 0 0.5rem' }}>
            ${product.price.toFixed(2)}
            {product.old_price ? (
              <span style={{ marginLeft: 8, color: '#9ca3af', textDecoration: 'line-through', fontWeight: 500 }}>
                ${product.old_price.toFixed(2)}
              </span>
            ) : null}
          </p>
          <p style={{ lineHeight: 1.6 }}>{product.description ?? t('product.description.fallback')}</p>

          <button
            type="button"
            onClick={handleAddToCart}
            style={{
              marginTop: '1.5rem',
              padding: '0.85rem 1.25rem',
              borderRadius: 10,
              border: 'none',
              background: '#0070f3',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('product.add')}
          </button>

          <section style={{ marginTop: '2rem', padding: '1rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12 }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{t('product.details')}</h2>
            <dl style={{ margin: '1rem 0 0' }}>
              <dt style={{ fontWeight: 600 }}>ID</dt>
              <dd style={{ margin: '0 0 0.5rem' }}>{product.id}</dd>
              {product.category ? (
                <>
                  <dt style={{ fontWeight: 600 }}>{t('products.search.label')}</dt>
                  <dd style={{ margin: 0 }}>{product.category}</dd>
                </>
              ) : null}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
