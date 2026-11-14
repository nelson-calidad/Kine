import React, { useState } from 'react';
import { Printer } from 'lucide-react';
import { EXERCISES_DATA } from '../data/exercises';
import { ExerciseCard } from '../components/exercises/ExerciseCard';
import { ExerciseModal } from '../components/exercises/ExerciseModal';

export const ExercisesPage: React.FC = () => {
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#1E394B] pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#25C8CC] block mb-1">
            REHABILITACIÓN · LCA / HTH
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#F1F7FA] tracking-tight">
            Tus ejercicios
          </h1>
          <p className="mt-0.5 text-sm text-[#A7B9C6]">
            Movilidad y recuperación funcional
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          <p className="hidden md:block text-xs text-[#A7B9C6] max-w-xs text-right">
            Tocá cualquier tarjeta para abrir su vista ampliada. Sujeto a indicación profesional.
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[#1E394B] bg-[#0B2030] px-3.5 py-1.5 text-xs font-medium text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-[#25C8CC]" aria-hidden="true" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Cuadrícula unificada responsive: 1 col en móvil, 2 en tablet, 3 en escritorio */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {EXERCISES_DATA.map((exercise, idx) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            indexNumber={idx + 1}
            onExpand={() => setSelectedExerciseIndex(idx)}
          />
        ))}
      </div>

      <ExerciseModal
        exercises={EXERCISES_DATA}
        activeIndex={selectedExerciseIndex}
        onClose={() => setSelectedExerciseIndex(null)}
        onSelectIndex={(idx) => setSelectedExerciseIndex(idx)}
      />
    </div>
  );
};
