import React, { useState, useMemo } from 'react';
import { Printer } from 'lucide-react';
import { EXERCISES_DATA } from '../data/exercises';
import { ExerciseFilterCategory } from '../types/exercise';
import { SectionHeader } from '../components/common/SectionHeader';
import { ExerciseFilters } from '../components/exercises/ExerciseFilters';
import { ExerciseCard } from '../components/exercises/ExerciseCard';
import { EmptyState } from '../components/common/EmptyState';

export const ExercisesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ExerciseFilterCategory>('todos');

  const counts = useMemo(() => {
    return {
      todos: EXERCISES_DATA.length,
      'movilidad-inicial': EXERCISES_DATA.filter((e) => e.filterCategory === 'movilidad-inicial').length,
      'movilidad-asistida': EXERCISES_DATA.filter((e) => e.filterCategory === 'movilidad-asistida').length,
      'movilidad-activa': EXERCISES_DATA.filter((e) => e.filterCategory === 'movilidad-activa').length,
      'progresion-autorizada': EXERCISES_DATA.filter((e) => e.filterCategory === 'progresion-autorizada').length
    };
  }, []);

  const filteredExercises = useMemo(() => {
    if (selectedCategory === 'todos') {
      return EXERCISES_DATA;
    }
    return EXERCISES_DATA.filter((exercise) => exercise.filterCategory === selectedCategory);
  }, [selectedCategory]);

  return (
    <div>
      <SectionHeader
        badge="Recuperación de la flexión · LCA (HTH)"
        title="Mis ejercicios"
        subtitle="Recuperá tu movilidad, paso a paso."
        rightSlot={
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-navy shadow-sm hover:bg-brand-soft/40 transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-brand-teal" aria-hidden="true" />
            <span>Imprimir cartilla</span>
          </button>
        }
      />

      <ExerciseFilters
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        counts={counts}
      />

      {filteredExercises.length === 0 ? (
        <EmptyState
          title="No hay ejercicios en esta categoría"
          description="Podés volver a mostrar los cinco ejercicios principales de la biblioteca."
          actionLabel="Mostrar todos"
          onAction={() => setSelectedCategory('todos')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          {filteredExercises.map((exercise, idx) => {
            const globalIndex = EXERCISES_DATA.findIndex((item) => item.id === exercise.id);
            const nextExercise =
              EXERCISES_DATA[(globalIndex + 1) % EXERCISES_DATA.length];
            const isOddLast =
              filteredExercises.length > 1 &&
              filteredExercises.length % 2 === 1 &&
              idx === filteredExercises.length - 1;

            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                indexNumber={globalIndex + 1}
                nextExerciseId={nextExercise?.id}
                featured={isOddLast}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
