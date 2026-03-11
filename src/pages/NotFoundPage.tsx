import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
      <h1 style={{ marginTop: 0 }}>{t('notfound.title')}</h1>
      <p>{t('notfound.subtitle')}</p>
      <Link to="/" style={{ color: '#0070f3' }}>
        {t('notfound.cta')}
      </Link>
    </div>
  );
}
