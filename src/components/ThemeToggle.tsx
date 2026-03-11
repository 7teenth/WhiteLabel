import { useTheme } from '../lib/theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button type="button" className="wl-theme" onClick={toggleTheme} aria-label="Toggle theme">
      <span className="wl-theme__icon" aria-hidden>
        {isDark ? '🌙' : '☀️'}
      </span>
      <span className="wl-theme__label">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
