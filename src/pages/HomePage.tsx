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
  const [heroShape, setHeroShape] = useState<'auto' | 'brain' | 'knee'>('knee');
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
      {/* 1. ENTRADA 3D HOLOGRÁFICA CELESTE/TURQUESA (RODILLA LCA HTH + CONTROL MOTOR) */}
      <section aria-labelledby="dala-hero-heading" className="relative no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center gap-3 sm:gap-6 rounded-[24px] border border-cyan-300/20 bg-[#081b2d]/90 px-4 py-4 sm:px-7 sm:py-6 shadow-soft-lg">
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-[#38d9d6] shadow-[0_0_8px_#38d9d6]" />
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#67e8f9]">
                KINEFISIATRÍA TRAUMATOLÓGICA · LCA (HTH)
              </span>
            </div>

            <h1
              id="dala-hero-heading"
              className="dala-display text-2xl sm:text-4xl lg:text-5xl text-white"
            >
              Tu rodilla,{' '}
              <span className="text-[#67e8f9]">paso a paso.</span>
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-sky-100 leading-relaxed">
              Guía interactiva 3D para las semanas 1 a 3 posoperatorias de reconstrucción de LCA
              con injerto HTH. Realizá únicamente los ejercicios indicados por tu kinesiólogo según
              tolerancia y evolución clínica.
            </p>
          </div>

          <div className="lg:col-span-7 relative h-[200px] sm:h-[260px] lg:h-[290px] w-full">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#67e8f9] animate-pulse">
                    Cargando modelo 3D...
                  </span>
                </div>
              }
            >
              <ConstellationHero3D mode={heroShape} />
            </Suspense>

            <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-full bg-[#05121f]/90 backdrop-blur-md border border-cyan-300/25 p-1">
              {(
                [
                  { id: 'knee', label: 'Rodilla LCA 3D' },
                  { id: 'brain', label: 'Control Motor 3D' },
                  { id: 'auto', label: 'Ciclo 3D' }
                ] as const
              ).map((item) => {
                const active = heroShape === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHeroShape(item.id)}
                    aria-pressed={active}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${
                      active
                        ? 'bg-[#1db8c4] text-white shadow-[0_0_10px_rgba(56,217,214,0.4)]'
                        : 'text-sky-200 hover:text-white'
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

      {/* SELECTOR DE VISTA GLOBAL (CARRUSEL 3D vs TARJETAS) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-300/15 pb-3 no-print">
        <p className="text-xs text-sky-200">
          Elegí cómo recorrer las demostraciones 3D:
        </p>

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
            aria-label="Imprimir cartilla"
            className="inline-flex h-8 px-3 items-center justify-center gap-1.5 rounded-full border border-cyan-300/25 bg-[#081b2d] text-xs font-bold text-white hover:border-[#38d9d6] transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-[#38d9d6]" aria-hidden="true" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECCIÓN A: RECUPERACIÓN DE LA FLEXIÓN (5 EJERCICIOS DEL BANNER)     */}
      {/* =================================================================== */}
      <section id="seccion-flexion" aria-labelledby="flexion-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="inline-flex items-center rounded-full bg-[#38d9d6]/20 border border-[#38d9d6]/40 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#67e8f9] mb-1.5">
              Sección A · 5 Ejercicios del Banner Académico
            </span>
            <h2 id="flexion-heading" className="dala-display text-2xl sm:text-3xl text-white">
              Recuperación de la flexión
            </h2>
          </div>
          <p className="text-xs text-sky-200 max-w-md">
            Progresión de movilidad de rodilla (1 al 5). El ejercicio 5 en decúbito prono es una
            técnica de uso exclusivo con supervisión profesional.
          </p>
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

      {/* =================================================================== */}
      {/* SECCIÓN B: MOVILIDAD Y ACTIVACIÓN COMPLEMENTARIA (EJERCICIOS 6 A 9) */}
      {/* =================================================================== */}
      <section
        id="seccion-complementaria"
        aria-labelledby="complementaria-heading"
        className="pt-6 border-t border-cyan-300/20 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="inline-flex items-center rounded-full bg-sky-500/20 border border-sky-400/40 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-200 mb-1.5">
              Sección B · Semanas 1 a 3 Posoperatorias
            </span>
            <h2
              id="complementaria-heading"
              className="dala-display text-2xl sm:text-3xl text-white"
            >
              Movilidad y activación complementaria
            </h2>
          </div>
          <p className="text-xs text-sky-200 max-w-md">
            Extensión pasiva a 0°, activación de cuádriceps, retorno venoso y control motor (6 al
            9), según autorización e individualización clínica.
          </p>
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

      {/* 3. TARJETAS COMPACTAS DE CUIDADOS Y GUÍA */}
      <section
        aria-labelledby="secondary-resources-heading"
        className="pt-6 border-t border-cyan-300/20 no-print"
      >
        <h2
          id="secondary-resources-heading"
          className="text-xs font-extrabold uppercase tracking-widest text-[#67e8f9] mb-3"
        >
          Guía clínica complementaria
        </h2>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {SECONDARY_SECTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center justify-between gap-2 rounded-2xl border px-3.5 py-3 transition-all ${
                  item.danger
                    ? 'bg-rose-950/35 border-rose-400/40 hover:border-rose-300'
                    : 'bg-[#0a1e30] border-cyan-300/20 hover:border-[#38d9d6]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                      item.danger
                        ? 'bg-rose-500/20 border-rose-400/40 text-rose-300'
                        : 'bg-[#38d9d6]/15 border-[#38d9d6]/35 text-[#38d9d6]'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={`text-xs font-bold truncate ${
                        item.danger ? 'text-rose-200' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-sky-200 truncate">{item.summary}</p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-4 w-4 shrink-0 ${
                    item.danger ? 'text-rose-300' : 'text-sky-200 group-hover:text-white'
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
