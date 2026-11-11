import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="rounded-card border border-dashed border-slate-300 bg-white p-8 text-center shadow-soft">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-navy">
        <FolderOpen className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-brand-navy">{title}</h3>
      <p className="mt-1.5 text-sm text-brand-muted max-w-md mx-auto leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
