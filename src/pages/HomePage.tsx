import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/ProductGrid';
import { Spinner } from '../components/Spinner';
import { useI18n } from '../lib/i18n';

export default function HomePage() {
  const { products, loading, error } = useProducts({ limit: 8 });
  const { t } = useI18n();

  return (
    <div className="container">
      <section className="wl-hero">
        <div className="wl-hero__copy">
          <p className="wl-pill">{t('home.pill')}</p>
          <h1>{t('home.title')}</h1>
          <p className="wl-hero__lead">{t('home.subtitle')}</p>
          <div className="wl-hero__actions">
            <Link to="/products" className="wl-btn wl-btn--primary wl-btn--lg">
              {t('home.cta')}
            </Link>
            <Link to="/about" className="wl-btn wl-btn--ghost wl-btn--lg">
              {t('nav.about')}
            </Link>
          </div>
          <div className="wl-hero__stats">
            <div className="wl-stat">
              <div className="wl-stat__value">240+</div>
              <div className="wl-stat__label">{t('home.stats.tools')}</div>
            </div>
            <div className="wl-stat">
              <div className="wl-stat__value">4.8/5</div>
              <div className="wl-stat__label">{t('home.stats.rating')}</div>
            </div>
            <div className="wl-stat">
              <div className="wl-stat__value">120+</div>
              <div className="wl-stat__label">{t('home.stats.creators')}</div>
            </div>
          </div>
        </div>
        <div className="wl-hero__card">
          <div className="wl-hero__card-header">
            <span className="wl-pill wl-pill--soft">{t('home.featuredDrop.title')}</span>
            <span className="wl-dot" />
          </div>
          <h3>{t('home.featuredDrop.headline')}</h3>
          <p>{t('home.featuredDrop.desc')}</p>
          <div className="wl-hero__chips">
            <span className="wl-chip">{t('home.featuredDrop.chip1')}</span>
            <span className="wl-chip">{t('home.featuredDrop.chip2')}</span>
            <span className="wl-chip">{t('home.featuredDrop.chip3')}</span>
          </div>
          <Link to="/products" className="wl-btn wl-btn--primary" style={{ marginTop: '1rem' }}>
            {t('home.featuredDrop.cta')}
          </Link>
        </div>
      </section>

      <section className="wl-section">
        <div className="wl-section__head">
          <h2>{t('home.featured')}</h2>
          <Link to="/products" className="wl-link">{t('home.viewAll')}</Link>
        </div>
        {loading ? (
          <div className="wl-center"><Spinner /></div>
        ) : error ? (
          <p className="wl-error">{error}</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>

      <section className="wl-section">
        <h2>{t('home.why')}</h2>
        <div className="wl-features">
          <article className="wl-feature">
            <h3>{t('home.highlight1.title')}</h3>
            <p>{t('home.highlight1.body')}</p>
          </article>
          <article className="wl-feature">
            <h3>{t('home.highlight2.title')}</h3>
            <p>{t('home.highlight2.body')}</p>
          </article>
          <article className="wl-feature">
            <h3>{t('home.highlight3.title')}</h3>
            <p>{t('home.highlight3.body')}</p>
          </article>
        </div>
      </section>
    </div>
  );
}
