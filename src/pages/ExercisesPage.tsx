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
    <div className="space-y-8 sm:space-y-10">
      <SectionHeader
        badge="Semanas 1–3 · Según indicación profesional"
        title="Biblioteca de ejercicios 3D"
        subtitle="Módulo A (5 ejercicios del banner académico) y Módulo B (4 ejercicios complementarios de movilidad y activación)."
        rightSlot={
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-xl border border-[#244154] bg-[#0B2030] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                aria-pressed={viewMode === 'carousel'}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-[#25C8CC] text-[#061522]'
                    : 'text-[#A7B9C6] hover:text-[#F1F7FA]'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Carrusel 3D</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#25C8CC] text-[#061522]'
                    : 'text-[#A7B9C6] hover:text-[#F1F7FA]'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Lista completa</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border border-[#244154] bg-[#0B2030] px-3 py-1.5 text-xs font-semibold text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-[#25C8CC]" aria-hidden="true" />
              <span>Imprimir</span>
            </button>
          </div>
        }
      />

      {/* MÓDULO A: RECUPERACIÓN DE LA FLEXIÓN */}
      <section aria-labelledby="exercises-flexion-heading" className="space-y-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-[#10283A] border border-[#244154] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#25C8CC] mb-1.5">
            Módulo A · Ejercicios principales del banner (1 al 5)
          </span>
          <h2 id="exercises-flexion-heading" className="text-xl sm:text-2xl font-bold text-[#F1F7FA]">
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
              ? 'grid grid-cols-1 gap-4'
              : 'hidden print:grid print:grid-cols-1 print:gap-4'
          }
        >
          {flexionExercises.map((exercise, idx) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              indexNumber={idx + 1}
              featured={true}
            />
          ))}
        </div>
      </section>

      {/* MÓDULO B: MOVILIDAD Y ACTIVACIÓN COMPLEMENTARIA */}
      <section
        aria-labelledby="exercises-comp-heading"
        className="pt-6 border-t border-[#244154] space-y-4"
      >
        <div>
          <span className="inline-flex items-center rounded-full bg-[#10283A] border border-[#244154] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#82E5E4] mb-1.5">
            Módulo B · Semanas 1 a 3 (6 al 9)
          </span>
          <h2 id="exercises-comp-heading" className="text-xl sm:text-2xl font-bold text-[#F1F7FA]">
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
              ? 'grid grid-cols-1 gap-4'
              : 'hidden print:grid print:grid-cols-1 print:gap-4'
          }
        >
          {complementaryExercises.map((exercise, idx) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              indexNumber={idx + 6}
              featured={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
