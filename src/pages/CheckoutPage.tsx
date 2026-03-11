import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { useSubscription } from '../hooks/useSubscription';
import { useI18n } from '../lib/i18n';

type CheckoutFields = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

const initialForm: CheckoutFields = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
};

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const { plan, limits } = useSubscription();
  const { t } = useI18n();
  const [form, setForm] = useState<CheckoutFields>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasItems = items.length > 0;

  useEffect(() => {
    if (plan === 'free' && items.length >= limits.projects && hasItems) {
      navigate('/upgrade', { replace: true });
    }
  }, [plan, limits.projects, items.length, hasItems, navigate]);

  const handleChange = (key: keyof CheckoutFields, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!hasItems) return;

    setSubmitting(true);
    setError(null);

    // TODO: Implement order creation in Supabase (orders + order_items tables)
    await new Promise((resolve) => setTimeout(resolve, 800));

    clear();
    setSubmitting(false);
    navigate('/account', { replace: true });
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginTop: 0 }}>{t('checkout.title')}</h1>

      {!hasItems ? (
        <p>{t('checkout.empty')}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <form
            onSubmit={handleSubmit}
            style={{
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 12,
              padding: '1.5rem',
              background: '#fff',
              maxWidth: 600,
            }}
          >
            <h2 style={{ marginTop: 0 }}>{t('checkout.shipping')}</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <label>
                {t('checkout.fullName')}
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', marginTop: 6, borderRadius: 8, border: '1px solid rgba(0,0,0,0.2)' }}
                />
              </label>
              <label>
                {t('checkout.email')}
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', marginTop: 6, borderRadius: 8, border: '1px solid rgba(0,0,0,0.2)' }}
                />
              </label>
              <label>
                {t('checkout.address')}
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', marginTop: 6, borderRadius: 8, border: '1px solid rgba(0,0,0,0.2)' }}
                />
              </label>
              <label>
                {t('checkout.city')}
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', marginTop: 6, borderRadius: 8, border: '1px solid rgba(0,0,0,0.2)' }}
                />
              </label>
              <label>
                {t('checkout.postalCode')}
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', marginTop: 6, borderRadius: 8, border: '1px solid rgba(0,0,0,0.2)' }}
                />
              </label>
              <label>
                {t('checkout.country')}
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', marginTop: 6, borderRadius: 8, border: '1px solid rgba(0,0,0,0.2)' }}
                />
              </label>
            </div>

            {error ? <p style={{ color: '#b00020' }}>{error}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: '1rem',
                padding: '0.85rem 1.25rem',
                borderRadius: 10,
                border: 'none',
                background: '#0070f3',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {submitting ? '…' : t('checkout.submit')}
            </button>
          </form>

          <div>
            <p style={{ fontSize: '1.05rem' }}>
              {t('cart.total')}: <strong>${total.toFixed(2)}</strong>
            </p>
            <p style={{ color: '#555' }}>{t('cart.limit.title')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
