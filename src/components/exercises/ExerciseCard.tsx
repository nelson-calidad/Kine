import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Maximize2,
  ShieldAlert,
  Stethoscope
} from 'lucide-react';
import { Exercise } from '../../types/exercise';
import { ExerciseDemonstration } from './ExerciseDemonstration';

interface ExerciseCardProps {
  exercise: Exercise;
  indexNumber: number;
  onExpand?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  indexNumber,
  onExpand
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const stepNumberLabel = String(indexNumber).padStart(2, '0');

  return (
    <article className="exercise-card group relative flex flex-col rounded-2xl bg-[#0B2030] border border-[#1E394B] overflow-hidden transition-colors hover:border-[#25C8CC]/50">
      {/* 1. Número, Nombre y Breve Objetivo */}
      <div
        onClick={onExpand}
        role={onExpand ? 'button' : undefined}
        tabIndex={onExpand ? 0 : undefined}
        onKeyDown={
          onExpand
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onExpand();
                }
              }
            : undefined
        }
        className={`flex items-start justify-between gap-2.5 border-b border-[#1E394B] bg-[#0E2638] px-4 py-3 ${
          onExpand ? 'cursor-pointer' : ''
        }`}
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="mt-0.5 inline-flex h-6 min-w-[26px] shrink-0 items-center justify-center rounded-md bg-[#25C8CC] px-1.5 text-xs font-bold text-[#061522]">
            {stepNumberLabel}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-[#F1F7FA] leading-snug group-hover:text-[#82E5E4] transition-colors">
              {exercise.title}
            </h3>
            <p className="mt-0.5 text-xs text-[#A7B9C6] leading-snug">
              {exercise.goal}
            </p>
          </div>
        </div>

        {onExpand && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            title="Abrir vista ampliada"
            aria-label={`Ampliar ${exercise.title}`}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#1E394B] bg-[#061522]/70 text-[#A7B9C6] hover:text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
          >
            <Maximize2 className="h-3.5 w-3.5 text-[#25C8CC]" />
          </button>
        )}
      </div>

      {/* 2. Animación 3D protagonista + Controles simples */}
      <div className="p-2.5 bg-[#061522]/50">
        <ExerciseDemonstration exercise={exercise} compact />
      </div>

      {/* 3. Indicaciones clínicas breves + Botón «Ver técnica» */}
      <div className="flex flex-1 flex-col justify-between gap-2.5 p-3.5 pt-2.5">
        <div className="space-y-2">
          {exercise.specialBadge && (
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                exercise.isSupervisedOnly
                  ? 'bg-amber-500/15 text-amber-200 border-amber-400/40'
                  : 'bg-[#25C8CC]/15 text-[#82E5E4] border-[#25C8CC]/35'
              }`}
            >
              <Stethoscope className="h-3 w-3 shrink-0" />
              <span>{exercise.specialBadge}</span>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-xl border border-[#1E394B] bg-[#0E2638]/70 px-3 py-2 text-xs text-[#A7B9C6]">
            <ShieldAlert
              className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                exercise.isSupervisedOnly ? 'text-amber-300' : 'text-[#25C8CC]'
              }`}
            />
            <span className="leading-snug">
              <strong className="font-medium text-[#F1F7FA]">Precaución: </strong>
              {exercise.precautions[0]}
            </span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="flex w-full items-center justify-between rounded-xl border border-[#1E394B] bg-[#10283A] px-3.5 py-2 text-xs font-medium text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
          >
            <span>{isOpen ? 'Ocultar técnica' : 'Ver técnica'}</span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-[#25C8CC]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#25C8CC]" />
            )}
          </button>

          {isOpen && (
            <div className="mt-2.5 space-y-2 rounded-xl border border-[#1E394B] bg-[#061522] p-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-1 pb-2 border-b border-[#1E394B] text-[11px] text-[#A7B9C6]">
                <span>
                  <strong className="text-[#F1F7FA]">Posición:</strong> {exercise.initialPosition}
                </span>
                <span>{exercise.category}</span>
              </div>

              <ol className="space-y-1.5 pt-0.5">
                {exercise.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#F1F7FA]">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#25C8CC]/20 text-[10px] font-bold text-[#82E5E4] mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="pt-2 border-t border-[#1E394B] text-[11px] text-[#A7B9C6]">
                <strong className="text-[#F1F7FA]">Evitar: </strong>
                {exercise.commonMistakes.join(' · ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
