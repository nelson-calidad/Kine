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
    modality: string;
    pos: string;
    executionSummary: string;
    precautionSummary: string;
  }
> = {
  'deslizamiento-del-talon': {
    shortTab: 'Talón',
    modality: 'Movilidad activa',
    pos: 'Decúbito supino',
    executionSummary:
      'Deslizar lentamente el talón hacia los glúteos, flexionando progresivamente la rodilla y regresando de forma controlada.',
    precautionSummary: 'Evitar dolor intenso y compensaciones pélvicas.'
  },
  'flexion-asistida-con-toalla': {
    shortTab: 'Toalla',
    modality: 'Movilidad autoasistida',
    pos: 'Decúbito supino',
    executionSummary:
      'Utilizar una toalla o cincha alrededor del pie para acompañar suavemente la flexión de rodilla.',
    precautionSummary: 'No realizar tracciones bruscas.'
  },
  'flexion-autoasistida-pelota-mani': {
    shortTab: 'Pelota maní',
    modality: 'Autoasistida con apoyo móvil',
    pos: 'Decúbito supino',
    executionSummary:
      'Apoyar las piernas sobre una pelota maní transversal y flexionar acompañando el desplazamiento de la pelota.',
    precautionSummary: 'Mantener el control de la pelvis y utilizar una pelota de tamaño adecuado.'
  },
  'flexion-activa-en-sedestacion': {
    shortTab: 'Sedestación',
    modality: 'Movilidad autoasistida',
    pos: 'Sentado al borde de camilla o silla alta',
    executionSummary:
      'Deslizar hacia atrás el pie operado utilizando el pie sano para asistir suavemente el movimiento.',
    precautionSummary: 'Mantener ambos glúteos apoyados y evitar elevar la pelvis.'
  },
  'flexion-asistida-prono': {
    shortTab: 'Prono',
    modality: 'Movilización pasiva asistida (contracción-relajación)',
    pos: 'Decúbito prono',
    executionSummary:
      'El kinesiólogo sostiene la pierna cerca de 90°, solicita contracción isométrica de cuádriceps (8–15 s) y acompaña la ganancia tras relajar.',
    precautionSummary:
      'Requiere supervisión profesional. No es un ejercicio domiciliario independiente.'
  },
  'extension-pasiva-apoyo-talon': {
    shortTab: 'Extensión 0°',
    modality: 'Movilidad pasiva',
    pos: 'Decúbito supino',
    executionSummary:
      'Colocar un apoyo debajo del talón o tobillo dejando la rodilla libre para favorecer suavemente la extensión.',
    precautionSummary: 'El apoyo va bajo el talón o tobillo, nunca de forma sostenida bajo la rodilla.'
  },
  'contraccion-isometrica-cuadriceps': {
    shortTab: 'Isométrico',
    modality: 'Activación muscular',
    pos: 'Decúbito supino',
    executionSummary:
      'Contraer el cuádriceps intentando presionar la parte posterior de la rodilla hacia la camilla, sin flexionar la articulación.',
    precautionSummary: 'Dosificar según tolerancia sin dolor rotuliano intenso.'
  },
  'bombeo-activo-tobillo': {
    shortTab: 'Tobillo',
    modality: 'Movilidad distal activa',
    pos: 'Acostado o sentado',
    executionSummary:
      'Alternar lentamente dorsiflexión y flexión plantar del tobillo manteniendo la rodilla estable.',
    precautionSummary: 'Realizar movimientos lentos y controlados.'
  },
  'elevacion-pierna-extendida': {
    shortTab: 'Elevación',
    modality: 'Control motor activo',
    pos: 'Decúbito supino',
    executionSummary:
      'Contraer el cuádriceps y elevar lentamente la pierna manteniendo la rodilla completamente extendida.',
    precautionSummary:
      'Incluir únicamente cuando esté autorizado y sin déficit de extensión activa.'
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
    modality: currentExercise.category,
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
      {/* Selector superior limpio */}
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
              className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 rounded-xl px-2 py-2 sm:px-3.5 sm:py-2 text-center transition-colors border ${
                isSelected
                  ? 'bg-[#25C8CC] border-[#25C8CC] text-[#061522]'
                  : 'bg-[#0B2030] text-[#A7B9C6] border-[#244154] hover:text-[#F1F7FA] hover:border-[#25C8CC]/60'
              }`}
            >
              <span
                className={`text-[10px] font-bold tracking-wider ${
                  isSelected ? 'text-[#061522]' : 'text-[#25C8CC]'
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

      {/* Tarjeta protagonista del ejercicio: 67% 3D (8 cols) / 33% Información (4 cols) */}
      <article
        key={currentExercise.id}
        className="relative overflow-hidden rounded-2xl border border-[#244154] bg-[#0B2030]"
      >
        {/* ENCABEZADO DE LA TARJETA: Número · Nombre · Tipo de movilidad · Indicador de supervisión */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex flex-wrap items-center justify-between gap-3 border-b border-[#244154] bg-[#10283A] px-4 py-3 sm:px-5"
        >
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <span className="inline-flex h-7 min-w-[32px] items-center justify-center rounded-lg bg-[#25C8CC] px-2 text-xs font-bold text-[#061522]">
              {displayNumber}
            </span>
            <div className="min-w-0">
              <h3 className="text-base sm:text-xl font-semibold text-[#F1F7FA] leading-tight">
                {currentExercise.title}
              </h3>
              <p className="text-xs text-[#A7B9C6]">{meta.modality}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentExercise.specialBadge && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                  currentExercise.isSupervisedOnly
                    ? 'bg-amber-500/15 text-amber-200 border-amber-400/40'
                    : 'bg-[#25C8CC]/15 text-[#82E5E4] border-[#25C8CC]/35'
                }`}
              >
                <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                <span>{currentExercise.specialBadge}</span>
              </span>
            )}

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Ejercicio anterior"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#244154] bg-[#0B2030] text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Siguiente ejercicio"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#244154] bg-[#0B2030] text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CUERPO: 67% ÁREA VISUAL 3D (lg:col-span-8) + 33% PANEL DE INFORMACIÓN (lg:col-span-4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* ÁREA VISUAL 3D PROTAGONISTA (67% en escritorio, arriba en móvil) */}
          <div className="lg:col-span-8 p-3 sm:p-4 lg:border-r lg:border-[#244154] flex flex-col justify-between bg-[#061522]/50">
            <ExerciseDemonstration
              exercise={currentExercise}
              compact
              defaultPlaying={isBanner}
              heroStage
            />
          </div>

          {/* PANEL DE INFORMACIÓN (33% en escritorio, debajo en móvil) */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="lg:col-span-4 p-4 sm:p-5 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              {/* Posición y Objetivo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                <div className="rounded-xl border border-[#244154] bg-[#10283A] px-3.5 py-2.5">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#82E5E4]">
                    Posición
                  </span>
                  <p className="mt-0.5 text-xs sm:text-sm font-medium text-[#F1F7FA]">
                    {meta.pos}
                  </p>
                </div>

                <div className="rounded-xl border border-[#244154] bg-[#10283A] px-3.5 py-2.5">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#82E5E4]">
                    Objetivo
                  </span>
                  <p className="mt-0.5 text-xs sm:text-sm font-medium text-[#F1F7FA]">
                    {currentExercise.goal}
                  </p>
                </div>
              </div>

              {/* Ejecución breve */}
              <div className="rounded-xl border border-[#244154] bg-[#10283A] px-3.5 py-2.5">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#82E5E4]">
                  Ejecución breve
                </span>
                <p className="mt-1 text-xs sm:text-sm text-[#F1F7FA] leading-relaxed">
                  {meta.executionSummary}
                </p>
              </div>

              {/* Precaución principal */}
              <div
                className={`rounded-xl border px-3.5 py-2.5 flex items-start gap-2.5 ${
                  currentExercise.isSupervisedOnly
                    ? 'border-amber-400/40 bg-amber-500/10 text-amber-100'
                    : 'border-[#244154] bg-[#10283A] text-[#A7B9C6]'
                }`}
              >
                <ShieldAlert
                  className={`h-4 w-4 shrink-0 mt-0.5 ${
                    currentExercise.isSupervisedOnly ? 'text-amber-300' : 'text-[#25C8CC]'
                  }`}
                />
                <div className="text-xs leading-relaxed">
                  <strong className="font-semibold text-[#F1F7FA]">Precaución principal: </strong>
                  <span>{meta.precautionSummary}</span>
                </div>
              </div>

              {/* Acordeón: Ver explicación completa */}
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between rounded-xl border border-[#244154] bg-[#10283A] px-3.5 py-2.5 text-xs font-semibold text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
              >
                <span>{expanded ? 'Ocultar explicación completa' : 'Ver explicación completa'}</span>
                {expanded ? (
                  <ChevronUp className="h-4 w-4 text-[#25C8CC]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#25C8CC]" />
                )}
              </button>

              {expanded && (
                <div className="rounded-xl border border-[#244154] bg-[#061522] p-3.5 text-xs space-y-2.5">
                  <ol className="space-y-1.5">
                    {currentExercise.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#F1F7FA]">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#25C8CC]/20 text-[10px] font-bold text-[#82E5E4] mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="pt-2 border-t border-[#244154] text-[11px] text-[#A7B9C6]">
                    <strong className="text-[#F1F7FA]">Conductas a evitar: </strong>
                    {currentExercise.commonMistakes.join(' · ')}
                  </div>
                </div>
              )}
            </div>

            {/* Pie del panel */}
            <div className="pt-3 border-t border-[#244154] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Diapositivas">
                {exercises.map((item, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Ir al ejercicio ${startIndexOffset + idx + 1}: ${item.title}`}
                      className={`h-2 rounded-full transition-all ${
                        active ? 'w-6 bg-[#25C8CC]' : 'w-2 bg-[#244154] hover:bg-[#A7B9C6]'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/ejercicios/${currentExercise.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#244154] bg-[#10283A] px-3 py-1.5 text-xs font-medium text-[#A7B9C6] hover:text-[#F1F7FA] hover:border-[#25C8CC]"
                >
                  <span>Ficha</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#25C8CC]" />
                </Link>

                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#25C8CC] px-3.5 py-1.5 text-xs font-semibold text-[#061522] hover:bg-[#82E5E4] transition-colors"
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
