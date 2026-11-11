import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShieldAlert,
  Wrench,
  UserCheck,
  Stethoscope,
  ListOrdered,
  Maximize2
} from 'lucide-react';
import { Exercise } from '../../types/exercise';
import { ExerciseImage } from '../common/ExerciseImage';
import { ExerciseInstructions } from './ExerciseInstructions';
import { ExerciseDemonstration } from './ExerciseDemonstration';

interface ExerciseCardProps {
  exercise: Exercise;
  indexNumber: number;
  nextExerciseId?: string;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  indexNumber,
  nextExerciseId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'steps' | 'avoid' | 'precautions' | null>('steps');

  const toggleAccordion = (section: 'steps' | 'avoid' | 'precautions') => {
    setOpenAccordion((prev) => (prev === section ? null : section));
  };

  return (
    <article className="flex flex-col rounded-card-lg bg-white border border-slate-200/90 shadow-soft overflow-hidden transition-all duration-200 hover:shadow-soft-lg">
      {/* 1. IMAGEN GRANDE DEL EJERCICIO */}
      <div className="p-4 sm:p-5 pb-0">
        <ExerciseImage
          src={exercise.image}
          alt={exercise.imageAlt}
          title={exercise.title}
          category={exercise.category}
          className="h-56 sm:h-64 w-full"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* 4. CATEGORÍA + Número de ejercicio */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-brand-soft px-3.5 py-1 text-xs font-extrabold text-brand-navy">
            {exercise.category}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
            Ejercicio {indexNumber} de 5
          </span>
        </div>

        {/* 2. NOMBRE */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy leading-snug">
          <Link to={`/ejercicios/${exercise.id}`} className="hover:text-brand-teal transition-colors">
            {exercise.title}
          </Link>
        </h2>

        {/* 3. OBJETIVO EN UNA ORACIÓN */}
        <p className="mt-2 text-base text-brand-text leading-relaxed">
          {exercise.goal}
        </p>

        {/* 5. POSICIÓN INICIAL y 6. MATERIAL NECESARIO */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 rounded-2xl bg-brand-bg border border-slate-200/75 p-4 text-sm">
          <div className="flex items-start gap-2.5">
            <UserCheck className="h-4 w-4 shrink-0 text-brand-teal mt-1" aria-hidden="true" />
            <div>
              <span className="font-bold text-brand-navy">Posición inicial: </span>
              <span className="text-brand-text">{exercise.initialPosition}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 border-t border-slate-200/60 pt-2.5">
            <Wrench className="h-4 w-4 shrink-0 text-brand-teal mt-1" aria-hidden="true" />
            <div>
              <span className="font-bold text-brand-navy">Material necesario: </span>
              <span className="text-brand-text">{exercise.equipment}</span>
            </div>
          </div>
        </div>

        {/* Condición especial si aplica (ej. Bicicleta estática) */}
        {exercise.specialBadge && (
          <div className="mt-3 rounded-xl bg-amber-50/90 border border-brand-warning/35 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-brand-warning">
            {exercise.specialBadge}
          </div>
        )}

        {/* AVISO DE SEGURIDAD CLÍNICA OBLIGATORIO EN TODAS LAS TARJETAS */}
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-soft/55 border border-brand-teal/30 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-brand-navy">
          <Stethoscope className="h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
          <span>Realizá únicamente los ejercicios autorizados por tu kinesiólogo.</span>
        </div>

        {/* 7. BOTÓN "Ver cómo hacerlo" */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="inline-flex flex-1 min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-sm sm:text-base font-bold text-white shadow-sm hover:bg-brand-navy/90 transition-colors"
          >
            <span>{isOpen ? 'Ocultar cómo hacerlo' : 'Ver cómo hacerlo'}</span>
            {isOpen ? (
              <ChevronUp className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <Link
            to={`/ejercicios/${exercise.id}`}
            className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-bold text-brand-navy hover:bg-brand-soft/50 transition-colors"
            title={`Abrir vista completa de ${exercise.title}`}
          >
            <Maximize2 className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            <span>Ficha completa</span>
          </Link>
        </div>

        {/* CONTENIDO DESPLEGABLE AL ABRIR LA TARJETA (Acordeones de detalles + Demostración Inicio/Final) */}
        {isOpen && (
          <div className="mt-5 space-y-3 border-t border-slate-200/80 pt-5">
            {/* Componente de demostración Inicio -> Flecha -> Final */}
            <ExerciseDemonstration exercise={exercise} />

            {/* Acordeón 1: Instrucciones paso a paso */}
            <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion('steps')}
                aria-expanded={openAccordion === 'steps'}
                className="flex w-full min-h-[48px] items-center justify-between gap-3 px-4 py-3 text-left font-extrabold text-brand-navy hover:bg-brand-bg/60 transition-colors"
              >
                <span className="flex items-center gap-2 text-sm sm:text-base">
                  <ListOrdered className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                  Cómo realizarlo (paso a paso)
                </span>
                {openAccordion === 'steps' ? (
                  <ChevronUp className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                )}
              </button>

              {openAccordion === 'steps' && (
                <div className="border-t border-slate-100 px-4 py-3.5 bg-brand-bg/40">
                  <ol className="space-y-2.5">
                    {exercise.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-brand-text">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-extrabold text-white mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Acordeón 2: Qué evitar */}
            <div className="rounded-2xl border border-brand-warning/35 bg-amber-50/45 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion('avoid')}
                aria-expanded={openAccordion === 'avoid'}
                className="flex w-full min-h-[48px] items-center justify-between gap-3 px-4 py-3 text-left font-extrabold text-brand-navy hover:bg-amber-50 transition-colors"
              >
                <span className="flex items-center gap-2 text-sm sm:text-base">
                  <AlertCircle className="h-4 w-4 text-brand-warning" aria-hidden="true" />
                  Qué evitar
                </span>
                {openAccordion === 'avoid' ? (
                  <ChevronUp className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                )}
              </button>

              {openAccordion === 'avoid' && (
                <div className="border-t border-brand-warning/20 px-4 py-3.5 bg-white">
                  <ul className="space-y-2 text-sm sm:text-base text-brand-text">
                    {exercise.commonMistakes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="font-bold text-brand-warning">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Acordeón 3: Precauciones y cuándo detenerse */}
            <div className="rounded-2xl border border-brand-danger/30 bg-rose-50/40 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion('precautions')}
                aria-expanded={openAccordion === 'precautions'}
                className="flex w-full min-h-[48px] items-center justify-between gap-3 px-4 py-3 text-left font-extrabold text-brand-navy hover:bg-rose-50/70 transition-colors"
              >
                <span className="flex items-center gap-2 text-sm sm:text-base">
                  <ShieldAlert className="h-4 w-4 text-brand-danger" aria-hidden="true" />
                  Precauciones y cuándo detener el ejercicio
                </span>
                {openAccordion === 'precautions' ? (
                  <ChevronUp className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                )}
              </button>

              {openAccordion === 'precautions' && (
                <div className="border-t border-brand-danger/20 px-4 py-3.5 bg-white space-y-2">
                  <ul className="space-y-2 text-sm sm:text-base text-brand-text">
                    {exercise.precautions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="font-bold text-brand-danger">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Indicaciones del profesional si existen (desplegable) */}
            <ExerciseInstructions exerciseId={exercise.id} exerciseTitle={exercise.title} />

            {/* Botones inferiores para abrir ficha o pasar al siguiente ejercicio */}
            {nextExerciseId && (
              <div className="pt-2 flex justify-end">
                <Link
                  to={`/ejercicios/${nextExerciseId}`}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-brand-soft/70 px-4 py-2 text-xs sm:text-sm font-bold text-brand-navy hover:bg-brand-soft transition-colors"
                >
                  <span>Pasar al siguiente ejercicio</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
