import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { useSubscription } from '../hooks/useSubscription';
import { useI18n } from '../lib/i18n';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { plan, limits } = useSubscription();
  const { t } = useI18n();

  const hasItems = items.length > 0;
  const formattedTotal = useMemo(() => total.toFixed(2), [total]);

  const isOverLimit = plan === 'free' && items.length > limits.projects;

  if (!hasItems) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <h1 style={{ marginTop: 0 }}>{t('cart.title')}</h1>
        <p>{t('cart.empty')}</p>
        <Link to="/products" style={{ color: '#0070f3' }}>
          {t('cart.empty.cta')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginTop: 0 }}>{t('cart.title')}</h1>
      {isOverLimit ? (
        <div
          style={{
            padding: '1rem',
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 12,
            background: '#fff',
            marginBottom: '1.25rem',
          }}
        >
          <strong>{t('cart.limit.title')}</strong> {t('cart.limit.body', { count: limits.projects })}
          <div style={{ marginTop: 8 }}>
            <Link to="/upgrade" style={{ color: '#0070f3' }}>
              {t('cart.limit.cta')}
            </Link>
          </div>
        </div>
      ) : null}

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {items.map((item) => (
          <div
            key={item.productId}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 120px',
              gap: '1rem',
              alignItems: 'center',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 12,
              padding: '1rem',
              background: '#fff',
            }}
          >
            <img
              src={item.imageUrl || 'https://via.placeholder.com/400?text=Tool'}
              alt={item.name}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12 }}
            />
            <div>
              <Link to={`/products/${item.slug}`} style={{ fontWeight: 600, color: 'inherit' }}>
                {item.name}
              </Link>
              <div style={{ marginTop: 8, fontSize: '0.95rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {t('cart.qty')}
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                    style={{ width: 60, padding: '0.25rem 0.5rem', borderRadius: 6, border: '1px solid rgba(0,0,0,0.2)' }}
                  />
                </label>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600 }}>${(item.unitPrice * item.quantity).toFixed(2)}</div>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                style={{
                  marginTop: 8,
                  border: 'none',
                  background: 'transparent',
                  color: '#b00020',
                  cursor: 'pointer',
                }}
              >
                {t('cart.remove')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            {t('cart.total')}: <strong>${formattedTotal}</strong>
          </p>
        </div>
        <Link
          to="/checkout"
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: 10,
            background: '#0070f3',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          {t('cart.checkout')}
        </Link>
      </div>
    </div>
  );
}
