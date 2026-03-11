import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/ProductGrid';
import { Spinner } from '../components/Spinner';
import { useI18n } from '../lib/i18n';

const ratingOptions = [
  { value: 0, label: 'Any' },
  { value: 3, label: '3.0+' },
  { value: 4, label: '4.0+' },
  { value: 4.5, label: '4.5+' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') ?? '';
  const { t } = useI18n();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<'new' | 'price-asc' | 'price-desc' | 'rating'>('new');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [availability, setAvailability] = useState<'any' | 'in' | 'out'>('any');

  const { products, loading, error } = useProducts({
    search,
    limit: 48,
    category,
    minRating,
    sort,
    minPrice,
    maxPrice,
    availability,
  });

  const canSubmit = useMemo(() => search.trim().length > 0, [search]);
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchParams(search ? { q: search } : {});
  };

  const resetFilters = () => {
    setCategory('');
    setMinRating(0);
    setSort('new');
    setMaxPrice(200);
    setMinPrice(0);
    setAvailability('any');
  };

  const sliderPercent = useMemo(() => Math.min(100, Math.max(0, (maxPrice / 500) * 100)), [maxPrice]);

  return (
    <div className="container products-layout">
      <aside className="wl-filters">
        <div className="wl-filters__header">
          <h2>{t('filters.title')}</h2>
          <button type="button" className="wl-link" onClick={resetFilters}>
            {t('filters.reset')}
          </button>
        </div>

        <div className="wl-field">
          <label htmlFor="category">{t('filters.category')}</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">{t('filters.any')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="wl-field">
          <label htmlFor="rating">{t('filters.rating')}</label>
          <select
            id="rating"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            {ratingOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="wl-field">
          <label htmlFor="availability">{t('filters.availability')}</label>
          <select
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value as 'any' | 'in' | 'out')}
          >
            <option value="any">{t('filters.any')}</option>
            <option value="in">{t('filters.inStock')}</option>
            <option value="out">{t('filters.outOfStock')}</option>
          </select>
        </div>

        <div className="wl-field">
          <label htmlFor="price">{t('filters.price')}</label>
          <div className="wl-range">
            <input
              id="price"
              type="range"
              min={0}
              max={500}
              step={5}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{
                background: `linear-gradient(90deg, var(--accent) 0%, var(--accent) ${sliderPercent}%, rgba(255,255,255,0.08) ${sliderPercent}%, rgba(255,255,255,0.08) 100%)`,
              }}
            />
          <div className="wl-range__inputs">
            <input
              type="number"
              min={0}
              max={maxPrice}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
              aria-label={t('filters.price.min')}
            />
            <input
              type="number"
              min={minPrice}
              max={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
              aria-label={t('filters.price.max')}
            />
          </div>
          <div className="wl-field__hint">
            {t('filters.price.minLabel', { value: minPrice })} / {t('filters.price.upto', { value: maxPrice })}
          </div>
        </div>
      </div>

      </aside>

      <div>
        <header className="wl-products-head">
          <div>
            <h1 style={{ margin: 0 }}>{t('products.title')}</h1>
            <p style={{ margin: '0.35rem 0 0', maxWidth: 680 }}>{t('products.subtitle')}</p>
          </div>
        </header>

        <form onSubmit={handleSearchSubmit} className="wl-search">
          <label className="visually-hidden" htmlFor="search">
            {t('products.search.label')}
          </label>
          <input
            id="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('products.search.placeholder')}
            className="wl-search__input"
          />
          <button type="submit" className="wl-btn wl-btn--primary wl-btn--lg" disabled={!canSubmit}>
            {t('products.search.button')}
          </button>
        </form>

        <div className="wl-sort-row">
          <label htmlFor="sort-top">{t('filters.sort')}</label>
          <select id="sort-top" value={sort} onChange={(e) => setSort(e.target.value as any)}>
            <option value="new">{t('filters.sort.new')}</option>
            <option value="price-asc">{t('filters.sort.priceAsc')}</option>
            <option value="price-desc">{t('filters.sort.priceDesc')}</option>
            <option value="rating">{t('filters.sort.rating')}</option>
          </select>
        </div>

        {loading ? (
          <div className="wl-center" style={{ padding: '2rem 0' }}>
            <Spinner />
          </div>
        ) : error ? (
          <p className="wl-error">{error}</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
