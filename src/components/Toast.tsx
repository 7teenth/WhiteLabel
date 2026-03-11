import { useEffect, useState } from 'react';

export type ToastMessage = {
  id: number;
  text: string;
};

export function showToast(text: string) {
  window.dispatchEvent(new CustomEvent('wl:toast', { detail: { text } }));
}

export function ToastHub() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    let nextId = 1;

    const handleToast = (event: Event) => {
      const custom = event as CustomEvent<{ text?: string }>;
      const text = custom.detail?.text;
      if (!text) return;
      const id = nextId++;
      setToasts((prev) => [...prev, { id, text }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 2500);
    };

    window.addEventListener('wl:toast', handleToast);
    return () => window.removeEventListener('wl:toast', handleToast);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="wl-toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="wl-toast">
          {toast.text}
        </div>
      ))}
    </div>
  );
}
