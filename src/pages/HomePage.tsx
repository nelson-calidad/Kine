import React, { Suspense, lazy, useMemo, useState } from 'react';
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
  ChevronRight,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { EXERCISES_DATA } from '../data/exercises';
import { ExerciseFilterCategory } from '../types/exercise';
import { ExerciseFilters } from '../components/exercises/ExerciseFilters';
import { ExerciseCarousel } from '../components/exercises/ExerciseCarousel';
import { ExerciseCard } from '../components/exercises/ExerciseCard';

const ConstellationHero3D = lazy(
  () => import('../components/exercises/three/ConstellationHero3D')
);

const SECONDARY_SECTIONS = [
  {
    to: '/cuidados',
    title: 'Cuidados',
    summary: 'Hielo, herida y muletas',
    icon: HeartHandshake,
    danger: false
  },
  {
    to: '/que-evitar',
    title: 'Qué evitar',
    summary: 'Los NO en casa',
    icon: Ban,
    danger: false
  },
  {
    to: '/seguimiento',
    title: 'Seguimiento',
    summary: 'Registro diario',
    icon: ClipboardList,
    danger: false
  },
  {
    to: '/alertas',
    title: 'Alertas',
    summary: 'Pautas urgentes',
    icon: AlertTriangle,
    danger: true
  },
  {
    to: '/actividades',
    title: 'Vida diaria',
    summary: 'Caminar y dormir',
    icon: Footprints,
    danger: false
  },
  {
    to: '/preguntas',
    title: 'Preguntas',
    summary: 'Dudas frecuentes',
    icon: HelpCircle,
    danger: false
  },
  {
    to: '/mi-cirugia',
    title: 'Cirugía HTH',
    summary: 'Injerto rotuliano',
    icon: Stethoscope,
    danger: false
  },
  {
    to: '/fuentes',
    title: 'Fuentes',
    summary: 'Base científica',
    icon: BookOpen,
    danger: false
  }
];

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ExerciseFilterCategory>('todos');
  const [heroShape, setHeroShape] = useState<'auto' | 'brain' | 'knee'>('auto');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

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
    <div className="space-y-7 sm:space-y-12">
      {/* 1. ENTRADA 3D MINIMALISTA FLOTANDO EN TERCIOPELO NEGRO */}
      <section aria-labelledby="dala-hero-heading" className="relative no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center gap-3 sm:gap-6">
          {/* Columna izquierda: Título escultural + 1 sola línea limpia */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron-spark shadow-[0_0_8px_#ffb829]" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-saffron-spark">
                LCA · HTH · GUÍA 3D
              </span>
            </div>

            <h1
              id="dala-hero-heading"
              className="dala-display text-3xl sm:text-5xl text-bone-white"
            >
              Tu rodilla,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-bone-white via-bone-white to-electric-iris">
                paso a paso.
              </span>
            </h1>

            <p className="mt-1.5 text-xs sm:text-sm font-extralight text-silver-mist">
              5 movimientos guiados en 3D para recuperar tu flexión en casa.
            </p>
          </div>

          {/* Columna derecha: Constelación 3D flotante (compacta en móvil) */}
          <div className="lg:col-span-7 relative h-[185px] sm:h-[270px] lg:h-[310px] w-full">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-[11px] uppercase tracking-widest text-ash-gray animate-pulse">
                    3D...
                  </span>
                </div>
              }
            >
              <ConstellationHero3D mode={heroShape} />
            </Suspense>

            {/* Selector mínimo flotante (Auto · Cerebro · Rodilla) */}
            <div className="absolute bottom-1 right-1 flex items-center gap-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 p-0.5">
              {(
                [
                  { id: 'auto', label: 'Auto' },
                  { id: 'brain', label: 'Cerebro' },
                  { id: 'knee', label: 'Rodilla' }
                ] as const
              ).map((item) => {
                const active = heroShape === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHeroShape(item.id)}
                    aria-pressed={active}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all ${
                      active
                        ? 'bg-electric-iris text-white'
                        : 'text-ash-gray hover:text-bone-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CARRUSEL 3D DE EJERCICIOS (COMPACTO Y DIVIDIDO) */}
      <section id="ejercicios-carrusel" aria-labelledby="home-exercises-heading">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2
            id="home-exercises-heading"
            className="dala-display text-xl sm:text-2xl text-bone-white"
          >
            Mis ejercicios
          </h2>

          <div className="flex items-center gap-1.5 no-print">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-[#08080e] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                aria-pressed={viewMode === 'carousel'}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-electric-iris text-bone-white'
                    : 'text-ash-gray hover:text-bone-white'
                }`}
              >
                <Layers className="h-3 w-3" />
                <span>Carrusel</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-electric-iris text-bone-white'
                    : 'text-ash-gray hover:text-bone-white'
                }`}
              >
                <LayoutGrid className="h-3 w-3" />
                <span>Grilla</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              aria-label="Imprimir cartilla"
              className="inline-flex h-7 w-7 sm:h-8 sm:w-auto sm:px-3 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-[#08080e] text-[11px] font-semibold text-bone-white hover:border-electric-iris transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-saffron-spark" aria-hidden="true" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        </div>

        {/* Filtros sólo cuando está en modo Grilla para mantener el carrusel súper limpio */}
        {viewMode === 'grid' && (
          <ExerciseFilters
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            counts={counts}
          />
        )}

        {viewMode === 'carousel' ? (
          <div className="no-print">
            <ExerciseCarousel exercises={EXERCISES_DATA} />
          </div>
        ) : null}

        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-4 lg:grid-cols-2'
              : 'hidden print:grid print:grid-cols-1 print:gap-4'
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
      </section>

      {/* 3. TARJETAS COMPACTAS DE CUIDADOS Y GUÍA (DIVIDIDAS EN PARES) */}
      <section
        aria-labelledby="secondary-resources-heading"
        className="pt-5 border-t border-white/10 no-print"
      >
        <h2
          id="secondary-resources-heading"
          className="text-xs font-bold uppercase tracking-widest text-ash-gray mb-3"
        >
          Guía rápida en casa
        </h2>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {SECONDARY_SECTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center justify-between gap-2 rounded-2xl border px-3 py-2.5 sm:p-3.5 transition-all ${
                  item.danger
                    ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-400'
                    : 'bg-[#07070c] border-white/10 hover:border-electric-iris/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                      item.danger
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                        : 'bg-electric-iris/15 border-electric-iris/30 text-electric-iris'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={`text-xs font-semibold truncate ${
                        item.danger ? 'text-rose-300' : 'text-bone-white'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-light text-ash-gray truncate">
                      {item.summary}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 ${
                    item.danger ? 'text-rose-400' : 'text-ash-gray group-hover:text-bone-white'
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
