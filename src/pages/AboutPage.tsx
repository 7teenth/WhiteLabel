import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header style={{ maxWidth: 760 }}>
        <h1 style={{ margin: 0 }}>{t('about.title')}</h1>
        <p style={{ margin: '0.75rem 0', color: 'var(--muted)', lineHeight: 1.6 }}>{t('about.subtitle')}</p>
      </header>

      <section style={{ marginTop: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--card)' }}>
          <h3 style={{ marginTop: 0 }}>{t('about.values')}</h3>
          <ul style={{ paddingLeft: '1.1rem', margin: '0.5rem 0 0', color: 'var(--text)', lineHeight: 1.6 }}>
            <li>{t('about.value1')}</li>
            <li>{t('about.value2')}</li>
            <li>{t('about.value3')}</li>
          </ul>
        </div>
        <div style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--card)', display: 'grid', gap: '0.75rem' }}>
          <h3 style={{ margin: 0 }}>{t('about.mission')}</h3>
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            WhiteLabel соединяет команды с лучшими цифровыми инструментами, убирая шум и экономя время. Мы тестируем, документируем и собираем фидбек, чтобы каждая покупка была уверенной.
          </p>
          <Link to="/products" className="wl-btn wl-btn--primary" style={{ justifyContent: 'center' }}>
            {t('about.cta')}
          </Link>
        </div>
      </section>
    </div>
  );
}
