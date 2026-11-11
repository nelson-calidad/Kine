import React from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SafetyNoticeProps {
  title?: string;
  message: string;
  variant?: 'info' | 'warning' | 'danger';
  showAlertsLink?: boolean;
  className?: string;
}

export const SafetyNotice: React.FC<SafetyNoticeProps> = ({
  title,
  message,
  variant = 'info',
  showAlertsLink = false,
  className = ''
}) => {
  const styles = {
    info: {
      container: 'bg-brand-soft/60 border-brand-teal/40 text-brand-text',
      iconBox: 'bg-brand-navy text-white',
      IconComponent: Info
    },
    warning: {
      container: 'bg-amber-50 border-brand-warning/40 text-brand-text',
      iconBox: 'bg-brand-warning text-white',
      IconComponent: AlertTriangle
    },
    danger: {
      container: 'bg-rose-50 border-brand-danger/45 text-brand-text',
      iconBox: 'bg-brand-danger text-white',
      IconComponent: ShieldAlert
    }
  }[variant];

  const IconComponent = styles.IconComponent;

  return (
    <aside
      role="note"
      aria-label={title || 'Aviso importante de seguridad'}
      className={`rounded-card border p-4 sm:p-5 ${styles.container} ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.iconBox}`}>
          <IconComponent className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex-1 text-sm sm:text-base leading-relaxed">
          {title && <p className="font-bold text-brand-navy mb-1">{title}</p>}
          <p className="text-brand-text">{message}</p>
          {showAlertsLink && (
            <div className="mt-3">
              <Link
                to="/alertas"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-brand-danger border border-brand-danger/30 hover:bg-rose-50 transition-colors"
              >
                <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                Consultar señales de alarma
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
