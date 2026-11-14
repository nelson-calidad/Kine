import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Stethoscope
} from 'lucide-react';
import { Exercise } from '../../types/exercise';
import { ExerciseDemonstration } from './ExerciseDemonstration';

interface ExerciseCarouselProps {
  exercises: Exercise[];
  startIndexOffset?: number;
  variant?: 'banner' | 'complementary';
}

const MICRO_META: Record<
  string,
  {
    shortTab: string;
    pos: string;
    executionSummary: string;
    precautionSummary: string;
  }
> = {
  'deslizamiento-del-talon': {
    shortTab: 'Talón',
    pos: 'Decúbito supino',
    executionSummary: 'Deslizar lentamente el talón hacia los glúteos, flexionando progresivamente la rodilla.',
    precautionSummary: 'Evitar dolor intenso y compensaciones.'
  },
  'flexion-asistida-con-toalla': {
    shortTab: 'Toalla',
    pos: 'Decúbito supino',
    executionSummary: 'Utilizar una toalla o cincha para acompañar suavemente la flexión de rodilla.',
    precautionSummary: 'No realizar tracciones bruscas.'
  },
  'flexion-autoasistida-pelota-mani': {
    shortTab: 'Pelota maní',
    pos: 'Decúbito supino',
    executionSummary: 'Piernas sobre pelota maní transversal; flexionar rodillas acompañando el rodamiento.',
    precautionSummary: 'Mantener el control de la pelvis y usar pelota de tamaño adecuado.'
  },
  'flexion-activa-en-sedestacion': {
    shortTab: 'Sedestación',
    pos: 'Borde de camilla/silla',
    executionSummary: 'Desplazar hacia atrás el pie operado utilizando el pie sano para asistir el movimiento.',
    precautionSummary: 'Mantener ambos glúteos apoyados y evitar elevar la pelvis.'
  },
  'flexion-asistida-prono': {
    shortTab: 'Prono (Kine)',
    pos: 'Decúbito prono',
    executionSummary: 'El kinesiólogo lleva a flexión, solicita isometría de cuádriceps (8–15 s) y acompaña la ganancia tras relajar.',
    precautionSummary: 'Requiere supervisión profesional. No es un ejercicio domiciliario independiente.'
  },
  'extension-pasiva-apoyo-talon': {
    shortTab: 'Extensión 0°',
    pos: 'Decúbito supino',
    executionSummary: 'Apoyo debajo del talón o tobillo con la rodilla libre en el aire, favoreciendo suavemente la extensión.',
    precautionSummary: 'No colocar almohadas bajo la rodilla; solo bajo el talón.'
  },
  'contraccion-isometrica-cuadriceps': {
    shortTab: 'Isométrico',
    pos: 'Decúbito supino',
    executionSummary: 'Con la pierna extendida, contraer el cuádriceps presionando la parte posterior de la rodilla hacia la camilla.',
    precautionSummary: 'No flexionar la articulación ni contener la respiración.'
  },
  'bombeo-activo-tobillo': {
    shortTab: 'Tobillo',
    pos: 'Acostado o sentado',
    executionSummary: 'Alternar lentamente dorsiflexión y flexión plantar del tobillo.',
    precautionSummary: 'Mantener la rodilla quieta y realizar de forma lenta y continua.'
  },
  'elevacion-pierna-extendida': {
    shortTab: 'Elevación',
    pos: 'Decúbito supino',
    executionSummary: 'Contraer el cuádriceps y elevar lentamente la pierna manteniendo la rodilla completamente extendida.',
    precautionSummary: 'Incluir únicamente cuando esté autorizado y sin déficit activo de extensión.'
  }
};

export const ExerciseCarousel: React.FC<ExerciseCarouselProps> = ({
  exercises,
  startIndexOffset = 0,
  variant = 'banner'
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex >= exercises.length) {
      setActiveIndex(0);
    }
  }, [exercises.length, activeIndex]);

  useEffect(() => {
    setExpanded(false);
  }, [activeIndex]);

  if (exercises.length === 0) {
    return null;
  }

  const currentExercise = exercises[activeIndex] || exercises[0];
  const meta = MICRO_META[currentExercise.id] || {
    shortTab: currentExercise.title.split(' ')[0],
    pos: currentExercise.initialPosition,
    executionSummary: currentExercise.movementCue,
    precautionSummary: currentExercise.precautions[0] || ''
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

  const displayNumber = String(startIndexOffset + activeIndex + 1).padStart(2, '0');
  const isBanner = variant === 'banner';

  return (
    <div
      className="relative select-none outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-roledescription="carousel"
      aria-label="Carrusel de ejercicios 3D"
    >
      {/* Selector superior de ejercicios */}
      <div
        role="tablist"
        aria-label="Seleccionar ejercicio"
        className={`mb-3 grid gap-1.5 sm:flex sm:items-center sm:gap-2 ${
          exercises.length === 5 ? 'grid-cols-5' : 'grid-cols-4'
        }`}
      >
        {exercises.map((item, idx) => {
          const isSelected = idx === activeIndex;
          const num = String(startIndexOffset + idx + 1).padStart(2, '0');
          const shortName = MICRO_META[item.id]?.shortTab || item.title.split(' ')[0];
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveIndex(idx)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 rounded-2xl sm:rounded-full px-2 py-2 sm:px-4 sm:py-2 text-center transition-all duration-200 border ${
                isSelected
                  ? isBanner
                    ? 'bg-[#1db8c4] border-[#38d9d6] text-white shadow-[0_0_20px_rgba(56,217,214,0.38)]'
                    : 'bg-sky-600 border-sky-300 text-white shadow-[0_0_20px_rgba(56,189,248,0.35)]'
                  : 'bg-[#0b2135] text-sky-200 border-cyan-300/20 hover:text-white hover:border-cyan-300/45'
              }`}
            >
              <span
                className={`text-[10px] font-extrabold tracking-wider ${
                  isSelected ? 'text-white' : 'text-[#38d9d6]'
                }`}
              >
                {num}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold truncate max-w-full">
                {shortName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tarjeta principal del carrusel */}
      <article
        key={currentExercise.id}
        className={`relative overflow-hidden rounded-[24px] border bg-[#0a1e30] shadow-soft-lg ${
          currentExercise.isSupervisedOnly
            ? 'border-amber-400/50'
            : isBanner
            ? 'border-[#38d9d6]/35'
            : 'border-sky-400/30'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* BLOQUE 1 (Izquierda / Arriba): Escenario 3D en vivo */}
          <div className="lg:col-span-7 p-3 sm:p-4 lg:p-5 lg:border-r lg:border-cyan-300/15 flex flex-col justify-between">
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="mb-2.5 flex items-start justify-between gap-2 px-1"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                      isBanner
                        ? 'bg-[#38d9d6]/20 text-[#67e8f9] border border-[#38d9d6]/35'
                        : 'bg-sky-500/20 text-sky-200 border border-sky-400/35'
                    }`}
                  >
                    Ejercicio {displayNumber} · {isBanner ? 'Banner LCA' : 'Complementario'}
                  </span>

                  {currentExercise.specialBadge && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        currentExercise.isSupervisedOnly
                          ? 'bg-amber-400/20 text-amber-200 border border-amber-400/45'
                          : 'bg-cyan-400/20 text-cyan-100 border border-cyan-300/35'
                      }`}
                    >
                      <Stethoscope className="h-3 w-3 shrink-0" />
                      <span>{currentExercise.specialBadge}</span>
                    </span>
                  )}
                </div>

                <h3 className="dala-display text-lg sm:text-2xl text-white leading-snug">
                  {currentExercise.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Ejercicio anterior"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/25 bg-[#061523] text-white hover:border-[#38d9d6] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Siguiente ejercicio"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/25 bg-[#061523] text-white hover:border-[#38d9d6] transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ExerciseDemonstration
              exercise={currentExercise}
              compact
              defaultPlaying
              heroStage
            />
          </div>

          {/* BLOQUE 2 (Derecha / Abajo): Ficha sintética clara + Explicación detallada al expandir */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="lg:col-span-5 p-3.5 sm:p-5 flex flex-col justify-between gap-3"
          >
            <div className="space-y-2.5">
              {/* Posición y Objetivo en dos tarjetas limpias de alto contraste */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-cyan-300/20 bg-[#071624] px-3 py-2.5">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#67e8f9]">
                    Posición
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold text-white leading-snug">
                    {meta.pos}
                  </span>
                </div>

                <div className="rounded-2xl border border-cyan-300/20 bg-[#071624] px-3 py-2.5">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#67e8f9]">
                    Objetivo
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold text-white leading-snug">
                    {currentExercise.goal}
                  </span>
                </div>
              </div>

              {/* Ejecución resumida */}
              <div className="rounded-2xl border border-cyan-300/20 bg-[#071624] px-3.5 py-2.5">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#67e8f9]">
                  Ejecución
                </span>
                <p className="mt-1 text-xs sm:text-sm text-sky-50 leading-relaxed">
                  {meta.executionSummary}
                </p>
              </div>

              {/* Precaución destacada */}
              <div
                className={`rounded-2xl border px-3.5 py-2.5 flex items-start gap-2.5 ${
                  currentExercise.isSupervisedOnly
                    ? 'border-amber-400/45 bg-amber-500/15 text-amber-100'
                    : 'border-cyan-300/20 bg-[#0d263d] text-sky-100'
                }`}
              >
                <ShieldAlert
                  className={`h-4 w-4 shrink-0 mt-0.5 ${
                    currentExercise.isSupervisedOnly ? 'text-amber-300' : 'text-[#38d9d6]'
                  }`}
                />
                <div className="text-xs leading-snug">
                  <strong className="font-bold text-white">Precaución: </strong>
                  <span>{meta.precautionSummary}</span>
                </div>
              </div>

              {/* Botón para expandir explicación detallada paso a paso */}
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between rounded-xl border border-cyan-300/25 bg-[#0e2942] px-3.5 py-2.5 text-xs font-bold text-white hover:border-[#38d9d6] transition-all"
              >
                <span>
                  {expanded ? 'Ocultar explicación detallada' : 'Ver explicación detallada paso a paso'}
                </span>
                {expanded ? (
                  <ChevronUp className="h-4 w-4 text-[#38d9d6]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#38d9d6]" />
                )}
              </button>

              {expanded && (
                <div className="rounded-2xl border border-cyan-300/20 bg-[#071624] p-3.5 text-xs space-y-2.5">
                  <ol className="space-y-1.5">
                    {currentExercise.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sky-50">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#38d9d6]/25 text-[10px] font-bold text-[#67e8f9] mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="pt-2 border-t border-cyan-300/15 text-[11px] text-sky-200">
                    <strong className="text-amber-300">Evitar: </strong>
                    {currentExercise.commonMistakes.join(' · ')}
                  </div>
                </div>
              )}
            </div>

            {/* Navegación inferior del carrusel */}
            <div className="pt-2.5 border-t border-cyan-300/15 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Diapositivas">
                {exercises.map((item, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Ir al ejercicio ${startIndexOffset + idx + 1}: ${item.title}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        active
                          ? 'w-6 bg-[#38d9d6] shadow-[0_0_10px_#38d9d6]'
                          : 'w-2 bg-cyan-200/25 hover:bg-cyan-200/50'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/ejercicios/${currentExercise.id}`}
                  className="inline-flex items-center gap-1 rounded-full border border-cyan-300/25 bg-[#071624] px-3 py-1.5 text-[11px] font-semibold text-sky-100 hover:text-white hover:border-[#38d9d6]"
                >
                  <span>Ficha</span>
                  <ArrowUpRight className="h-3 w-3 text-[#38d9d6]" />
                </Link>

                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-1 rounded-full bg-[#1db8c4] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[0_0_16px_rgba(56,217,214,0.35)] hover:bg-[#28cbd6] transition-all"
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
