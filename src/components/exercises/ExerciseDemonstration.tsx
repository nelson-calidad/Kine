import React, { useState } from 'react';
import { ArrowRight, ArrowDown, PlayCircle } from 'lucide-react';
import { Exercise } from '../../types/exercise';
import { ExerciseImage } from '../common/ExerciseImage';

interface ExerciseDemonstrationProps {
  exercise: Exercise;
}

export const ExerciseDemonstration: React.FC<ExerciseDemonstrationProps> = ({ exercise }) => {
  const [showVideo, setShowVideo] = useState(false);
  const hasRealVideo = Boolean(exercise.video && exercise.video.trim().length > 0);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-brand-bg/70 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-navy">
          Secuencia del movimiento (Inicio → Final)
        </span>

        {/* El botón "Ver video" solo aparece si existe un archivo real MP4/WebM */}
        {hasRealVideo && (
          <button
            type="button"
            onClick={() => setShowVideo((prev) => !prev)}
            aria-expanded={showVideo}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-brand-teal px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-brand-teal/90 transition-colors no-print"
          >
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            <span>{showVideo ? 'Ocultar video' : 'Ver video'}</span>
          </button>
        )}
      </div>

      {/* Comparativa visual Inicio -> Flecha de movimiento -> Final */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-11 md:items-center">
        {/* Imagen de posición inicial + Etiqueta "Inicio" */}
        <div className="md:col-span-5 rounded-2xl bg-white border border-slate-200/85 p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-brand-soft px-3 py-0.5 text-xs font-extrabold text-brand-navy">
              Inicio
            </span>
            <span className="text-[11px] font-semibold text-brand-muted">Posición inicial</span>
          </div>
          <ExerciseImage
            src={exercise.startImage}
            alt={`${exercise.title} - Posición inicial: ${exercise.startImageCaption}`}
            title={`${exercise.title} (Inicio)`}
            category="Inicio"
            className="h-44 sm:h-48 w-full"
          />
          <p className="mt-2 text-xs font-medium text-brand-text leading-snug">
            {exercise.startImageCaption}
          </p>
        </div>

        {/* Flecha de movimiento */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-1">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-white shadow-sm"
            aria-hidden="true"
          >
            <ArrowRight className="hidden md:block h-5 w-5" />
            <ArrowDown className="block md:hidden h-5 w-5" />
          </div>
        </div>

        {/* Imagen de posición final + Etiqueta "Final" */}
        <div className="md:col-span-5 rounded-2xl bg-white border border-brand-teal/40 p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-brand-teal px-3 py-0.5 text-xs font-extrabold text-white">
              Final
            </span>
            <span className="text-[11px] font-semibold text-brand-teal">Posición final</span>
          </div>
          <ExerciseImage
            src={exercise.endImage}
            alt={`${exercise.title} - Posición final: ${exercise.endImageCaption}`}
            title={`${exercise.title} (Final)`}
            category="Final"
            className="h-44 sm:h-48 w-full"
          />
          <p className="mt-2 text-xs font-semibold text-brand-navy leading-snug">
            {exercise.endImageCaption}
          </p>
        </div>
      </div>

      {/* Consigna del movimiento */}
      <div className="mt-3 rounded-xl bg-white px-3.5 py-2.5 border border-slate-200/80 text-xs sm:text-sm text-brand-navy font-semibold">
        Movimiento: <span className="font-medium text-brand-text">{exercise.movementCue}</span>
      </div>

      {/* Reproductor de video MP4/WebM (solo se renderiza si existe archivo real y se abrió) */}
      {hasRealVideo && showVideo && exercise.video && (
        <div className="mt-4 rounded-xl bg-white p-3 border border-brand-teal/35 no-print">
          <video
            controls
            playsInline
            preload="metadata"
            className="w-full max-h-80 rounded-lg bg-slate-950"
          >
            <source src={exercise.video} type="video/mp4" />
            <source src={exercise.video} type="video/webm" />
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
      )}
    </div>
  );
};
