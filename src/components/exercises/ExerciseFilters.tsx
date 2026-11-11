import React from 'react';
import { ExerciseFilterCategory } from '../../types/exercise';

interface ExerciseFiltersProps {
  selectedCategory: ExerciseFilterCategory;
  onSelectCategory: (category: ExerciseFilterCategory) => void;
  counts: Record<ExerciseFilterCategory, number>;
}

const FILTER_OPTIONS: { id: ExerciseFilterCategory; label: string }[] = [
  { id: 'todos', label: 'Todos los ejercicios' },
  { id: 'movilidad-inicial', label: 'Movilidad inicial' },
  { id: 'movilidad-asistida', label: 'Movilidad asistida' },
  { id: 'movilidad-activa', label: 'Movilidad activa' },
  { id: 'progresion-autorizada', label: 'Progresión autorizada' }
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
      className="flex flex-wrap items-center gap-2 mb-6 no-print"
    >
      {FILTER_OPTIONS.map((option) => {
        const active = selectedCategory === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectCategory(option.id)}
            aria-pressed={active}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
              active
                ? 'bg-brand-navy text-white shadow-soft'
                : 'bg-white text-brand-text border border-slate-200/90 hover:bg-brand-soft/50 hover:border-brand-teal/40'
            }`}
          >
            <span>{option.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                active ? 'bg-brand-teal text-white' : 'bg-brand-soft text-brand-navy'
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
