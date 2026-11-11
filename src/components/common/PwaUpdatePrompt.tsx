import React, { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

export const PwaUpdatePrompt: React.FC = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      setRegistration(reg);

      if (reg.waiting) {
        setNeedRefresh(true);
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setNeedRefresh(true);
          }
        });
      });
    });
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    setNeedRefresh(false);
    window.location.reload();
  };

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl bg-brand-navy p-4 text-white shadow-soft-lg border border-brand-teal/40 no-print"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <RefreshCw className="h-5 w-5 shrink-0 text-brand-soft mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold">Nueva versión disponible</p>
            <p className="mt-0.5 text-xs text-brand-soft/90">
              Hay una actualización de la guía educativa lista para cargar.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-brand-soft hover:bg-white/10"
          aria-label="Cerrar aviso de actualización"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="min-h-[40px] rounded-xl px-3 py-1.5 text-xs font-semibold text-brand-soft hover:bg-white/10"
        >
          Más tarde
        </button>
        <button
          type="button"
          onClick={handleUpdate}
          className="min-h-[40px] rounded-xl bg-brand-teal px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-teal/90"
        >
          Actualizar ahora
        </button>
      </div>
    </div>
  );
};
