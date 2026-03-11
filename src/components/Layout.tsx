import React from 'react';
import { NavBar } from './NavBar';
import { useI18n } from '../lib/i18n';
import { ThemeToggle } from './ThemeToggle';
import { ToastHub } from './Toast';

export function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="layout">
      <NavBar />
      <main className="page-shell">{children}</main>
      <ToastHub />
      <footer className="site-footer">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <span>
            © {new Date().getFullYear()} WhiteLabel. {t('footer.copy')}
          </span>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  );
}
