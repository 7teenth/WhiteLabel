import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { InlineError } from '../components/InlineError';
import { useI18n } from '../lib/i18n';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signUp({ email, password, options: { data: { name } } });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate('/');
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div
        style={{
          maxWidth: 460,
          margin: '0 auto',
          padding: '2rem',
          background: 'var(--card)',
          borderRadius: 12,
          border: '1px solid var(--border)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
        }}
      >
        <h1 style={{ marginTop: 0 }}>{t('register.title')}</h1>
        <p style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--muted)' }}>{t('register.subtitle')}</p>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label>
            {t('register.name')}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            {t('register.email')}
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
            {t('register.password')}
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
            {loading ? t('register.submit.loading') : t('register.submit')}
          </button>
        </form>
        <div style={{ marginTop: '1.25rem', fontSize: '0.95rem' }}>
          <span>{t('register.haveAccount')} </span>
          <Link to="/login" style={{ color: 'var(--accent)' }}>
            {t('register.login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
