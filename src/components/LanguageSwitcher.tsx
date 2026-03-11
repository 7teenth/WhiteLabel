import { useEffect, useRef, useState } from 'react';
import { useI18n, Language } from '../lib/i18n';

const languages: { code: Language; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'uk', label: 'Українська', short: 'UK' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
];

export function LanguageSwitcher() {
  const { lang, setLanguage } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const current = languages.find((item) => item.code === lang);
  const currentShort = current?.short ?? 'Lang';

  return (
    <div className={open ? 'wl-lang wl-lang--open' : 'wl-lang'} ref={ref}>
      <button
        type="button"
        className="wl-lang__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {currentShort}
        <span className="wl-lang__chevron" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <div role="listbox" className="wl-lang__menu">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={item.code === lang}
              onClick={() => {
                setLanguage(item.code);
                setOpen(false);
              }}
              className={item.code === lang ? 'wl-lang__option wl-lang__option--active' : 'wl-lang__option'}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
