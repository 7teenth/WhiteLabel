import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { InlineError } from '../components/InlineError';
import { useI18n } from '../lib/i18n';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage('Check your email for the reset link.');
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ maxWidth: 460, margin: '0 auto', padding: '2rem', background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}>
        <h1 style={{ marginTop: 0 }}>{t('reset.title')}</h1>
        <p style={{ marginTop: 0, marginBottom: '1.25rem' }}>{t('reset.subtitle')}</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label>
            {t('reset.email')}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem 0.75rem', marginTop: 6, borderRadius: 8, border: '1px solid rgba(0,0,0,0.2)' }}
            />
          </label>

          {error ? <InlineError message={error} /> : null}
          {message ? <div style={{ color: 'green' }}>{message}</div> : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 10,
              border: 'none',
              background: '#0070f3',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {loading ? t('reset.submit.loading') : t('reset.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
