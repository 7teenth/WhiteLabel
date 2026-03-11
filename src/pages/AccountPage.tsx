import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

export default function AccountPage() {
  const { t } = useI18n();

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginTop: 0 }}>{t('account.title')}</h1>
      <p style={{ marginTop: 0, color: 'var(--muted)' }}>{t('account.subtitle')}</p>

      <section
        style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          border: '1px solid var(--border)',
          borderRadius: 12,
          background: 'var(--card)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>{t('account.plan')}</h2>
        <p style={{ color: 'var(--muted)' }}>We will add subscription details soon.</p>
        <p style={{ marginTop: '0.5rem' }}>
          <Link to="/products" style={{ color: 'var(--accent)' }}>
            {t('home.cta')}
          </Link>
        </p>
      </section>

      <section
        style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          border: '1px solid var(--border)',
          borderRadius: 12,
          background: 'var(--card)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>{t('account.orders')}</h2>
        <p style={{ color: 'var(--muted)' }}>
          Orders will appear here once checkout persistence is added.
        </p>
      </section>
    </div>
  );
}
