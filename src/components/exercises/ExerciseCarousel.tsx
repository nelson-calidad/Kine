import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ListOrdered,
  AlertCircle,
  ShieldAlert,
  SlidersHorizontal,
  UserCheck,
  Wrench
} from 'lucide-react';
import { Exercise } from '../../types/exercise';
import { ExerciseDemonstration } from './ExerciseDemonstration';
import { ExerciseInstructions } from './ExerciseInstructions';

interface ExerciseCarouselProps {
  exercises: Exercise[];
  allExercisesCount?: number;
}

export const ExerciseCarousel: React.FC<ExerciseCarouselProps> = ({ exercises }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'steps' | 'avoid' | 'precautions' | 'notes'>('steps');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex >= exercises.length) {
      setActiveIndex(0);
    }
  }, [exercises.length, activeIndex]);

  if (exercises.length === 0) {
    return null;
  }

  const currentExercise = exercises[activeIndex] || exercises[0];
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
    if (Math.abs(deltaX) > 48) {
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
      aria-label="Carrusel interactivo de ejercicios 3D"
    >
      {/* Top horizontal exercise selector bar (01 - 05) */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Seleccionar ejercicio del carrusel"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
        >
          {exercises.map((item, idx) => {
            const isSelected = idx === activeIndex;
            const num = String(idx + 1).padStart(2, '0');
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveIndex(idx)}
                className={`group inline-flex shrink-0 items-center gap-2.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-300 ${
                  isSelected
                    ? 'bg-electric-iris text-bone-white shadow-[0_0_24px_rgba(128,82,255,0.45)]'
                    : 'bg-white/[0.03] text-ash-gray border border-white/10 hover:text-bone-white hover:border-white/25'
                }`}
              >
                <span
                  className={`text-[11px] font-semibold tracking-wider ${
                    isSelected ? 'text-bone-white' : 'text-saffron-spark'
                  }`}
                >
                  {num}
                </span>
                <span className="truncate max-w-[140px] sm:max-w-[200px]">{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Prev / Next controls */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Ejercicio anterior"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-bone-white hover:border-electric-iris hover:bg-electric-iris/20 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Siguiente ejercicio"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-bone-white hover:border-electric-iris hover:bg-electric-iris/20 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main 3D Carousel Stage Card (Dala Obsidian Surface on Pure Void) */}
      <article
        key={currentExercise.id}
        className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/10 bg-[#050508] shadow-[0_30px_90px_rgba(0,0,0,0.95)]"
      >
        {/* Subtle ambient chromatic glow behind active slide */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -left-24 h-72 w-72 rounded-full bg-electric-iris/15 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-deep-verdant/15 blur-[90px]"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
          {/* LEFT / TOP COLUMN (7 cols): Interactive 3D Human Biomechanical Viewer */}
          <div className="lg:col-span-7 flex flex-col justify-between p-3 sm:p-5 lg:p-6 lg:border-r lg:border-white/10">
            {/* Mobile header bar inside stage */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="mb-3 flex items-center justify-between gap-2 px-1"
            >
              <div className="flex items-center gap-2">
                <span className="dala-label text-saffron-spark">
                  {stepNum} / {totalNum}
                </span>
                <span className="text-white/25">·</span>
                <span className="text-xs font-medium text-silver-mist">
                  {currentExercise.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:hidden">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Ejercicio anterior"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-bone-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Siguiente ejercicio"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-bone-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 3D Articulated Demonstration Stage */}
            <ExerciseDemonstration
              exercise={currentExercise}
              compact
              defaultPlaying
              heroStage
            />

            {/* Bottom movement cue & 3D interaction hint */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-ash-gray"
            >
              <p className="font-light text-silver-mist">{currentExercise.movementCue}</p>
              <span className="text-[11px] text-ash-gray hidden sm:inline">
                Arrastrá el modelo 3D para rotar el ángulo
              </span>
            </div>
          </div>

          {/* RIGHT / BOTTOM COLUMN (5 cols): Sculptural Dala Typography + Step-by-Step Tabs */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-7 lg:p-8"
          >
            <div>
              {/* Saffron Spark Category Label */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="dala-label text-saffron-spark">
                  PASO {stepNum} · {currentExercise.category}
                </span>
                <Link
                  to={`/ejercicios/${currentExercise.id}`}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-silver-mist hover:border-electric-iris hover:text-bone-white transition-colors"
                >
                  <span>Ficha</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-electric-iris" />
                </Link>
              </div>

              {/* Sculptural Display Headline (Weight 400, -0.04em tracking) */}
              <h3 className="dala-display text-2xl sm:text-3xl lg:text-[34px] text-bone-white">
                {currentExercise.title}
              </h3>

              {/* Ultra-Light Body Copy (Weight 200, Silver Mist) */}
              <p className="mt-2.5 text-sm sm:text-base font-extralight text-silver-mist leading-relaxed">
                {currentExercise.goal}
              </p>

              {/* Minimal Hairline Metadata Strip */}
              <div className="mt-4 grid grid-cols-1 gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <UserCheck className="h-4 w-4 shrink-0 text-electric-iris mt-0.5" />
                  <p className="text-silver-mist font-light leading-snug">
                    <strong className="font-semibold text-bone-white">Posición: </strong>
                    {currentExercise.initialPosition}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 border-t border-white/10 pt-2">
                  <Wrench className="h-4 w-4 shrink-0 text-saffron-spark" />
                  <p className="text-silver-mist font-light truncate">
                    <strong className="font-semibold text-bone-white">Elemento: </strong>
                    {currentExercise.equipment}
                  </p>
                </div>
              </div>

              {/* Interactive Clinical Tabs */}
              <div
                role="tablist"
                aria-label="Guía clínica del ejercicio"
                className="mt-5 grid grid-cols-4 gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'steps'}
                  onClick={() => setActiveTab('steps')}
                  className={`flex items-center justify-center gap-1 rounded-full py-1.5 text-[11px] font-semibold transition-all ${
                    activeTab === 'steps'
                      ? 'bg-electric-iris text-white shadow-[0_0_16px_rgba(128,82,255,0.4)]'
                      : 'text-ash-gray hover:text-bone-white'
                  }`}
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                  <span>Pasos</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'avoid'}
                  onClick={() => setActiveTab('avoid')}
                  className={`flex items-center justify-center gap-1 rounded-full py-1.5 text-[11px] font-semibold transition-all ${
                    activeTab === 'avoid'
                      ? 'bg-saffron-spark text-void'
                      : 'text-ash-gray hover:text-bone-white'
                  }`}
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Evitar</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'precautions'}
                  onClick={() => setActiveTab('precautions')}
                  className={`flex items-center justify-center gap-1 rounded-full py-1.5 text-[11px] font-semibold transition-all ${
                    activeTab === 'precautions'
                      ? 'bg-rose-500 text-white'
                      : 'text-ash-gray hover:text-bone-white'
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Cuidados</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'notes'}
                  onClick={() => setActiveTab('notes')}
                  className={`flex items-center justify-center gap-1 rounded-full py-1.5 text-[11px] font-semibold transition-all ${
                    activeTab === 'notes'
                      ? 'bg-deep-verdant text-white'
                      : 'text-ash-gray hover:text-bone-white'
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Dosis</span>
                </button>
              </div>

              {/* Active Tab Panel */}
              <div className="mt-3.5 min-h-[170px] rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs sm:text-sm">
                {activeTab === 'steps' && (
                  <ol className="space-y-2.5">
                    {currentExercise.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-silver-mist font-light">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-electric-iris/20 border border-electric-iris/40 text-[11px] font-semibold text-bone-white mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {activeTab === 'avoid' && (
                  <ul className="space-y-2 text-silver-mist font-light">
                    {currentExercise.commonMistakes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="font-bold text-saffron-spark">✕</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'precautions' && (
                  <div className="space-y-2.5 text-silver-mist font-light">
                    <ul className="space-y-1.5">
                      {currentExercise.precautions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-bold text-rose-400">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="pt-2 border-t border-white/10 text-xs text-ash-gray">
                      <strong className="text-rose-400 font-semibold">Detener si aparece:</strong>{' '}
                      {currentExercise.stopConditions.join(' ')}
                    </p>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div>
                    <ExerciseInstructions
                      exerciseId={currentExercise.id}
                      exerciseTitle={currentExercise.title}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Carousel Bottom Navigation Bar: Dala #8052ff Indicator Dots + Next Exercise Pill */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              {/* Dala Carousel Indicator Dots (8px circular #8052ff active) */}
              <div className="flex items-center gap-2" role="tablist" aria-label="Indicador de diapositiva">
                {exercises.map((item, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Ir al ejercicio ${idx + 1}: ${item.title}`}
                      aria-current={active ? 'true' : undefined}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        active
                          ? 'w-7 bg-electric-iris shadow-[0_0_12px_#8052ff]'
                          : 'w-2.5 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-full bg-electric-iris px-4 py-2 text-xs font-semibold text-bone-white shadow-[0_0_24px_rgba(128,82,255,0.4)] hover:bg-[#9168ff] transition-all"
              >
                <span>Siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
