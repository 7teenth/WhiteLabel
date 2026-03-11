import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import logo from '../assets/logo.png';

const navItems = (
  t: ReturnType<typeof useI18n>['t'],
): { to: string; label: string }[] => [
  { to: '/products', label: t('nav.products') },
  { to: '/cart', label: t('nav.cart') },
  { to: '/about', label: t('nav.about') },
];

const getActiveClass = (isActive: boolean) =>
  isActive ? 'wl-nav__link wl-nav__link--active' : 'wl-nav__link';

export function NavBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  const initials = useMemo(() => {
    if (!user?.email) return 'WL';
    return user.email.slice(0, 2).toUpperCase();
  }, [user?.email]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const links = navItems(t);

  return (
    <header className="wl-header">
      <div className="wl-header__glow" />
      <div className="container wl-header__inner">
        <Link to="/" className="wl-brand" aria-label="WhiteLabel">
          <div className="wl-brand__mark wl-brand__mark--img">
            <img src={logo} alt="WhiteLabel" />
          </div>
          <div className="wl-brand__text">
            <span className="wl-brand__name">{t('brand.name')}</span>
            <span className="wl-brand__tagline">{t('brand.tagline')}</span>
          </div>
        </Link>

        <nav className="wl-nav" aria-label="Main menu">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => getActiveClass(isActive)}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="wl-actions">
          {user ? (
            <div className="wl-user">
              <div className="wl-avatar" aria-hidden>{initials}</div>
              <div className="wl-user__meta">
                <span className="wl-user__email">{user.email}</span>
                <button type="button" className="wl-btn wl-btn--ghost" onClick={handleSignOut}>
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          ) : (
            <div className="wl-auth">
              <NavLink to="/login" className={({ isActive }) => getActiveClass(isActive)}>
                {t('nav.login')}
              </NavLink>
              <NavLink to="/register" className="wl-btn wl-btn--primary">
                {t('nav.signup')}
              </NavLink>
            </div>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
