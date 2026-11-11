import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Printer,
  BookOpenCheck,
  AlertTriangle,
  OctagonAlert,
  Wrench,
  UserCheck,
  Check,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  ListOrdered,
  ShieldAlert
} from 'lucide-react';
import { Exercise } from '../../types/exercise';
import { ExerciseImage } from '../common/ExerciseImage';
import { ExerciseInstructions } from './ExerciseInstructions';
import { ExerciseDemonstration } from './ExerciseDemonstration';
import { SafetyNotice } from '../common/SafetyNotice';

interface ExerciseDetailProps {
  exercise: Exercise;
  prevExercise: Exercise | null;
  nextExercise: Exercise | null;
}

export const ExerciseDetail: React.FC<ExerciseDetailProps> = ({
  exercise,
  prevExercise,
  nextExercise
}) => {
  const [easyReading, setEasyReading] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState({
    steps: true,
    avoid: true,
    precautions: true
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `${exercise.title} — Tu rodilla, paso a paso`,
      text: `Guía educativa posoperatoria de rodilla (LCA): ${exercise.title}. ${exercise.goal}`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareFeedback('Enlace compartido.');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setShareFeedback('Enlace copiado al portapapeles.');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareFeedback('Enlace copiado al portapapeles.');
      } catch {
        setShareFeedback('Podés copiar la dirección desde la barra del navegador.');
      }
    }

    setTimeout(() => setShareFeedback(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={easyReading ? 'text-lg leading-relaxed' : ''}>
      {/* Barra superior: Botón volver + Acciones de lectura sencilla, compartir e imprimir */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 no-print">
        <Link
          to="/ejercicios"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-brand-navy border border-slate-200 shadow-sm hover:bg-brand-soft/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Volver a Mis ejercicios</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setEasyReading((prev) => !prev)}
            aria-pressed={easyReading}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors ${
              easyReading
                ? 'bg-brand-navy text-white border-brand-navy'
                : 'bg-white text-brand-navy border-slate-200 hover:bg-brand-soft/40'
            }`}
          >
            <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
            <span>{easyReading ? 'Lectura estándar' : 'Lectura sencilla'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-brand-navy hover:bg-brand-soft/40 transition-colors"
          >
            {shareFeedback ? (
              <Check className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            ) : (
              <Share2 className="h-4 w-4" aria-hidden="true" />
            )}
            <span>Compartir ejercicio</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-brand-navy hover:bg-brand-soft/40 transition-colors"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Imprimir / Guardar cartilla</span>
          </button>
        </div>
      </div>

      {shareFeedback && (
        <div
          role="status"
          className="mb-4 rounded-xl bg-brand-soft px-4 py-2.5 text-sm font-semibold text-brand-navy no-print"
        >
          {shareFeedback}
        </div>
      )}

      {/* Contenedor principal del detalle */}
      <article className="rounded-card-lg bg-white border border-slate-200/90 shadow-soft p-5 sm:p-8">
        {/* Etiqueta de categoría y advertencia clínica obligatoria */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs sm:text-sm font-bold text-brand-navy">
            {exercise.category}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft/60 border border-brand-teal/35 px-3 py-1 text-xs sm:text-sm font-bold text-brand-navy">
            <Stethoscope className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            Realizá únicamente los ejercicios autorizados por tu kinesiólogo
          </span>
        </div>

        {/* Título y Objetivo */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-navy leading-tight">
          {exercise.title}
        </h1>
        <p className={`mt-3 text-brand-text ${easyReading ? 'text-xl font-medium' : 'text-base sm:text-lg'}`}>
          {exercise.goal}
        </p>

        {exercise.specialBadge && (
          <div className="mt-4 rounded-2xl bg-amber-50 border border-brand-warning/40 p-4 text-sm sm:text-base font-bold text-brand-warning">
            Condición: {exercise.specialBadge}
          </div>
        )}

        {/* Imagen principal grande */}
        <div className="my-6">
          <ExerciseImage
            src={exercise.image}
            alt={exercise.imageAlt}
            title={exercise.title}
            category={exercise.category}
            className="h-64 sm:h-80 md:h-96 w-full"
          />
          <p className="mt-2 text-xs text-brand-muted text-center">
            {exercise.imageAlt}
          </p>
        </div>

        {/* COMPONENTE DE DEMOSTRACIÓN (Inicio -> Flecha de movimiento -> Final + Botón "Ver video" si existe archivo real) */}
        <div className="mb-6">
          <ExerciseDemonstration exercise={exercise} />
        </div>

        {/* Posición inicial y Material */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
          <div className="rounded-2xl bg-brand-bg border border-slate-200/80 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-brand-navy font-bold mb-1.5">
              <UserCheck className="h-5 w-5 text-brand-teal" aria-hidden="true" />
              <h2>Posición inicial</h2>
            </div>
            <p className="text-brand-text">{exercise.initialPosition}</p>
          </div>

          <div className="rounded-2xl bg-brand-bg border border-slate-200/80 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-brand-navy font-bold mb-1.5">
              <Wrench className="h-5 w-5 text-brand-teal" aria-hidden="true" />
              <h2>Material necesario</h2>
            </div>
            <p className="text-brand-text">{exercise.equipment}</p>
          </div>
        </div>

        {/* Acordeón 1: Cómo realizarlo (Instrucciones paso a paso) */}
        <section className="mb-4 rounded-2xl border border-slate-200/90 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('steps')}
            aria-expanded={openSections.steps}
            className="flex w-full min-h-[54px] items-center justify-between gap-3 px-5 py-4 text-left hover:bg-brand-bg/50 transition-colors"
          >
            <span className="flex items-center gap-2.5 text-lg sm:text-xl font-extrabold text-brand-navy">
              <ListOrdered className="h-5 w-5 text-brand-teal" aria-hidden="true" />
              Cómo realizarlo (paso a paso)
            </span>
            {openSections.steps ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {openSections.steps && (
            <div className="border-t border-slate-100 p-5 sm:p-6">
              <ol className="space-y-3">
                {exercise.steps.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3.5 rounded-xl bg-brand-bg p-3.5 border border-slate-200/60"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-extrabold text-white mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-brand-text font-medium leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        {/* Acordeón 2: Qué evitar */}
        <section className="mb-4 rounded-2xl border border-brand-warning/35 bg-amber-50/70 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('avoid')}
            aria-expanded={openSections.avoid}
            className="flex w-full min-h-[54px] items-center justify-between gap-3 px-5 py-4 text-left hover:bg-amber-50 transition-colors"
          >
            <span className="flex items-center gap-2.5 text-lg sm:text-xl font-extrabold text-brand-navy">
              <AlertTriangle className="h-5 w-5 text-brand-warning" aria-hidden="true" />
              Qué evitar
            </span>
            {openSections.avoid ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {openSections.avoid && (
            <div className="border-t border-brand-warning/20 bg-white p-5 sm:p-6">
              <ul className="space-y-2.5 text-brand-text">
                {exercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-bold text-brand-warning mt-0.5">✕</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Acordeón 3: Precauciones y cuándo detenerse */}
        <section className="mb-6 rounded-2xl border border-brand-danger/35 bg-rose-50/70 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('precautions')}
            aria-expanded={openSections.precautions}
            className="flex w-full min-h-[54px] items-center justify-between gap-3 px-5 py-4 text-left hover:bg-rose-50 transition-colors"
          >
            <span className="flex items-center gap-2.5 text-lg sm:text-xl font-extrabold text-brand-navy">
              <ShieldAlert className="h-5 w-5 text-brand-danger" aria-hidden="true" />
              Precauciones y cuándo detenerse
            </span>
            {openSections.precautions ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {openSections.precautions && (
            <div className="border-t border-brand-danger/20 bg-white p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-navy mb-2">
                  Precauciones clínicas
                </h3>
                <ul className="space-y-2 text-brand-text">
                  {exercise.precautions.map((precaution, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-brand-teal font-bold">•</span>
                      <span>{precaution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-rose-50/80 border border-brand-danger/30 p-4">
                <div className="flex items-center gap-2 text-brand-danger font-extrabold mb-1.5">
                  <OctagonAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <h3 className="text-sm">Detené el ejercicio y consultá si aparece:</h3>
                </div>
                <ul className="space-y-1 text-sm text-brand-text">
                  {exercise.stopConditions.map((condition, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-brand-danger">!</span>
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Indicaciones del profesional si existen (editable opcionalmente en localStorage) */}
        <section className="mb-6">
          <ExerciseInstructions
            exerciseId={exercise.id}
            exerciseTitle={exercise.title}
            defaultOpen={false}
          />
        </section>

        <SafetyNotice
          title="Seguridad clínica en tu recuperación"
          message="Ante dolor intenso, bloqueo, aumento importante de derrame o síntomas nuevos, detené el ejercicio y consultá. Las restricciones del cirujano prevalecen sobre cualquier orientación general."
          variant="info"
          showAlertsLink={true}
        />

        {/* Navegación Anterior / Siguiente */}
        <nav
          aria-label="Navegación entre ejercicios"
          className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 no-print"
        >
          {prevExercise ? (
            <Link
              to={`/ejercicios/${prevExercise.id}`}
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-brand-navy hover:bg-brand-soft/40 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <div className="text-left">
                <span className="block text-xs font-medium text-brand-muted">Ejercicio anterior</span>
                <span>{prevExercise.title}</span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextExercise && (
            <Link
              to={`/ejercicios/${nextExercise.id}`}
              className="inline-flex min-h-[48px] items-center justify-end gap-2.5 rounded-xl bg-brand-navy px-5 py-3 text-sm font-bold text-white hover:bg-brand-navy/90 transition-colors"
            >
              <div className="text-right">
                <span className="block text-xs font-normal text-brand-soft">Pasar al siguiente ejercicio</span>
                <span>{nextExercise.title}</span>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
};
