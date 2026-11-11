import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InfoCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  variant?: 'default' | 'soft' | 'warning' | 'danger';
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  subtitle,
  badge,
  icon,
  children,
  collapsible = false,
  defaultExpanded = true,
  variant = 'default',
  className = ''
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const variantClasses = {
    default: 'bg-brand-white border-slate-200/80',
    soft: 'bg-brand-soft/45 border-brand-teal/25',
    warning: 'bg-amber-50/70 border-brand-warning/30',
    danger: 'bg-rose-50/75 border-brand-danger/30'
  }[variant];

  return (
    <article
      className={`rounded-card border p-5 sm:p-6 shadow-soft transition-all duration-200 ${variantClasses} ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          {icon && (
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-navy">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            {badge && (
              <span className="inline-block mb-1.5 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand-navy">
                {badge}
              </span>
            )}
            <h3 className="text-lg font-bold text-brand-navy leading-snug">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-brand-muted leading-relaxed">{subtitle}</p>}
          </div>
        </div>

        {collapsible && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 text-brand-navy hover:bg-brand-soft/50 transition-colors"
            aria-label={expanded ? `Contraer ${title}` : `Expandir ${title}`}
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        )}
      </div>

      {(!collapsible || expanded) && <div className="mt-4 pt-3 border-t border-slate-100">{children}</div>}
    </article>
  );
};
