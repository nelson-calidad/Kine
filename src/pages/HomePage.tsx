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

const SECONDARY_SHORTCUTS = [
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
    title: 'Seguimiento',
    summary: 'Registro diario en tu dispositivo',
    icon: ClipboardList,
    danger: false
  },
  {
    to: '/alertas',
    title: 'Alertas',
    summary: 'Señales para consulta urgente',
    icon: AlertTriangle,
    danger: true
  },
  {
    to: '/preguntas',
    title: 'Preguntas frecuentes',
    summary: 'Dudas habituales del posoperatorio',
    icon: HelpCircle,
    danger: false
  }
];

const COMPLEMENTARY_LINKS = [
  {
    to: '/actividades',
    label: 'Caminar y actividades cotidianas',
    icon: Footprints
  },
  {
    to: '/mi-cirugia',
    label: 'Conocé tu cirugía (Injerto HTH)',
    icon: Stethoscope
  },
  {
    to: '/fuentes',
    label: 'Fuentes y respaldo científico',
    icon: BookOpen
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
    <div className="space-y-12">
      {/* 1. CABECERA MINIMALISTA PROTAGONISTA: MIS EJERCICIOS */}
      <section aria-labelledby="home-exercises-heading">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              id="home-exercises-heading"
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-navy"
            >
              Mis ejercicios
            </h1>
            <p className="mt-1.5 text-base sm:text-lg text-brand-muted">
              Recuperá tu movilidad, paso a paso
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-brand-navy shadow-sm hover:bg-brand-soft/40 transition-colors"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              <span>Imprimir cartilla</span>
            </button>
          </div>
        </div>

        <ExerciseFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={counts}
        />

        {/* Cinco ejercicios principales con demostración 3D articulada */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredExercises.map((exercise) => {
            const globalIndex = EXERCISES_DATA.findIndex((item) => item.id === exercise.id);
            const nextExercise = EXERCISES_DATA[(globalIndex + 1) % EXERCISES_DATA.length];

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
      </section>

      {/* 2. CONTENIDO SECUNDARIO COMPACTO */}
      <section
        aria-labelledby="secondary-resources-heading"
        className="pt-4 border-t border-slate-200/80 no-print"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="secondary-resources-heading"
            className="text-base sm:text-lg font-extrabold text-brand-navy"
          >
            Guía de acompañamiento y consulta rápida
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SECONDARY_SHORTCUTS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center justify-between gap-3 rounded-2xl border p-3.5 shadow-sm transition-all hover:-translate-y-0.5 ${
                  item.danger
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-brand-danger/30 hover:border-brand-danger'
                    : 'bg-white border-slate-200/85 hover:border-brand-teal/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      item.danger
                        ? 'bg-rose-100 dark:bg-rose-900/50 text-brand-danger'
                        : 'bg-brand-soft text-brand-navy'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={`text-sm font-extrabold truncate ${
                        item.danger ? 'text-brand-danger' : 'text-brand-navy'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-muted truncate">{item.summary}</p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    item.danger ? 'text-brand-danger' : 'text-brand-muted'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>

        {/* Enlaces complementarios discretos */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {COMPLEMENTARY_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-muted hover:text-brand-navy hover:border-brand-teal/40 transition-colors"
              >
                <Icon className="h-3.5 w-3.5 text-brand-teal" aria-hidden="true" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
