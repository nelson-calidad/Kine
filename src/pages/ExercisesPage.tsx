import React, { useState, useMemo } from 'react';
import { Printer, Layers, LayoutGrid } from 'lucide-react';
import { EXERCISES_DATA } from '../data/exercises';
import { ExerciseFilterCategory } from '../types/exercise';
import { SectionHeader } from '../components/common/SectionHeader';
import { ExerciseFilters } from '../components/exercises/ExerciseFilters';
import { ExerciseCarousel } from '../components/exercises/ExerciseCarousel';
import { ExerciseCard } from '../components/exercises/ExerciseCard';
import { EmptyState } from '../components/common/EmptyState';

export const ExercisesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ExerciseFilterCategory>('todos');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  const counts = useMemo(() => {
    return {
      todos: EXERCISES_DATA.length,
      'movilidad-inicial': EXERCISES_DATA.filter((e) => e.filterCategory === 'movilidad-inicial')
        .length,
      'movilidad-asistida': EXERCISES_DATA.filter((e) => e.filterCategory === 'movilidad-asistida')
        .length,
      'movilidad-activa': EXERCISES_DATA.filter((e) => e.filterCategory === 'movilidad-activa')
        .length,
      'progresion-autorizada': EXERCISES_DATA.filter(
        (e) => e.filterCategory === 'progresion-autorizada'
      ).length
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
        title="Mis ejercicios en 3D"
        subtitle="Deslizá el carrusel 3D interactivo o explorá la grilla completa."
        rightSlot={
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                aria-pressed={viewMode === 'carousel'}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-electric-iris text-bone-white shadow-[0_0_16px_rgba(128,82,255,0.45)]'
                    : 'text-ash-gray hover:text-bone-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Carrusel 3D</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-electric-iris text-bone-white shadow-[0_0_16px_rgba(128,82,255,0.45)]'
                    : 'text-ash-gray hover:text-bone-white'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Grilla</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-bone-white hover:border-electric-iris transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-saffron-spark" aria-hidden="true" />
              <span>Imprimir</span>
            </button>
          </div>
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
        <>
          {viewMode === 'carousel' ? (
            <div className="no-print">
              <ExerciseCarousel exercises={filteredExercises} />
            </div>
          ) : null}

          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2'
                : 'hidden print:grid print:grid-cols-1 print:gap-5'
            }
          >
            {filteredExercises.map((exercise, idx) => {
              const globalIndex = EXERCISES_DATA.findIndex((item) => item.id === exercise.id);
              const nextExercise = EXERCISES_DATA[(globalIndex + 1) % EXERCISES_DATA.length];
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
        </>
      )}
    </div>
  );
};
