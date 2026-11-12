import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShieldAlert,
  Wrench,
  UserCheck,
  ListOrdered,
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
  const [isOpen, setIsOpen] = useState(featured);
  const [activeTab, setActiveTab] = useState<'steps' | 'avoid' | 'precautions'>('steps');

  const stepNumberLabel = String(indexNumber).padStart(2, '0');

  return (
    <article
      className={`exercise-card group relative flex flex-col rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-soft overflow-hidden transition-all duration-200 hover:border-brand-teal/40 hover:shadow-soft-lg ${
        featured ? 'lg:col-span-2 lg:grid lg:grid-cols-12 lg:items-stretch' : ''
      }`}
    >
      {/* Bloque izquierdo / superior: Cabecera + Demostración 3D */}
      <div className={featured ? 'lg:col-span-7 flex flex-col justify-between lg:border-r lg:border-slate-100' : 'flex flex-col'}>
        {/* Cabecera en sinergia: Número + Categoría + Título + Acceso directo */}
        <div className="px-4 pt-4 pb-3 sm:px-5 sm:pt-5">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 min-w-[26px] items-center justify-center rounded-lg bg-brand-navy text-[11px] font-extrabold tracking-tight text-white px-1.5">
                {stepNumberLabel}
              </span>
              <span className="inline-flex items-center rounded-full bg-brand-soft/75 px-2.5 py-0.5 text-[11px] font-bold text-brand-navy">
                {exercise.category}
              </span>
            </div>

            <Link
              to={`/ejercicios/${exercise.id}`}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-brand-muted hover:text-brand-navy hover:bg-slate-100 transition-colors"
              title={`Abrir ficha individual de ${exercise.title}`}
            >
              <span>Ficha</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-brand-teal" aria-hidden="true" />
            </Link>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy leading-snug tracking-tight">
            <Link
              to={`/ejercicios/${exercise.id}`}
              className="hover:text-brand-teal transition-colors"
            >
              {exercise.title}
            </Link>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-brand-muted leading-relaxed">
            {exercise.goal}
          </p>
        </div>

        {/* Escenario 3D integrado sin márgenes muertos */}
        <div className="px-3 pb-3 sm:px-4 sm:pb-4">
          <ExerciseDemonstration exercise={exercise} compact />
        </div>
      </div>

      {/* Bloque derecho / inferior: Metadatos compactos + Guía paso a paso */}
      <div className={featured ? 'lg:col-span-5 flex flex-col justify-between p-4 sm:p-5 bg-brand-bg/30' : 'flex flex-col px-4 pb-4 sm:px-5 sm:pb-5'}>
        {/* Píldoras sintéticas de Posición y Elemento */}
        <div className="grid grid-cols-1 gap-1.5 rounded-xl bg-brand-bg/80 border border-slate-200/60 px-3 py-2.5 text-xs mb-3">
          <div className="flex items-start gap-2">
            <UserCheck className="h-3.5 w-3.5 shrink-0 text-brand-teal mt-0.5" aria-hidden="true" />
            <p className="text-brand-text leading-snug">
              <span className="font-bold text-brand-navy">Posición: </span>
              {exercise.initialPosition}
            </p>
          </div>
          <div className="flex items-center gap-2 border-t border-slate-200/50 pt-1.5">
            <Wrench className="h-3.5 w-3.5 shrink-0 text-brand-teal" aria-hidden="true" />
            <p className="text-brand-text truncate">
              <span className="font-bold text-brand-navy">Elemento: </span>
              {exercise.equipment}
            </p>
          </div>
        </div>

        {/* Botón desplegable en móvil y tarjetas normales */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className={`flex w-full min-h-[42px] items-center justify-between rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            isOpen
              ? 'bg-brand-soft/70 text-brand-navy'
              : 'bg-brand-navy text-white shadow-sm hover:bg-brand-navy/90'
          } ${featured ? 'lg:hidden' : ''}`}
        >
          <span>{isOpen ? 'Ocultar guía del ejercicio' : 'Ver cómo hacerlo paso a paso'}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
        </button>

        {/* Contenido guiado por pestañas compactas (sin acordeones gigantes) */}
        <div className={`${isOpen ? 'block mt-3' : 'hidden'} ${featured ? 'lg:block lg:mt-0 lg:flex-1' : ''}`}>
          {/* Selector de pestañas delicado */}
          <div
            role="tablist"
            aria-label="Detalles del ejercicio"
            className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100/90 dark:bg-slate-800 p-1 mb-3"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'steps'}
              onClick={() => setActiveTab('steps')}
              className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] sm:text-xs font-bold transition-all ${
                activeTab === 'steps'
                  ? 'bg-white dark:bg-slate-900 text-brand-navy shadow-sm'
                  : 'text-brand-muted hover:text-brand-navy'
              }`}
            >
              <ListOrdered className="h-3.5 w-3.5 text-brand-teal" aria-hidden="true" />
              <span>Pasos</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'avoid'}
              onClick={() => setActiveTab('avoid')}
              className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] sm:text-xs font-bold transition-all ${
                activeTab === 'avoid'
                  ? 'bg-white dark:bg-slate-900 text-brand-warning shadow-sm'
                  : 'text-brand-muted hover:text-brand-navy'
              }`}
            >
              <AlertCircle className="h-3.5 w-3.5 text-brand-warning" aria-hidden="true" />
              <span>Evitar</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'precautions'}
              onClick={() => setActiveTab('precautions')}
              className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] sm:text-xs font-bold transition-all ${
                activeTab === 'precautions'
                  ? 'bg-white dark:bg-slate-900 text-brand-danger shadow-sm'
                  : 'text-brand-muted hover:text-brand-navy'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5 text-brand-danger" aria-hidden="true" />
              <span>Cuidados</span>
            </button>
          </div>

          {/* Panel de la pestaña activa */}
          <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 text-xs sm:text-sm">
            {activeTab === 'steps' && (
              <ol className="space-y-2">
                {exercise.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-brand-text">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-extrabold text-brand-navy mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            )}

            {activeTab === 'avoid' && (
              <ul className="space-y-1.5 text-brand-text">
                {exercise.commonMistakes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-brand-warning">✕</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'precautions' && (
              <div className="space-y-2 text-brand-text">
                <ul className="space-y-1.5">
                  {exercise.precautions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-brand-danger">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-2 border-t border-slate-100 text-[11px] sm:text-xs text-brand-muted">
                  <strong className="text-brand-danger">Detener si aparece:</strong>{' '}
                  {exercise.stopConditions.join(' ')}
                </p>
              </div>
            )}
          </div>

          <div className="mt-2.5">
            <ExerciseInstructions exerciseId={exercise.id} exerciseTitle={exercise.title} />
          </div>
        </div>
      </div>
    </article>
  );
};
