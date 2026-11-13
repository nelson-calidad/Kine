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
  Sparkles,
  Layers,
  LayoutGrid,
  ArrowDownRight
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

  const scrollToCarousel = () => {
    const el = document.getElementById('ejercicios-carrusel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-20">
      {/* 1. ENTRADA 3D CONSTELACIÓN NEURO-ARTICULAR (ESTILO DALA VOID) */}
      <section
        aria-labelledby="dala-hero-heading"
        className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] border border-white/10 bg-void px-5 py-7 sm:px-10 sm:py-12 lg:py-14 shadow-[0_30px_100px_rgba(0,0,0,0.95)] no-print"
      >
        {/* Subtle atmospheric glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-36 right-1/4 h-80 w-80 rounded-full bg-electric-iris/15 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 right-10 h-80 w-80 rounded-full bg-deep-verdant/15 blur-[110px]"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 lg:items-center gap-6 lg:gap-8">
          {/* Left Column (5 cols): Sculptural Display Headline + Ultra-Light Body + Electric Iris Pill CTA */}
          <div className="lg:col-span-5 flex flex-col justify-center z-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-saffron-spark shadow-[0_0_10px_#ffb829]" />
              <span className="dala-label text-saffron-spark">
                REHABILITACIÓN NEURO-MOTORA 3D · LCA (HTH)
              </span>
            </div>

            <h1
              id="dala-hero-heading"
              className="dala-display text-4xl sm:text-5xl lg:text-[60px] text-bone-white"
            >
              Tu rodilla,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-bone-white via-bone-white to-electric-iris">
                paso a paso.
              </span>
            </h1>

            <p className="mt-4 sm:mt-5 dala-body text-base sm:text-lg max-w-md">
              Explorá tus 5 ejercicios posoperatorios en un carrusel biomecánico 3D interactivo.
              Control motor, propiocepción y movilidad progresiva en casa.
            </p>

            {/* Primary CTA Pill (#8052ff Electric Iris) + Quick Actions */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={scrollToCarousel}
                className="inline-flex items-center gap-2 rounded-full bg-electric-iris px-6 py-3 text-xs sm:text-sm font-semibold text-bone-white shadow-[0_0_30px_rgba(128,82,255,0.5)] hover:bg-[#9168ff] transition-all"
              >
                <span>Explorar carrusel 3D</span>
                <ArrowDownRight className="h-4 w-4" />
              </button>

              <Link
                to="/seguimiento"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-xs sm:text-sm font-medium text-silver-mist hover:border-white/35 hover:text-bone-white transition-all"
              >
                <span>Mi seguimiento</span>
              </Link>
            </div>

            {/* Interactive 3D Constellation Mode Selector (Cerebro <-> Rodilla) */}
            <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ash-gray mr-1">
                <Sparkles className="h-3.5 w-3.5 text-saffron-spark" />
                <span>Constelación 3D:</span>
              </span>

              {(
                [
                  { id: 'auto', label: 'Ciclo neuronal ↔ articular' },
                  { id: 'brain', label: 'Corteza motora 3D' },
                  { id: 'knee', label: 'Rodilla LCA 3D' }
                ] as const
              ).map((item) => {
                const active = heroShape === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHeroShape(item.id)}
                    aria-pressed={active}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                      active
                        ? 'bg-white text-void shadow-sm'
                        : 'bg-white/[0.04] text-ash-gray border border-white/10 hover:text-bone-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column (7 cols): Massive 3D Particle Constellation Visualization */}
          <div className="lg:col-span-7 relative h-[290px] sm:h-[390px] lg:h-[460px] w-full">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center rounded-3xl border border-white/5 bg-void">
                  <span className="dala-label text-ash-gray animate-pulse">
                    Inicializando constelación 3D...
                  </span>
                </div>
              }
            >
              <ConstellationHero3D mode={heroShape} />
            </Suspense>

            {/* Floating minimal caption on bottom-right of 3D canvas */}
            <div className="pointer-events-none absolute bottom-2 right-3 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 text-[11px] text-silver-mist">
              <span className="h-1.5 w-1.5 rounded-full bg-electric-iris animate-pulse" />
              <span>2.800 micro-prismas 3D · Girá con tu dedo o cursor</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CARRUSEL 3D DE EJERCICIOS POSOPERATORIOS */}
      <section id="ejercicios-carrusel" aria-labelledby="home-exercises-heading" className="scroll-mt-20">
        <div className="mb-5 sm:mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="dala-label text-saffron-spark block mb-1.5">
              DEMOSTRACIÓN BIOMECÁNICA INTERACTIVA
            </span>
            <h2
              id="home-exercises-heading"
              className="dala-display text-3xl sm:text-4xl lg:text-5xl text-bone-white"
            >
              Mis ejercicios en 3D
            </h2>
          </div>

          {/* View Mode Switcher (Carrusel 3D vs Grilla) + Print */}
          <div className="flex items-center gap-2 no-print">
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
              className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-bone-white hover:border-electric-iris transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-saffron-spark" aria-hidden="true" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        </div>

        <ExerciseFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={counts}
        />

        {viewMode === 'carousel' ? (
          <div className="no-print">
            <ExerciseCarousel exercises={filteredExercises} />
          </div>
        ) : null}

        {/* Grid view (also used automatically when printing) */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-5 lg:grid-cols-2'
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
      </section>

      {/* 3. ACCESOS RÁPIDOS COMPLEMENTARIOS (ESTILO DALA MINIMALISTA EN EL VACÍO) */}
      <section
        aria-labelledby="secondary-resources-heading"
        className="pt-8 border-t border-white/10 no-print"
      >
        <div className="mb-5 flex items-baseline justify-between">
          <div>
            <span className="dala-label text-saffron-spark block mb-1">
              GUÍA CLÍNICA COMPLEMENTARIA
            </span>
            <h2
              id="secondary-resources-heading"
              className="dala-display text-2xl sm:text-3xl text-bone-white"
            >
              Acompañamiento y cuidados
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SECONDARY_SECTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 ${
                  item.danger
                    ? 'bg-rose-950/25 border-rose-500/30 hover:border-rose-400'
                    : 'bg-[#07070c] border-white/10 hover:border-electric-iris/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                      item.danger
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                        : 'bg-electric-iris/15 border-electric-iris/30 text-electric-iris'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        item.danger ? 'text-rose-300' : 'text-bone-white'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-light text-ash-gray truncate hidden sm:block">
                      {item.summary}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
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
