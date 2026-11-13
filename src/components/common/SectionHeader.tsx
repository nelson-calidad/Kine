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
  backLabel = 'Inicio',
  rightSlot
}) => {
  return (
    <div className="mb-5 sm:mb-7">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 no-print">
        <Link
          to={backTo}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-silver-mist border border-white/10 hover:border-electric-iris hover:text-bone-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{backLabel}</span>
        </Link>
        {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
      </div>

      {badge && (
        <span className="block mb-1 text-[10px] font-bold uppercase tracking-widest text-saffron-spark">
          {badge}
        </span>
      )}
      <h1 className="dala-display text-2xl sm:text-4xl text-bone-white">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1.5 text-xs sm:text-sm font-extralight text-silver-mist max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
