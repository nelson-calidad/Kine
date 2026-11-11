import React, { useState } from 'react';
import { ClipboardCheck, ChevronDown, ChevronUp, Edit3, Trash2, Save } from 'lucide-react';
import { ProfessionalIndication } from '../../types/exercise';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ExerciseInstructionsProps {
  exerciseId: string;
  exerciseTitle: string;
  defaultOpen?: boolean;
}

const EMPTY_INDICATION = (exerciseId: string): ProfessionalIndication => ({
  exerciseId,
  series: '',
  repetitions: '',
  frequency: '',
  authorizedRange: '',
  observations: '',
  indicationDate: ''
});

export const ExerciseInstructions: React.FC<ExerciseInstructionsProps> = ({
  exerciseId,
  exerciseTitle,
  defaultOpen = false
}) => {
  const [allIndications, setAllIndications] = useLocalStorage<Record<string, ProfessionalIndication>>(
    'kine_lca_professional_indications_v1',
    {}
  );

  const saved = allIndications[exerciseId];
  const hasSavedData = Boolean(
    saved &&
      (saved.series.trim() ||
        saved.repetitions.trim() ||
        saved.frequency.trim() ||
        saved.authorizedRange.trim() ||
        saved.observations.trim() ||
        saved.indicationDate.trim())
  );

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfessionalIndication>(
    saved || EMPTY_INDICATION(exerciseId)
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleOpenEdit = () => {
    setFormData(saved || EMPTY_INDICATION(exerciseId));
    setIsEditing(true);
    setStatusMessage(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAllIndications((prev) => ({
      ...prev,
      [exerciseId]: {
        ...formData,
        exerciseId
      }
    }));
    setIsEditing(false);
    setStatusMessage('Indicaciones guardadas en este dispositivo.');
  };

  const handleClear = () => {
    setAllIndications((prev) => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
    setFormData(EMPTY_INDICATION(exerciseId));
    setIsEditing(false);
    setStatusMessage('Se borraron las indicaciones anotadas para este ejercicio.');
  };

  return (
    <div className="rounded-2xl border border-brand-teal/30 bg-brand-soft/35 p-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full min-h-[44px] items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <ClipboardCheck className="h-5 w-5 shrink-0 text-brand-navy" aria-hidden="true" />
          <div>
            <span className="block text-sm sm:text-base font-bold text-brand-navy">
              Mis indicaciones
            </span>
            <span className="block text-xs text-brand-muted">
              {hasSavedData
                ? 'Tenés indicaciones anotadas en este dispositivo'
                : 'Aún no se cargaron indicaciones para este ejercicio'}
            </span>
          </div>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-navy border border-slate-200">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 border-t border-brand-teal/20 pt-4">
          <p className="mb-3 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-brand-navy border border-slate-200/80">
            Copiá únicamente las indicaciones recibidas de tu profesional. Estos datos se guardan solo en tu celular o computadora.
          </p>

          {statusMessage && (
            <p role="status" className="mb-3 text-xs font-semibold text-brand-teal">
              {statusMessage}
            </p>
          )}

          {!isEditing ? (
            <div>
              {!hasSavedData ? (
                <div className="rounded-xl bg-white p-4 text-sm text-brand-muted border border-slate-200/70">
                  <p className="font-medium text-brand-text">
                    Aún no se cargaron indicaciones para este ejercicio.
                  </p>
                  <p className="mt-1 text-xs">
                    Esta guía no asigna series ni repeticiones por defecto. Cuando tu kinesiólogo o traumatólogo te indique la pauta para <strong>{exerciseTitle}</strong>, podés anotarla acá.
                  </p>
                </div>
              ) : (
                <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 rounded-xl bg-white p-4 border border-slate-200/80 text-sm">
                  <div>
                    <dt className="text-xs font-semibold text-brand-muted">Series</dt>
                    <dd className="font-bold text-brand-navy">{saved.series || 'No especificado'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-brand-muted">Repeticiones</dt>
                    <dd className="font-bold text-brand-navy">{saved.repetitions || 'No especificado'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-brand-muted">Frecuencia</dt>
                    <dd className="font-bold text-brand-navy">{saved.frequency || 'No especificado'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-brand-muted">Rango autorizado</dt>
                    <dd className="font-bold text-brand-navy">{saved.authorizedRange || 'No especificado'}</dd>
                  </div>
                  {saved.indicationDate && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-semibold text-brand-muted">Fecha de indicación</dt>
                      <dd className="font-semibold text-brand-text">{saved.indicationDate}</dd>
                    </div>
                  )}
                  {saved.observations && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-semibold text-brand-muted">Observaciones del profesional</dt>
                      <dd className="text-brand-text whitespace-pre-line">{saved.observations}</dd>
                    </div>
                  )}
                </dl>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2 no-print">
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-brand-navy/90 transition-colors"
                >
                  <Edit3 className="h-4 w-4" aria-hidden="true" />
                  <span>{hasSavedData ? 'Editar mis indicaciones' : 'Anotar indicaciones de mi profesional'}</span>
                </button>

                {hasSavedData && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-brand-danger hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    <span>Borrar</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3 rounded-xl bg-white p-4 border border-slate-200 no-print">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={`series-${exerciseId}`} className="block text-xs font-bold text-brand-navy mb-1">
                    Series indicadas (opcional)
                  </label>
                  <input
                    id={`series-${exerciseId}`}
                    type="text"
                    value={formData.series}
                    onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2 text-sm text-brand-text"
                  />
                </div>
                <div>
                  <label htmlFor={`reps-${exerciseId}`} className="block text-xs font-bold text-brand-navy mb-1">
                    Repeticiones o tiempo (opcional)
                  </label>
                  <input
                    id={`reps-${exerciseId}`}
                    type="text"
                    value={formData.repetitions}
                    onChange={(e) => setFormData({ ...formData, repetitions: e.target.value })}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2 text-sm text-brand-text"
                  />
                </div>
                <div>
                  <label htmlFor={`freq-${exerciseId}`} className="block text-xs font-bold text-brand-navy mb-1">
                    Frecuencia diaria/semanal (opcional)
                  </label>
                  <input
                    id={`freq-${exerciseId}`}
                    type="text"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2 text-sm text-brand-text"
                  />
                </div>
                <div>
                  <label htmlFor={`range-${exerciseId}`} className="block text-xs font-bold text-brand-navy mb-1">
                    Rango autorizado (opcional)
                  </label>
                  <input
                    id={`range-${exerciseId}`}
                    type="text"
                    value={formData.authorizedRange}
                    onChange={(e) => setFormData({ ...formData, authorizedRange: e.target.value })}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2 text-sm text-brand-text"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`date-${exerciseId}`} className="block text-xs font-bold text-brand-navy mb-1">
                  Fecha de la indicación (opcional)
                </label>
                <input
                  id={`date-${exerciseId}`}
                  type="date"
                  value={formData.indicationDate}
                  onChange={(e) => setFormData({ ...formData, indicationDate: e.target.value })}
                  className="w-full sm:w-auto min-h-[44px] rounded-xl border border-slate-300 px-3 py-2 text-sm text-brand-text"
                />
              </div>

              <div>
                <label htmlFor={`obs-${exerciseId}`} className="block text-xs font-bold text-brand-navy mb-1">
                  Observaciones recibidas (opcional)
                </label>
                <textarea
                  id={`obs-${exerciseId}`}
                  rows={2}
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-brand-text"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand-teal px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-brand-teal/90"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  <span>Guardar indicación</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-brand-text hover:bg-slate-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
