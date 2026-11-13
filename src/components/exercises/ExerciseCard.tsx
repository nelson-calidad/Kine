import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  ArrowUpRight
} from 'lucide-react';
import { Exercise } from '../../types/exercise';
import { ExerciseInstructions } from './ExerciseInstructions';
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
      className={`exercise-card group relative flex flex-col rounded-[22px] bg-[#06060b] border border-white/10 overflow-hidden transition-all duration-200 hover:border-electric-iris/50 ${
        featured ? 'lg:col-span-2 lg:grid lg:grid-cols-12 lg:items-stretch' : ''
      }`}
    >
      {/* Bloque 1: Cabecera compacta + Escenario 3D */}
      <div className={featured ? 'lg:col-span-7 flex flex-col justify-between lg:border-r lg:border-white/10' : 'flex flex-col'}>
        <div className="px-3.5 pt-3.5 pb-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-saffron-spark">
                {stepNumberLabel}
              </span>
              <span className="text-white/20">·</span>
              <span className="text-[10px] text-ash-gray truncate">{exercise.category}</span>
            </div>
            <h2 className="dala-display text-lg sm:text-xl text-bone-white truncate mt-0.5">
              <Link to={`/ejercicios/${exercise.id}`} className="hover:text-electric-iris transition-colors">
                {exercise.title}
              </Link>
            </h2>
          </div>

          <Link
            to={`/ejercicios/${exercise.id}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-silver-mist hover:text-bone-white"
          >
            <span>Ficha</span>
            <ArrowUpRight className="h-3 w-3 text-electric-iris" />
          </Link>
        </div>

        <div className="px-3 pb-3">
          <ExerciseDemonstration exercise={exercise} compact />
        </div>
      </div>

      {/* Bloque 2: Resumen corto + Detalles ocultos hasta tocar */}
      <div className={featured ? 'lg:col-span-5 flex flex-col justify-between p-3.5 sm:p-4' : 'flex flex-col px-3.5 pb-3.5'}>
        <div className="rounded-xl border border-white/10 bg-[#0a0a12] divide-y divide-white/[0.06] mb-2.5">
          {exercise.steps.slice(0, 3).map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 px-2.5 py-2 text-xs">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-electric-iris/20 text-[9px] font-bold text-electric-iris">
                {idx + 1}
              </span>
              <span className="text-silver-mist font-light leading-snug">{step}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold text-silver-mist hover:text-bone-white transition-all"
        >
          <span>{isOpen ? 'Ocultar cuidados y pauta' : 'Ver cuidados y mi pauta'}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {isOpen && (
          <div className="mt-2.5 space-y-2.5 rounded-xl border border-white/10 bg-[#0a0a12] p-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-spark">
                Evitar
              </span>
              <ul className="mt-1 space-y-1 text-silver-mist font-light">
                {exercise.commonMistakes.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-saffron-spark font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-white/10">
              <ExerciseInstructions exerciseId={exercise.id} exerciseTitle={exercise.title} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
