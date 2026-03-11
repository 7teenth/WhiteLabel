import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { useI18n } from '../lib/i18n';
import { searchCities, getWarehouses } from '../lib/novaposhta';

type ShippingForm = {
  name: string;
  email: string;
  phone: string;
  city: string;
  cityRef: string | null;
  warehouseRef: string | null;
  address: string;
};

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { t } = useI18n();

  const [shipping, setShipping] = useState<ShippingForm>({
    name: '',
    email: '',
    phone: '',
    city: '',
    cityRef: null,
    warehouseRef: null,
    address: '',
  });
  const [cityResults, setCityResults] = useState<{ label: string; ref: string; warehouses: number }[]>([]);
  const [warehouses, setWarehouses] = useState<{ label: string; ref: string; short: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [cityTimer, setCityTimer] = useState<number | null>(null);

  const hasItems = items.length > 0;
  const formattedTotal = useMemo(() => total.toFixed(2), [total]);

  // debounced city search
  useEffect(() => {
    if (cityTimer) window.clearTimeout(cityTimer);
    if (shipping.city.trim().length < 2) {
      setCityResults([]);
      return;
    }
    const timer = window.setTimeout(async () => {
      try {
        setLoadingCities(true);
        const results = await searchCities(shipping.city.trim());
        setCityResults(results);
      } catch {
        setCityResults([]);
      } finally {
        setLoadingCities(false);
      }
    }, 350);
    setCityTimer(timer);
    return () => window.clearTimeout(timer);
  }, [shipping.city]);

  // warehouses fetch
  useEffect(() => {
    const ref = shipping.cityRef;
    if (!ref) {
      setWarehouses([]);
      return;
    }
    (async () => {
      try {
        setLoadingWarehouses(true);
        const ws = await getWarehouses(ref);
        setWarehouses(ws);
      } catch {
        setWarehouses([]);
      } finally {
        setLoadingWarehouses(false);
      }
    })();
  }, [shipping.cityRef]);

  const handleCityPick = (ref: string, label: string) => {
    setShipping((s) => ({ ...s, cityRef: ref, city: label, warehouseRef: null }));
    setCityResults([]);
  };

  const handleWarehousePick = (ref: string | null) => {
    setShipping((s) => ({ ...s, warehouseRef: ref }));
  };

  if (!hasItems) {
    return (
      <div className="container cart-layout">
        <h1 style={{ marginTop: 0 }}>{t('cart.title')}</h1>
        <p>{t('cart.empty')}</p>
        <Link to="/products" className="wl-link">
          {t('cart.empty.cta')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-layout">
      <h1 style={{ marginTop: 0 }}>{t('cart.title')}</h1>
      <div className="cart-grid">
        <section className="cart-card cart-card--items">
          <div className="cart-list">
            {items.map((item) => (
              <div key={item.productId} className="cart-item">
                <img src={item.imageUrl || '/placeholder.png'} alt={item.name} className="cart-item__img" />
                <div className="cart-item__body">
                  <Link to={`/products/${item.slug}`} className="cart-item__title">
                    {item.name}
                  </Link>
                  <div className="cart-item__controls">
                    <label className="cart-qty">
                      {t('cart.qty')}
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                      />
                    </label>
                    <button type="button" className="cart-remove" onClick={() => removeItem(item.productId)}>
                      {t('cart.remove')}
                    </button>
                  </div>
                </div>
                <div className="cart-item__price">${(item.unitPrice * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cart-summary">
          <div className="summary-card">
            <div className="summary-row">
              <span>{t('cart.total')}</span>
              <strong>${formattedTotal}</strong>
            </div>
            <p className="muted small">Доставка по тарифам Новой Почты при получении.</p>
          </div>

          <div className="cart-card cart-card--form">
            <div className="review-form__header">
              <h3>Доставка</h3>
              <span className="pill">Nova Poshta API</span>
            </div>
            <form className="shipping-form">
              <label>
                Имя
                <input
                  value={shipping.name}
                  onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Имя получателя"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={shipping.email}
                  onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Телефон
                <input
                  type="tel"
                  value={shipping.phone}
                  onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="+380..."
                />
              </label>
              <label>
                Город (НП)
                <input
                  value={shipping.city}
                  onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value, cityRef: null, warehouseRef: null }))}
                  placeholder="Введите 2+ буквы"
                />
                {loadingCities ? <span className="muted small">Загрузка…</span> : null}
                {!loadingCities && cityResults.length > 0 && (
                  <ul className="suggest-list">
                    {cityResults.map((c) => (
                      <li key={c.ref}>
                        <button type="button" onClick={() => handleCityPick(c.ref, c.label)}>
                          {c.label} · {c.warehouses} отделений
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </label>
              <label>
                Отделение / почтомат
                <select
                  disabled={!warehouses.length}
                  value={shipping.warehouseRef ?? ''}
                  onChange={(e) => handleWarehousePick(e.target.value || null)}
                >
                  <option value="">{loadingWarehouses ? 'Загрузка…' : 'Выберите отделение'}</option>
                  {warehouses.map((w) => (
                    <option key={w.ref} value={w.ref}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Адрес (для курьера)
                <input
                  value={shipping.address}
                  onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                  placeholder="Улица, дом, квартира"
                />
              </label>
              <div className="review-form__actions" style={{ justifyContent: 'space-between' }}>
                <div className="muted small">Оплата и создание ТТН не подключены — собираем данные доставки.</div>
                <button type="button" className="wl-btn wl-btn--primary">
                  Сохранить доставку
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
