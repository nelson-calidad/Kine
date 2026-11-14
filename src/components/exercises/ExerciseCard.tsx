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

  return (
    <article
      className={`exercise-card group relative flex flex-col rounded-2xl bg-[#0B2030] border border-[#244154] overflow-hidden transition-colors hover:border-[#25C8CC]/60 ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Encabezado: Número · Nombre · Tipo de movilidad · Indicador de supervisión */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#244154] bg-[#10283A] px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-md bg-[#25C8CC] px-1.5 text-xs font-bold text-[#061522]">
            {stepNumberLabel}
          </span>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-[#F1F7FA] truncate">
              <Link
                to={`/ejercicios/${exercise.id}`}
                className="hover:text-[#82E5E4] transition-colors"
              >
                {exercise.title}
              </Link>
            </h3>
            <p className="text-[11px] text-[#A7B9C6] truncate">{exercise.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {exercise.specialBadge && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                exercise.isSupervisedOnly
                  ? 'bg-amber-500/15 text-amber-200 border-amber-400/40'
                  : 'bg-[#25C8CC]/15 text-[#82E5E4] border-[#25C8CC]/35'
              }`}
            >
              <Stethoscope className="h-3 w-3 shrink-0" />
              <span>{exercise.specialBadge}</span>
            </span>
          )}

          <Link
            to={`/ejercicios/${exercise.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-[#244154] bg-[#0B2030] px-2.5 py-1 text-xs font-medium text-[#A7B9C6] hover:text-[#F1F7FA] hover:border-[#25C8CC]"
          >
            <span>Ficha</span>
            <ArrowUpRight className="h-3 w-3 text-[#25C8CC]" />
          </Link>
        </div>
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className={featured ? 'lg:grid lg:grid-cols-12 lg:items-stretch' : 'flex flex-col'}>
        {/* Área visual 3D (67% cuando es protagonista) */}
        <div
          className={
            featured
              ? 'lg:col-span-8 p-3 sm:p-4 lg:border-r lg:border-[#244154] bg-[#061522]/50'
              : 'p-3 bg-[#061522]/50'
          }
        >
          <ExerciseDemonstration exercise={exercise} compact heroStage={featured} />
        </div>

        {/* Panel de información resumida + Ver explicación completa */}
        <div
          className={
            featured
              ? 'lg:col-span-4 p-4 flex flex-col justify-between gap-3'
              : 'p-4 flex flex-col justify-between gap-3'
          }
        >
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#244154] bg-[#10283A] px-3 py-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#82E5E4]">
                  Posición
                </span>
                <span className="mt-0.5 block text-xs text-[#F1F7FA] leading-snug">
                  {exercise.initialPosition}
                </span>
              </div>
              <div className="rounded-xl border border-[#244154] bg-[#10283A] px-3 py-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#82E5E4]">
                  Objetivo
                </span>
                <span className="mt-0.5 block text-xs text-[#F1F7FA] leading-snug">
                  {exercise.goal}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-[#244154] bg-[#10283A] px-3 py-2">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#82E5E4]">
                Ejecución breve
              </span>
              <p className="mt-0.5 text-xs text-[#F1F7FA] leading-relaxed">
                {exercise.movementCue}
              </p>
            </div>

            <div
              className={`rounded-xl border px-3 py-2 flex items-start gap-2 text-xs ${
                exercise.isSupervisedOnly
                  ? 'border-amber-400/40 bg-amber-500/10 text-amber-100'
                  : 'border-[#244154] bg-[#10283A] text-[#A7B9C6]'
              }`}
            >
              <ShieldAlert
                className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                  exercise.isSupervisedOnly ? 'text-amber-300' : 'text-[#25C8CC]'
                }`}
              />
              <span className="leading-snug">
                <strong className="font-semibold text-[#F1F7FA]">Precaución principal: </strong>
                {exercise.precautions[0]}
              </span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between rounded-xl border border-[#244154] bg-[#10283A] px-3.5 py-2 text-xs font-semibold text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
            >
              <span>{isOpen ? 'Ocultar explicación completa' : 'Ver explicación completa'}</span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-[#25C8CC]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#25C8CC]" />
              )}
            </button>

            {isOpen && (
              <div className="mt-2.5 space-y-2 rounded-xl border border-[#244154] bg-[#061522] p-3 text-xs">
                <ol className="space-y-1.5">
                  {exercise.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[#F1F7FA]">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#25C8CC]/20 text-[10px] font-bold text-[#82E5E4] mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="pt-2 border-t border-[#244154] text-[11px] text-[#A7B9C6]">
                  <strong className="text-[#F1F7FA]">Evitar: </strong>
                  {exercise.commonMistakes.join(' · ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
