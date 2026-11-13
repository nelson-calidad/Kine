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
            className={`inline-flex shrink-0 min-h-[36px] items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              active
                ? 'bg-electric-iris text-bone-white shadow-[0_0_20px_rgba(128,82,255,0.4)]'
                : 'bg-white/[0.03] text-ash-gray border border-white/10 hover:text-bone-white hover:border-white/25'
            }`}
          >
            <span className="sm:hidden">{option.shortLabel}</span>
            <span className="hidden sm:inline">{option.label}</span>
            <span
              className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                active ? 'bg-white/20 text-white' : 'bg-white/10 text-saffron-spark'
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
