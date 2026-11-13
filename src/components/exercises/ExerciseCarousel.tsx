import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ShieldAlert,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Exercise } from '../../types/exercise';
import { ExerciseDemonstration } from './ExerciseDemonstration';
import { ExerciseInstructions } from './ExerciseInstructions';

interface ExerciseCarouselProps {
  exercises: Exercise[];
}

const MICRO_META: Record<
  string,
  {
    shortTab: string;
    pos: string;
    equip: string;
    cue: string;
    shortSteps: [string, string, string];
  }
> = {
  'deslizamiento-del-talon': {
    shortTab: 'Talón',
    pos: 'Boca arriba',
    equip: 'Cama firme',
    cue: 'Talón apoyado',
    shortSteps: [
      'Deslizá lento el talón hacia el glúteo.',
      'Flexioná hasta tu límite sin dolor.',
      'Volvé despacio a extender.'
    ]
  },
  'flexion-asistida-con-toalla': {
    shortTab: 'Toalla',
    pos: 'Boca arriba',
    equip: 'Con toalla',
    cue: 'Sin tironear',
    shortSteps: [
      'Pasá la toalla por el pie y deslizá el talón.',
      'Acompañá suave con las manos.',
      'Regresá lento controlando la rodilla.'
    ]
  },
  'deslizamiento-del-pie-en-pared': {
    shortTab: 'Pared',
    pos: 'Boca arriba',
    equip: 'Pared',
    cue: 'Descenso lento',
    shortSteps: [
      'Apoyá el pie en la pared y dejalo bajar lento.',
      'Flexioná de forma gradual y controlada.',
      'Subí suave ayudándote con la otra pierna.'
    ]
  },
  'flexion-activa-en-sedestacion': {
    shortTab: 'Silla',
    pos: 'Sentado',
    equip: 'Silla firme',
    cue: 'Pie hacia atrás',
    shortSteps: [
      'Sentate derecho con los pies apoyados.',
      'Deslizá el pie operado hacia atrás bajo la silla.',
      'Volvé suave hacia adelante.'
    ]
  },
  'bicicleta-estatica-sin-resistencia': {
    shortTab: 'Bici',
    pos: 'En bici',
    equip: 'Bicicleta fija',
    cue: 'Sin resistencia',
    shortSteps: [
      'Ajustá el asiento cómodo y apoyá los pies.',
      'Empezá con balanceos suaves de adelante a atrás.',
      'Completá el giro sin carga si no molesta.'
    ]
  }
};

export const ExerciseCarousel: React.FC<ExerciseCarouselProps> = ({ exercises }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openDrawer, setOpenDrawer] = useState<'none' | 'safety' | 'dose'>('none');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex >= exercises.length) {
      setActiveIndex(0);
    }
  }, [exercises.length, activeIndex]);

  useEffect(() => {
    setOpenDrawer('none');
  }, [activeIndex]);

  if (exercises.length === 0) {
    return null;
  }

  const currentExercise = exercises[activeIndex] || exercises[0];
  const meta = MICRO_META[currentExercise.id] || {
    shortTab: currentExercise.title.split(' ')[0],
    pos: 'Controlado',
    equip: currentExercise.equipment,
    cue: 'Suave',
    shortSteps: currentExercise.steps.slice(0, 3) as [string, string, string]
  };
  const total = exercises.length;

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const deltaX = endX - touchStartX;
    if (Math.abs(deltaX) > 44) {
      if (deltaX < 0) goNext();
      else goPrev();
    }
    setTouchStartX(null);
  };

  const stepNum = String(activeIndex + 1).padStart(2, '0');
  const totalNum = String(total).padStart(2, '0');

  return (
    <div
      className="relative select-none outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-roledescription="carousel"
      aria-label="Carrusel minimalista de ejercicios 3D"
    >
      {/* Selector superior ultra-compacto (entra entero en celular) */}
      <div
        role="tablist"
        aria-label="Seleccionar ejercicio"
        className="mb-3 grid grid-cols-5 gap-1.5 sm:flex sm:items-center sm:gap-2"
      >
        {exercises.map((item, idx) => {
          const isSelected = idx === activeIndex;
          const num = String(idx + 1).padStart(2, '0');
          const shortName = MICRO_META[item.id]?.shortTab || item.title.split(' ')[0];
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveIndex(idx)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 rounded-2xl sm:rounded-full px-2 py-2 sm:px-4 sm:py-2 text-center transition-all duration-200 ${
                isSelected
                  ? 'bg-electric-iris text-bone-white shadow-[0_0_20px_rgba(128,82,255,0.45)]'
                  : 'bg-[#08080e] text-ash-gray border border-white/10 hover:text-bone-white hover:border-white/25'
              }`}
            >
              <span
                className={`text-[10px] font-bold tracking-wider ${
                  isSelected ? 'text-white/90' : 'text-saffron-spark'
                }`}
              >
                {num}
              </span>
              <span className="text-[11px] sm:text-xs font-medium truncate max-w-full">
                {shortName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Contenedor dividido en bloques limpios */}
      <article
        key={currentExercise.id}
        className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#050508]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* BLOQUE 1 (Izquierda / Arriba): Escenario 3D en vivo */}
          <div className="lg:col-span-7 p-3 sm:p-4 lg:p-5 lg:border-r lg:border-white/10 flex flex-col justify-between">
            {/* Cabecera mínima de la tarjeta */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="mb-2.5 flex items-center justify-between gap-2 px-1"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-saffron-spark">
                    {stepNum} / {totalNum}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-[11px] text-ash-gray truncate">
                    {currentExercise.category}
                  </span>
                </div>
                <h3 className="dala-display text-xl sm:text-2xl text-bone-white truncate mt-0.5">
                  {currentExercise.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Ejercicio anterior"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-bone-white hover:border-electric-iris transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Siguiente ejercicio"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-bone-white hover:border-electric-iris transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Visor 3D articulado */}
            <ExerciseDemonstration
              exercise={currentExercise}
              compact
              defaultPlaying
              heroStage
            />
          </div>

          {/* BLOQUE 2 (Derecha / Abajo): Micro-tarjetas divididas + 3 pasos cortos + Ocultos */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="lg:col-span-5 p-3.5 sm:p-5 flex flex-col justify-between gap-3.5"
          >
            <div className="space-y-3">
              {/* 3 Micro-tarjetas divididas (Posición · Elemento · Clave) */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/10 bg-[#0a0a12] px-2.5 py-2 text-center">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-ash-gray">
                    Posición
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-bone-white truncate">
                    {meta.pos}
                  </span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0a0a12] px-2.5 py-2 text-center">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-ash-gray">
                    Elemento
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-bone-white truncate">
                    {meta.equip}
                  </span>
                </div>

                <div className="rounded-2xl border border-electric-iris/30 bg-electric-iris/10 px-2.5 py-2 text-center">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-saffron-spark">
                    Clave
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-bone-white truncate">
                    {meta.cue}
                  </span>
                </div>
              </div>

              {/* 3 Pasos cortos divididos (lectura en 3 segundos) */}
              <div className="rounded-2xl border border-white/10 bg-[#08080e] divide-y divide-white/[0.06]">
                {meta.shortSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 px-3 py-2.5 text-xs">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-electric-iris/20 text-[10px] font-bold text-electric-iris">
                      {idx + 1}
                    </span>
                    <span className="text-silver-mist font-light leading-snug">{step}</span>
                  </div>
                ))}
              </div>

              {/* Botones ocultables ("sin tanto texto o que esté oculto") */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDrawer((prev) => (prev === 'safety' ? 'none' : 'safety'))
                  }
                  aria-expanded={openDrawer === 'safety'}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-[11px] font-semibold transition-all ${
                    openDrawer === 'safety'
                      ? 'border-saffron-spark/60 bg-saffron-spark/15 text-saffron-spark'
                      : 'border-white/10 bg-white/[0.02] text-ash-gray hover:text-bone-white'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-saffron-spark" />
                    <span>Evitar y cuidados</span>
                  </span>
                  {openDrawer === 'safety' ? (
                    <ChevronUp className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setOpenDrawer((prev) => (prev === 'dose' ? 'none' : 'dose'))}
                  aria-expanded={openDrawer === 'dose'}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-[11px] font-semibold transition-all ${
                    openDrawer === 'dose'
                      ? 'border-electric-iris bg-electric-iris/20 text-bone-white'
                      : 'border-white/10 bg-white/[0.02] text-ash-gray hover:text-bone-white'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-electric-iris" />
                    <span>Mi pauta</span>
                  </span>
                  {openDrawer === 'dose' ? (
                    <ChevronUp className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                  )}
                </button>
              </div>

              {/* Panel oculto 1: Qué evitar y cuidados (solo se ve al tocar) */}
              {openDrawer === 'safety' && (
                <div className="rounded-2xl border border-white/10 bg-[#0a0a12] p-3 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-spark">
                      Evitar
                    </span>
                    <ul className="mt-1 space-y-1 text-silver-mist font-light">
                      {currentExercise.commonMistakes.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-saffron-spark font-bold">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[11px] text-ash-gray">
                    <strong className="text-rose-400">Frenar si hay:</strong>{' '}
                    {currentExercise.stopConditions.slice(0, 2).join(' · ')}
                  </div>
                </div>
              )}

              {/* Panel oculto 2: Pauta personal */}
              {openDrawer === 'dose' && (
                <div className="rounded-2xl border border-white/10 bg-[#0a0a12] p-3">
                  <ExerciseInstructions
                    exerciseId={currentExercise.id}
                    exerciseTitle={currentExercise.title}
                  />
                </div>
              )}
            </div>

            {/* Pie del carrusel: Puntos Dala #8052ff + Ficha + Siguiente */}
            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Diapositivas">
                {exercises.map((item, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Ir al ejercicio ${idx + 1}: ${item.title}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        active
                          ? 'w-6 bg-electric-iris shadow-[0_0_10px_#8052ff]'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/ejercicios/${currentExercise.id}`}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-silver-mist hover:text-bone-white"
                >
                  <span>Ficha</span>
                  <ArrowUpRight className="h-3 w-3 text-electric-iris" />
                </Link>

                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-1 rounded-full bg-electric-iris px-3.5 py-1.5 text-[11px] font-semibold text-bone-white shadow-[0_0_18px_rgba(128,82,255,0.4)] hover:bg-[#9168ff] transition-all"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
