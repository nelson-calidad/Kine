import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Ban,
  ClipboardList,
  AlertTriangle,
  HelpCircle,
  Footprints,
  Stethoscope,
  BookOpen,
  Printer,
  ChevronRight
} from 'lucide-react';
import { EXERCISES_DATA } from '../data/exercises';
import { ExerciseFilterCategory } from '../types/exercise';
import { ExerciseFilters } from '../components/exercises/ExerciseFilters';
import { ExerciseCard } from '../components/exercises/ExerciseCard';

const SECONDARY_SECTIONS = [
  {
    to: '/cuidados',
    title: 'Cuidados en casa',
    summary: 'Herida, hielo, elevación y muletas',
    icon: HeartHandshake,
    danger: false
  },
  {
    to: '/que-evitar',
    title: 'Qué evitar',
    summary: 'Los NO durante tu recuperación',
    icon: Ban,
    danger: false
  },
  {
    to: '/seguimiento',
    title: 'Mi seguimiento',
    summary: 'Registro diario en tu dispositivo',
    icon: ClipboardList,
    danger: false
  },
  {
    to: '/alertas',
    title: 'Señales de alarma',
    summary: 'Pautas para consulta urgente',
    icon: AlertTriangle,
    danger: true
  },
  {
    to: '/actividades',
    title: 'Vida cotidiana',
    summary: 'Caminar, escaleras, dormir y aseo',
    icon: Footprints,
    danger: false
  },
  {
    to: '/preguntas',
    title: 'Preguntas frecuentes',
    summary: 'Dudas habituales del posoperatorio',
    icon: HelpCircle,
    danger: false
  },
  {
    to: '/mi-cirugia',
    title: 'Cirugía LCA (HTH)',
    summary: 'Cómo funciona el injerto rotuliano',
    icon: Stethoscope,
    danger: false
  },
  {
    to: '/fuentes',
    title: 'Fuentes científicas',
    summary: 'Bibliografía clínica verificada',
    icon: BookOpen,
    danger: false
  }
];

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ExerciseFilterCategory>('todos');

  const counts = useMemo(
    () => ({
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
    }),
    []
  );

  const filteredExercises = useMemo(() => {
    if (selectedCategory === 'todos') return EXERCISES_DATA;
    return EXERCISES_DATA.filter((exercise) => exercise.filterCategory === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* 1. CABECERA Y EJERCICIOS EN SINERGIA */}
      <section aria-labelledby="home-exercises-heading">
        <div className="mb-3.5 sm:mb-4 flex items-end justify-between gap-3">
          <div>
            <span className="inline-block mb-1 text-[11px] font-extrabold uppercase tracking-widest text-brand-teal">
              Rehabilitación posoperatoria · Paso a paso
            </span>
            <h1
              id="home-exercises-heading"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-navy leading-none"
            >
              Mis ejercicios
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-brand-muted">
              Recuperá tu movilidad, paso a paso
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="no-print inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy shadow-sm hover:bg-brand-soft/40 transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-brand-teal" aria-hidden="true" />
            <span className="hidden sm:inline">Imprimir cartilla</span>
            <span className="sm:hidden">Imprimir</span>
          </button>
        </div>

        <ExerciseFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={counts}
        />

        {/* Grilla sin espacios vacíos: si la cantidad es impar en escritorio, la última tarjeta se expande a 2 columnas */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
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
      </section>

      {/* 2. SECCIONES COMPLEMENTARIAS EN GRILLA PAR (8 ACCESOS = CERO ESPACIOS VACÍOS) */}
      <section
        aria-labelledby="secondary-resources-heading"
        className="pt-6 border-t border-slate-200/75 no-print"
      >
        <div className="mb-3.5 flex items-baseline justify-between">
          <div>
            <h2
              id="secondary-resources-heading"
              className="text-sm sm:text-base font-extrabold text-brand-navy tracking-tight"
            >
              Acompañamiento y cuidados
            </h2>
            <p className="text-xs text-brand-muted">
              Consultá pautas rápidas para el día a día en casa
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {SECONDARY_SECTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center justify-between gap-2.5 rounded-2xl border p-3 sm:p-3.5 transition-all hover:-translate-y-0.5 ${
                  item.danger
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-brand-danger/30 hover:border-brand-danger'
                    : 'bg-white border-slate-200/80 hover:border-brand-teal/45 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl ${
                      item.danger
                        ? 'bg-rose-100 dark:bg-rose-900/50 text-brand-danger'
                        : 'bg-brand-soft/80 text-brand-navy'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={`text-xs sm:text-sm font-extrabold truncate ${
                        item.danger ? 'text-brand-danger' : 'text-brand-navy'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-brand-muted truncate hidden sm:block">
                      {item.summary}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    item.danger ? 'text-brand-danger' : 'text-brand-muted'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
