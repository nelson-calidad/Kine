import React, { useState, useMemo } from 'react';
import { Printer, Layers, LayoutGrid } from 'lucide-react';
import { EXERCISES_DATA } from '../data/exercises';
import { SectionHeader } from '../components/common/SectionHeader';
import { ExerciseCarousel } from '../components/exercises/ExerciseCarousel';
import { ExerciseCard } from '../components/exercises/ExerciseCard';

export const ExercisesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  const flexionExercises = useMemo(
    () => EXERCISES_DATA.filter((e) => e.section !== 'complementario'),
    []
  );

  const complementaryExercises = useMemo(
    () => EXERCISES_DATA.filter((e) => e.section === 'complementario'),
    []
  );

  return (
    <div className="space-y-8 sm:space-y-12">
      <SectionHeader
        badge="Rehabilitación posoperatoria LCA (HTH) · Semanas 1 a 3"
        title="Biblioteca de ejercicios 3D"
        subtitle="Sección A (5 ejercicios del banner académico) y Sección B (4 ejercicios complementarios de movilidad y activación)."
        rightSlot={
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-cyan-300/25 bg-[#081b2d] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                aria-pressed={viewMode === 'carousel'}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-[#1db8c4] text-white'
                    : 'text-sky-200 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Carrusel 3D</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#1db8c4] text-white'
                    : 'text-sky-200 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Tarjetas</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-cyan-300/25 bg-[#081b2d] px-3 py-1 text-xs font-bold text-white hover:border-[#38d9d6] transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-[#38d9d6]" aria-hidden="true" />
              <span>Imprimir</span>
            </button>
          </div>
        }
      />

      {/* SECCIÓN A: RECUPERACIÓN DE LA FLEXIÓN */}
      <section aria-labelledby="exercises-flexion-heading" className="space-y-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-[#38d9d6]/20 border border-[#38d9d6]/40 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#67e8f9] mb-1">
            Sección A · Banner Académico (1 al 5)
          </span>
          <h2 id="exercises-flexion-heading" className="dala-display text-2xl sm:text-3xl text-white">
            Recuperación de la flexión
          </h2>
        </div>

        {viewMode === 'carousel' ? (
          <div className="no-print">
            <ExerciseCarousel
              exercises={flexionExercises}
              startIndexOffset={0}
              variant="banner"
            />
          </div>
        ) : null}

        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-4 lg:grid-cols-2'
              : 'hidden print:grid print:grid-cols-1 print:gap-4'
          }
        >
          {flexionExercises.map((exercise, idx) => {
            const isOddLast =
              flexionExercises.length % 2 === 1 && idx === flexionExercises.length - 1;
            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                indexNumber={idx + 1}
                featured={isOddLast}
              />
            );
          })}
        </div>
      </section>

      {/* SECCIÓN B: MOVILIDAD Y ACTIVACIÓN COMPLEMENTARIA */}
      <section
        aria-labelledby="exercises-comp-heading"
        className="pt-6 border-t border-cyan-300/20 space-y-4"
      >
        <div>
          <span className="inline-flex items-center rounded-full bg-sky-500/20 border border-sky-400/40 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-200 mb-1">
            Sección B · Semanas 1 a 3 (6 al 9)
          </span>
          <h2 id="exercises-comp-heading" className="dala-display text-2xl sm:text-3xl text-white">
            Movilidad y activación complementaria
          </h2>
        </div>

        {viewMode === 'carousel' ? (
          <div className="no-print">
            <ExerciseCarousel
              exercises={complementaryExercises}
              startIndexOffset={5}
              variant="complementary"
            />
          </div>
        ) : null}

        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-4 lg:grid-cols-2'
              : 'hidden print:grid print:grid-cols-1 print:gap-4'
          }
        >
          {complementaryExercises.map((exercise, idx) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              indexNumber={idx + 6}
              featured={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
