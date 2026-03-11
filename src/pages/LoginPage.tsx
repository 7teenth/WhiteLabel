import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { InlineError } from '../components/InlineError';
import { useI18n } from '../lib/i18n';

export default function LoginPage() {
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div
        style={{
          maxWidth: 420,
          margin: '0 auto',
          padding: '2rem',
          background: 'var(--card)',
          borderRadius: 12,
          border: '1px solid var(--border)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
        }}
      >
        <h1 style={{ marginTop: 0 }}>{t('login.title')}</h1>
        <p style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--muted)' }}>{t('login.subtitle')}</p>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label>
            {t('login.email')}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                marginTop: 6,
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
              }}
            />
          </label>
          <label>
            {t('login.password')}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                marginTop: 6,
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
              }}
            />
          </label>

          {error ? <InlineError message={error} /> : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-strong))',
              color: '#0b0811',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(124, 58, 237, 0.3)',
            }}
          >
            {loading ? t('login.submit.loading') : t('login.submit')}
          </button>
        </form>
        <div style={{ marginTop: '1.25rem', fontSize: '0.95rem' }}>
          <span>{t('login.noAccount')} </span>
          <Link to="/register" style={{ color: 'var(--accent)' }}>
            {t('login.signup')}
          </Link>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
          <Link to="/reset-password" style={{ color: 'var(--accent)' }}>
            {t('login.forgot')}
          </Link>
        </div>
      </div>
    </div>
  );
}
