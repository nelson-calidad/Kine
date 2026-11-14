import React, { useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Stethoscope,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Exercise } from '../../types/exercise';
import { ExerciseDemonstration } from './ExerciseDemonstration';

interface ExerciseModalProps {
  exercises: Exercise[];
  activeIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  exercises,
  activeIndex,
  onClose,
  onSelectIndex
}) => {
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onSelectIndex((activeIndex - 1 + exercises.length) % exercises.length);
      } else if (e.key === 'ArrowRight') {
        onSelectIndex((activeIndex + 1) % exercises.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, exercises.length, onClose, onSelectIndex]);

  if (activeIndex === null || !exercises[activeIndex]) return null;

  const exercise = exercises[activeIndex];
  const stepNumberLabel = String(activeIndex + 1).padStart(2, '0');
  const totalLabel = String(exercises.length).padStart(2, '0');

  const handlePrev = () => {
    onSelectIndex((activeIndex - 1 + exercises.length) % exercises.length);
  };

  const handleNext = () => {
    onSelectIndex((activeIndex + 1) % exercises.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040E17]/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-exercise-title"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-5xl rounded-2xl border border-[#244154] bg-[#0B2030] shadow-soft-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior de la vista ampliada */}
        <div className="flex items-center justify-between gap-3 border-b border-[#1E394B] bg-[#0E2638] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-md bg-[#25C8CC] px-1.5 text-xs font-bold text-[#061522]">
              {stepNumberLabel}
            </span>
            <div className="min-w-0">
              <h2
                id="modal-exercise-title"
                className="text-base sm:text-lg font-semibold text-[#F1F7FA] truncate"
              >
                {exercise.title}
              </h2>
              <p className="text-[11px] text-[#82E5E4] truncate">{exercise.goal}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#244154] bg-[#061522] px-2.5 text-xs font-medium text-[#A7B9C6] hover:text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
              aria-label="Ejercicio anterior"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-[#25C8CC]" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <span className="px-1.5 text-[11px] font-medium text-[#A7B9C6]">
              {stepNumberLabel} / {totalLabel}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#244154] bg-[#061522] px-2.5 text-xs font-medium text-[#A7B9C6] hover:text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
              aria-label="Siguiente ejercicio"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="h-3.5 w-3.5 text-[#25C8CC]" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#244154] bg-[#061522] text-[#A7B9C6] hover:text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
              aria-label="Cerrar vista ampliada"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contenido principal dividido: 3D Grande + Técnica Detallada */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
          <div className="lg:col-span-7 p-3 sm:p-5 bg-[#061522]/60 lg:border-r lg:border-[#1E394B] flex flex-col justify-center">
            <ExerciseDemonstration
              exercise={exercise}
              compact
              heroStage
              defaultPlaying
            />
          </div>

          <div className="lg:col-span-5 p-4 sm:p-5 space-y-4">
            {exercise.specialBadge && (
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
                  exercise.isSupervisedOnly
                    ? 'bg-amber-500/15 text-amber-200 border-amber-400/40'
                    : 'bg-[#25C8CC]/15 text-[#82E5E4] border-[#25C8CC]/35'
                }`}
              >
                <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                <span>{exercise.specialBadge}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-[#1E394B] bg-[#10283A] p-3">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#82E5E4]">
                  Posición inicial
                </span>
                <span className="mt-1 block text-xs text-[#F1F7FA] leading-snug">
                  {exercise.initialPosition}
                </span>
              </div>
              <div className="rounded-xl border border-[#1E394B] bg-[#10283A] p-3">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#82E5E4]">
                  Modalidad
                </span>
                <span className="mt-1 block text-xs text-[#F1F7FA] leading-snug">
                  {exercise.category}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#82E5E4] mb-2">
                Técnica paso a paso
              </h3>
              <ol className="space-y-2">
                {exercise.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl border border-[#1E394B] bg-[#061522]/70 p-2.5 text-xs text-[#F1F7FA]"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#25C8CC]/20 text-[11px] font-bold text-[#82E5E4]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div
              className={`rounded-xl border p-3 text-xs space-y-1.5 ${
                exercise.isSupervisedOnly
                  ? 'border-amber-400/40 bg-amber-500/10 text-amber-100'
                  : 'border-[#1E394B] bg-[#10283A] text-[#A7B9C6]'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-[#F1F7FA]">
                <ShieldAlert
                  className={`h-3.5 w-3.5 shrink-0 ${
                    exercise.isSupervisedOnly ? 'text-amber-300' : 'text-[#25C8CC]'
                  }`}
                />
                <span>Precauciones e indicaciones clínicas</span>
              </div>
              <ul className="space-y-1 pl-5 list-disc">
                {exercise.precautions.map((p, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#1E394B] bg-[#061522]/60 p-3 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#F1F7FA]">
                <AlertCircle className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                <span>Detener el ejercicio si aparece:</span>
              </div>
              <p className="text-[#A7B9C6] leading-relaxed">
                {exercise.stopConditions.join(' · ')}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#A7B9C6]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#25C8CC] shrink-0" />
              <span>{exercise.professionalNotes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
