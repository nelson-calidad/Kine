import React, { useState, useMemo } from 'react';
import { Printer } from 'lucide-react';
import { EXERCISES_DATA } from '../data/exercises';
import { ExerciseFilterCategory } from '../types/exercise';
import { SectionHeader } from '../components/common/SectionHeader';
import { SafetyNotice } from '../components/common/SafetyNotice';
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
        title="Mis ejercicios domiciliarios"
        subtitle="Conocé los cinco ejercicios de movilidad de rodilla que pueden formar parte de tu recuperación domiciliaria."
        rightSlot={
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-brand-navy shadow-sm hover:bg-brand-soft/40 transition-colors"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            <span>Imprimir cartilla</span>
          </button>
        }
      />

      <SafetyNotice
        title="Realizá únicamente los ejercicios autorizados por tu kinesiólogo"
        message="No todos los ejercicios se indican en el mismo momento ni deben realizarse juntos en una misma sesión. Ante dolor intenso, bloqueo, aumento importante de derrame o síntomas nuevos, detené el ejercicio y consultá. Las restricciones del cirujano prevalecen sobre cualquier orientación general."
        variant="info"
        className="mb-6"
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredExercises.map((exercise) => {
            const globalIndex = EXERCISES_DATA.findIndex((item) => item.id === exercise.id);
            const nextExercise =
              EXERCISES_DATA[(globalIndex + 1) % EXERCISES_DATA.length];

            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                indexNumber={globalIndex + 1}
                nextExerciseId={nextExercise?.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
