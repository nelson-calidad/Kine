import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ShieldAlert,
  Stethoscope
} from 'lucide-react';
import { Exercise } from '../../types/exercise';
import { ExerciseDemonstration } from './ExerciseDemonstration';

interface ExerciseCardProps {
  exercise: Exercise;
  indexNumber: number;
  nextExerciseId?: string;
  featured?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  indexNumber,
  featured = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const stepNumberLabel = String(indexNumber).padStart(2, '0');
  const isComplementary = exercise.section === 'complementario';

  return (
    <article
      className={`exercise-card group relative flex flex-col rounded-[22px] bg-[#0a1e30] border overflow-hidden transition-all duration-200 shadow-soft ${
        exercise.isSupervisedOnly
          ? 'border-amber-400/50 hover:border-amber-300'
          : isComplementary
          ? 'border-sky-400/30 hover:border-sky-300/60'
          : 'border-[#38d9d6]/35 hover:border-[#38d9d6]/75'
      } ${featured ? 'lg:col-span-2 lg:grid lg:grid-cols-12 lg:items-stretch' : ''}`}
    >
      {/* Bloque 1: Cabecera + Animación 3D */}
      <div
        className={
          featured
            ? 'lg:col-span-7 flex flex-col justify-between lg:border-r lg:border-cyan-300/15'
            : 'flex flex-col'
        }
      >
        <div className="px-4 pt-3.5 pb-2.5 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                  isComplementary
                    ? 'bg-sky-500/20 text-sky-200 border border-sky-400/35'
                    : 'bg-[#38d9d6]/20 text-[#67e8f9] border border-[#38d9d6]/35'
                }`}
              >
                {stepNumberLabel} · {isComplementary ? 'Complementario' : 'Banner LCA'}
              </span>

              {exercise.specialBadge && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    exercise.isSupervisedOnly
                      ? 'bg-amber-400/20 text-amber-200 border border-amber-400/45'
                      : 'bg-cyan-400/20 text-cyan-100 border border-cyan-300/35'
                  }`}
                >
                  <Stethoscope className="h-3 w-3 shrink-0" />
                  <span>{exercise.specialBadge}</span>
                </span>
              )}
            </div>

            <h2 className="dala-display text-lg sm:text-xl text-white leading-snug">
              <Link
                to={`/ejercicios/${exercise.id}`}
                className="hover:text-[#67e8f9] transition-colors"
              >
                {exercise.title}
              </Link>
            </h2>
          </div>

          <Link
            to={`/ejercicios/${exercise.id}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan-300/25 bg-[#071624] px-2.5 py-1 text-[10px] font-bold text-sky-100 hover:text-white hover:border-[#38d9d6]"
          >
            <span>Ficha</span>
            <ArrowUpRight className="h-3 w-3 text-[#38d9d6]" />
          </Link>
        </div>

        <div className="px-3 pb-3">
          <ExerciseDemonstration exercise={exercise} compact />
        </div>
      </div>

      {/* Bloque 2: Resumen conciso + Explicación detallada al expandir */}
      <div
        className={
          featured
            ? 'lg:col-span-5 flex flex-col justify-between p-4'
            : 'flex flex-col px-4 pb-4'
        }
      >
        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-cyan-300/20 bg-[#071624] px-3 py-2">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#67e8f9]">
                Posición
              </span>
              <span className="mt-0.5 block text-xs font-medium text-white leading-snug">
                {exercise.initialPosition}
              </span>
            </div>
            <div className="rounded-xl border border-cyan-300/20 bg-[#071624] px-3 py-2">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#67e8f9]">
                Objetivo
              </span>
              <span className="mt-0.5 block text-xs font-medium text-white leading-snug">
                {exercise.goal}
              </span>
            </div>
          </div>

          <div
            className={`rounded-xl border px-3 py-2 flex items-start gap-2 text-xs ${
              exercise.isSupervisedOnly
                ? 'border-amber-400/45 bg-amber-500/15 text-amber-100'
                : 'border-cyan-300/20 bg-[#0d263d] text-sky-100'
            }`}
          >
            <ShieldAlert
              className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                exercise.isSupervisedOnly ? 'text-amber-300' : 'text-[#38d9d6]'
              }`}
            />
            <span className="leading-snug">
              <strong className="font-bold text-white">Precaución: </strong>
              {exercise.precautions[0]}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between rounded-xl border border-cyan-300/25 bg-[#0e2942] px-3.5 py-2 text-xs font-bold text-white hover:border-[#38d9d6] transition-all"
        >
          <span>{isOpen ? 'Ocultar explicación detallada' : 'Ver explicación detallada'}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-[#38d9d6]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#38d9d6]" />
          )}
        </button>

        {isOpen && (
          <div className="mt-2.5 space-y-2 rounded-xl border border-cyan-300/20 bg-[#071624] p-3 text-xs">
            <ol className="space-y-1.5">
              {exercise.steps.map((step, idx) => (
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
              {exercise.commonMistakes.join(' · ')}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
