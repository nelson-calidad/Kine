import React from 'react';
import { ExerciseFilterCategory } from '../../types/exercise';

interface ExerciseFiltersProps {
  selectedCategory: ExerciseFilterCategory;
  onSelectCategory: (category: ExerciseFilterCategory) => void;
  counts: Record<ExerciseFilterCategory, number>;
}

const FILTER_OPTIONS: { id: ExerciseFilterCategory; label: string; shortLabel: string }[] = [
  { id: 'todos', label: 'Todos', shortLabel: 'Todos' },
  { id: 'movilidad-inicial', label: 'Movilidad inicial', shortLabel: 'Inicial' },
  { id: 'movilidad-asistida', label: 'Movilidad asistida', shortLabel: 'Asistida' },
  { id: 'movilidad-activa', label: 'Movilidad activa', shortLabel: 'Activa' },
  { id: 'progresion-autorizada', label: 'Progresión', shortLabel: 'Progresión' }
];

export const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  counts
}) => {
  return (
    <div
      role="group"
      aria-label="Filtrar ejercicios por categoría"
      className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-4 sm:mb-5 no-print"
    >
      {FILTER_OPTIONS.map((option) => {
        const active = selectedCategory === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectCategory(option.id)}
            aria-pressed={active}
            className={`inline-flex shrink-0 min-h-[36px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
              active
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white text-brand-muted border border-slate-200/85 hover:text-brand-navy hover:border-brand-teal/40'
            }`}
          >
            <span className="sm:hidden">{option.shortLabel}</span>
            <span className="hidden sm:inline">{option.label}</span>
            <span
              className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-extrabold ${
                active ? 'bg-white/20 text-white' : 'bg-brand-soft/80 text-brand-navy'
              }`}
            >
              {counts[option.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
};
