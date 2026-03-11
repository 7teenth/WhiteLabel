import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useReviews } from '../hooks/useReviews';
import { Spinner } from '../components/Spinner';
import { useCart } from '../lib/cart';
import { useI18n } from '../lib/i18n';
import { showToast } from '../components/Toast';
import { getPublicImageUrl } from '../lib/storage';
import { supabase } from '../lib/supabaseClient';
const isHttp = (v: string) => /^https?:\/\//i.test(v);

export default function ProductPage() {
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug ?? '');
  const { reviews, loading: reviewsLoading } = useReviews(product?.id);
  const { addItem } = useCart();
  const { t } = useI18n();
  const [currentImage, setCurrentImage] = useState(0);
  const placeholder = '/placeholder.png';
  const [mainSrc, setMainSrc] = useState<string>(placeholder);
  const [gallerySrcs, setGallerySrcs] = useState<string[]>([placeholder]);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const avgRating = product?.rating ?? 0;

  const gallery = useMemo(() => {
    if (!product) return [];
    const base = [];
    if (product.image) base.push(product.image);
    if (Array.isArray(product.images)) base.push(...product.images.filter(Boolean));
    const urls = base
      .slice(0, 8)
      .map((src) => {
        if (!src) return placeholder;
        const candidates = [];
        if (!isHttp(src)) candidates.push(`/${src}`);
        const storageUrl = getPublicImageUrl(src);
        if (storageUrl) candidates.push(storageUrl);
        candidates.push(placeholder);
        return candidates[0];
      })
      .filter(Boolean);
    const uniq = Array.from(new Set(urls));
    if (!uniq.length) return [placeholder];
    if (uniq.length === 1 && uniq[0] === placeholder) return [placeholder];
    return uniq.filter((u) => u !== placeholder).length
      ? uniq.filter(Boolean)
      : [placeholder];
  }, [product]);

  // Sync gallery state when product changes
  useEffect(() => {
    setGallerySrcs(gallery.length ? gallery : [placeholder]);
    setCurrentImage(0);
  }, [gallery]);

  // Sync main image with current index
  useEffect(() => {
    setMainSrc(gallerySrcs[currentImage] ?? placeholder);
  }, [gallerySrcs, currentImage]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, 1);
    showToast(t('toast.added'));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmittingReview(true);
    const { error: insertError } = await supabase.from('reviews').insert({
      product_id: product.id,
      author: reviewForm.author || null,
      rating: reviewForm.rating,
      comment: reviewForm.comment || null,
      status: 'pending',
    });
    setSubmittingReview(false);
    if (insertError) {
      if ((insertError as any).code === 'PGRST301' || insertError.message?.includes('Unauthorized') || insertError.message?.includes('401')) {
        showToast(t('product.reviews.login'));
      } else {
        showToast('Не удалось отправить отзыв');
      }
      return;
    }
    setReviewForm({ author: '', rating: 5, comment: '' });
    showToast('Отзыв отправлен на модерацию');
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % gallery.length);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <p style={{ color: '#b00020' }}>{t('product.error')}</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="product-page">
        <div className="product-gallery">
          <div className="product-gallery__main">
            <img
              src={mainSrc}
              alt={product.title}
              loading="lazy"
              onError={() => {
                setMainSrc(placeholder);
                setGallerySrcs([placeholder]);
                setCurrentImage(0);
              }}
            />
            {gallery.length > 1 && (
              <>
                <button type="button" className="product-gallery__nav product-gallery__nav--prev" onClick={handlePrev} aria-label="Previous image">
                  ‹
                </button>
                <button type="button" className="product-gallery__nav product-gallery__nav--next" onClick={handleNext} aria-label="Next image">
                  ›
                </button>
              </>
            )}
            {gallery.length > 1 && (
              <div className="product-gallery__dots">
                {gallerySrcs.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={idx === currentImage ? 'dot dot--active' : 'dot'}
                    onClick={() => setCurrentImage(idx)}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="product-gallery__thumbs">
              {gallerySrcs.map((src, idx) => (
                <button
                  key={src + idx}
                  type="button"
                  className={idx === currentImage ? 'thumb thumb--active' : 'thumb'}
                  onClick={() => setCurrentImage(idx)}
                >
                  <img
                    src={src}
                    alt={`${product.title} ${idx + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.src = placeholder;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-head">
            <div>
              <p className="product-breadcrumb">{product.category ?? 'Catalog'}</p>
              <h1>{product.title}</h1>
            </div>
            <div className="product-price">
              <span>${product.price.toFixed(2)}</span>
              {product.old_price ? <s>${product.old_price.toFixed(2)}</s> : null}
            </div>
          </div>

          <p className="product-desc">{product.description ?? t('product.description.fallback')}</p>

          <div className="product-meta">
            {product.rating ? (
              <span className="product-pill">★ {product.rating.toFixed(1)}</span>
            ) : null}
            {product.reviews_count ? <span className="product-pill">{product.reviews_count} {t('product.reviews')}</span> : null}
            {product.stock != null ? (
              <span className={product.stock > 0 ? 'product-pill product-pill--success' : 'product-pill product-pill--muted'}>
                {product.stock > 0 ? t('filters.inStock') : t('filters.outOfStock')}
              </span>
            ) : null}
          </div>

          <div className="product-actions">
            <button type="button" className="wl-btn wl-btn--primary wl-btn--lg" onClick={handleAddToCart}>
              {t('product.add')}
            </button>
            <div className="product-delivery">
              <span>Free returns · Secure checkout</span>
              <small>Ships in 24h</small>
            </div>
          </div>

        </div>
      </div>
      <section className="product-tabs product-tabs--full">
        <div className="product-tabs__nav">
          <button
            type="button"
            className={activeTab === 'desc' ? 'tab tab--active' : 'tab'}
            onClick={() => setActiveTab('desc')}
          >
            {t('product.details')}
          </button>
          <button
            type="button"
            className={activeTab === 'specs' ? 'tab tab--active' : 'tab'}
            onClick={() => setActiveTab('specs')}
          >
            Specs
          </button>
          <button
            type="button"
            className={activeTab === 'reviews' ? 'tab tab--active' : 'tab'}
            onClick={() => setActiveTab('reviews')}
          >
            {t('product.reviews')}
          </button>
        </div>

        {activeTab === 'desc' && (
          <div className="tab-panel">
            <p>{product.description ?? t('product.description.fallback')}</p>
          </div>
        )}

        {activeTab === 'specs' && (
          <ul className="spec-list">
            <li>
              <span className="spec-label">Category</span>
              <span className="spec-value">{product.category ?? '—'}</span>
            </li>
            <li>
              <span className="spec-label">Price</span>
              <span className="spec-value">${product.price.toFixed(2)}</span>
            </li>
            <li>
              <span className="spec-label">Stock</span>
              <span className="spec-value">{product.stock ?? '—'}</span>
            </li>
            <li>
              <span className="spec-label">Added</span>
              <span className="spec-value">{product.created_at ? new Date(product.created_at).toLocaleDateString() : '—'}</span>
            </li>
            <li>
              <span className="spec-label">ID</span>
              <span className="spec-value">{product.id}</span>
            </li>
          </ul>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <div className="reviews-card reviews-card--stats">
              <div className="reviews-avg">
                <span className="reviews-avg__number">★ {(avgRating || 0).toFixed(1)}</span>
                <span className="muted">{reviews.length} {t('product.reviews')}</span>
              </div>
              <div className="rating-stars rating-stars--display" aria-label="Средняя оценка">
                {[1, 2, 3, 4, 5].map((star) => {
                  const fill = Math.min(1, Math.max(0, avgRating - (star - 1)));
                  return (
                    <span key={star} className="star star--display">
                      ★
                      <span className="star__fill" style={{ width: `${fill * 100}%` }}>★</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="reviews-card">
              <h3>Отзывы</h3>
              {reviewsLoading ? (
                <p className="muted">Loading…</p>
              ) : reviews.length ? (
                <ul className="reviews-list">
                  {reviews.map((review) => (
                    <li key={review.id}>
                      <div className="review-head">
                        <span className="review-author">{review.author || 'Anonymous'}</span>
                        <span className="review-rating">★ {review.rating.toFixed(1)}</span>
                      </div>
                      <p className="review-comment">{review.comment || t('product.description.fallback')}</p>
                      <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">{t('product.reviews')}: 0. Оставьте первый отзыв.</p>
              )}
            </div>
            <div className="reviews-card reviews-card--form">
              <div className="review-form__header">
                <h3>{t('product.reviews.leave')}</h3>
                <span className="pill">{t('product.reviews.pending')}</span>
              </div>
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <div className="review-form__row">
                <div className="review-form__field">
                  <label htmlFor="review-name">Имя</label>
                  <input
                    id="review-name"
                    type="text"
                      value={reviewForm.author}
                      onChange={(e) => setReviewForm((f) => ({ ...f, author: e.target.value }))}
                      placeholder="Ваше имя"
                    />
                  </div>
                </div>
                <div className="review-form__field review-form__field--compact">
                  <span className="field-label">Оценка</span>
                  <div className="rating-stars" role="group" aria-label="Оценка">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={reviewForm.rating >= star ? 'star star--active' : 'star'}
                        onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                        aria-label={`${star} из 5`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="review-form__field">
                  <label htmlFor="review-comment">Комментарий</label>
                  <textarea
                    id="review-comment"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    placeholder="Коротко о впечатлениях"
                  />
                </div>
                <div className="review-form__actions">
                  <button type="submit" className="wl-btn wl-btn--primary" disabled={submittingReview}>
                    {submittingReview ? 'Отправляем…' : t('product.reviews.submit')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
