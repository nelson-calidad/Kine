import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  backTo?: string;
  backLabel?: string;
  rightSlot?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  backTo = '/',
  backLabel = 'Volver al inicio',
  rightSlot
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 no-print">
        <Link
          to={backTo}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-brand-navy border border-slate-200/90 shadow-sm hover:bg-brand-soft/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{backLabel}</span>
        </Link>
        {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
      </div>

      {badge && (
        <span className="inline-block mb-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-navy">
          {badge}
        </span>
      )}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-navy leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2.5 text-base sm:text-lg text-brand-muted max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
