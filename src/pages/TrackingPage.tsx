import React, { useState } from 'react';
import {
  ClipboardList,
  PlusCircle,
  Trash2,
  Download,
  Printer,
  Calendar
} from 'lucide-react';
import {
  TrackingEntry,
  SwellingStatus,
  ExercisesDoneStatus,
  GeneralFeelingStatus
} from '../types/exercise';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SectionHeader } from '../components/common/SectionHeader';
import { EmptyState } from '../components/common/EmptyState';

const getTodayString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const TrackingPage: React.FC = () => {
  const [entries, setEntries] = useLocalStorage<TrackingEntry[]>(
    'kine_lca_voluntary_tracking_v1',
    []
  );

  const [date, setDate] = useState<string>(getTodayString());
  const [painBefore, setPainBefore] = useState<number>(2);
  const [painAfter, setPainAfter] = useState<number>(2);
  const [swelling, setSwelling] = useState<SwellingStatus>('igual');
  const [exercisesDone, setExercisesDone] = useState<ExercisesDoneStatus>('si');
  const [generalFeeling, setGeneralFeeling] = useState<GeneralFeelingStatus>('igual');
  const [observations, setObservations] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: TrackingEntry = {
      id: `reg-${Date.now()}`,
      date: date || getTodayString(),
      painBefore,
      painAfter,
      swelling,
      exercisesDone,
      generalFeeling,
      observations: observations.trim()
    };

    setEntries((prev) => [newEntry, ...prev]);
    setObservations('');
    setFeedback('Registro guardado localmente en tu dispositivo.');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setEntries([]);
    setFeedback('Se eliminaron todos los registros locales.');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleExportText = () => {
    if (entries.length === 0) return;

    const lines = [
      'MI SEGUIMIENTO DOMICILIARIO — TU RODILLA, PASO A PASO',
      'Registro personal de seguimiento.',
      '========================================================================',
      ''
    ];

    entries.forEach((entry, idx) => {
      lines.push(`Registro #${entries.length - idx} — Fecha: ${entry.date}`);
      lines.push(`- Dolor antes de ejercitarse (0-10): ${entry.painBefore}`);
      lines.push(`- Dolor después de ejercitarse (0-10): ${entry.painAfter}`);
      lines.push(`- Hinchazón: ${entry.swelling}`);
      lines.push(
        `- Ejercicios realizados: ${
          entry.exercisesDone === 'si'
            ? 'Sí'
            : entry.exercisesDone === 'parcialmente'
            ? 'Parcialmente'
            : 'No'
        }`
      );
      lines.push(`- Sensación general: ${entry.generalFeeling}`);
      if (entry.observations) {
        lines.push(`- Observaciones: ${entry.observations}`);
      }
      lines.push('------------------------------------------------------------------------');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `seguimiento-rodilla-${getTodayString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        badge="Registro personal"
        title="Mi seguimiento"
        subtitle="Anotá cómo te sentís antes y después de tus ejercicios para conversarlo en la próxima consulta con tu kinesiólogo o traumatólogo."
        rightSlot={
          entries.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportText}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-brand-navy hover:bg-brand-soft/40 transition-colors"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Exportar texto (.txt)</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-brand-navy hover:bg-brand-soft/40 transition-colors"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                <span>Imprimir</span>
              </button>
            </div>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Formulario de carga voluntaria */}
        <section className="lg:col-span-5 no-print">
          <form
            onSubmit={handleAddEntry}
            className="rounded-card bg-white border border-slate-200/90 p-5 sm:p-6 shadow-soft space-y-5"
          >
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <PlusCircle className="h-5 w-5 text-brand-teal" aria-hidden="true" />
              <h2 className="text-lg font-extrabold text-brand-navy">Nuevo registro diario</h2>
            </div>

            {feedback && (
              <div
                role="status"
                className="rounded-xl bg-brand-soft px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-brand-navy"
              >
                {feedback}
              </div>
            )}

            {/* Fecha */}
            <div>
              <label htmlFor="tracking-date" className="block text-sm font-bold text-brand-navy mb-1.5">
                Fecha
              </label>
              <input
                id="tracking-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-brand-text"
              />
            </div>

            {/* Dolor antes (0 a 10) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="pain-before" className="text-sm font-bold text-brand-navy">
                  Dolor antes de ejercitarte (0 a 10)
                </label>
                <span className="rounded-lg bg-brand-soft px-2.5 py-0.5 text-sm font-extrabold text-brand-navy">
                  {painBefore} / 10
                </span>
              </div>
              <input
                id="pain-before"
                type="range"
                min={0}
                max={10}
                step={1}
                value={painBefore}
                onChange={(e) => setPainBefore(Number(e.target.value))}
                className="w-full accent-brand-navy cursor-pointer h-2.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-xs text-brand-muted mt-1">
                <span>0 (Sin dolor)</span>
                <span>5 (Moderado)</span>
                <span>10 (Máximo)</span>
              </div>
            </div>

            {/* Dolor después (0 a 10) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="pain-after" className="text-sm font-bold text-brand-navy">
                  Dolor después de ejercitarte (0 a 10)
                </label>
                <span className="rounded-lg bg-brand-soft px-2.5 py-0.5 text-sm font-extrabold text-brand-navy">
                  {painAfter} / 10
                </span>
              </div>
              <input
                id="pain-after"
                type="range"
                min={0}
                max={10}
                step={1}
                value={painAfter}
                onChange={(e) => setPainAfter(Number(e.target.value))}
                className="w-full accent-brand-teal cursor-pointer h-2.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-xs text-brand-muted mt-1">
                <span>0 (Sin dolor)</span>
                <span>5 (Moderado)</span>
                <span>10 (Máximo)</span>
              </div>
            </div>

            {/* Hinchazón */}
            <fieldset>
              <legend className="block text-sm font-bold text-brand-navy mb-2">
                Hinchazón percibida
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {(['menor', 'igual', 'mayor'] as SwellingStatus[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSwelling(opt)}
                    aria-pressed={swelling === opt}
                    className={`min-h-[44px] rounded-xl border text-xs sm:text-sm font-bold capitalize transition-colors ${
                      swelling === opt
                        ? 'bg-brand-navy text-white border-brand-navy'
                        : 'bg-brand-bg text-brand-text border-slate-200 hover:bg-brand-soft/40'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Ejercicios realizados */}
            <fieldset>
              <legend className="block text-sm font-bold text-brand-navy mb-2">
                Ejercicios autorizados realizados
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: 'si', label: 'Sí' },
                    { value: 'parcialmente', label: 'Parcialmente' },
                    { value: 'no', label: 'No' }
                  ] as { value: ExercisesDoneStatus; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setExercisesDone(opt.value)}
                    aria-pressed={exercisesDone === opt.value}
                    className={`min-h-[44px] rounded-xl border text-xs sm:text-sm font-bold transition-colors ${
                      exercisesDone === opt.value
                        ? 'bg-brand-navy text-white border-brand-navy'
                        : 'bg-brand-bg text-brand-text border-slate-200 hover:bg-brand-soft/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Sensación general */}
            <fieldset>
              <legend className="block text-sm font-bold text-brand-navy mb-2">
                Sensación general de la rodilla
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {(['mejor', 'igual', 'peor'] as GeneralFeelingStatus[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGeneralFeeling(opt)}
                    aria-pressed={generalFeeling === opt}
                    className={`min-h-[44px] rounded-xl border text-xs sm:text-sm font-bold capitalize transition-colors ${
                      generalFeeling === opt
                        ? 'bg-brand-navy text-white border-brand-navy'
                        : 'bg-brand-bg text-brand-text border-slate-200 hover:bg-brand-soft/40'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Observaciones opcionales */}
            <div>
              <label htmlFor="tracking-obs" className="block text-sm font-bold text-brand-navy mb-1.5">
                Observaciones opcionales (dudas para consultar)
              </label>
              <textarea
                id="tracking-obs"
                rows={3}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ej.: Sentí tirantez en la parte de adelante al terminar la última serie..."
                className="w-full rounded-xl border border-slate-300 p-3 text-sm text-brand-text"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-xl bg-brand-teal px-5 py-3 text-sm sm:text-base font-bold text-white shadow-sm hover:bg-brand-teal/90 transition-colors"
            >
              Guardar en mi historial local
            </button>
          </form>
        </section>

        {/* Historial local */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-brand-navy" aria-hidden="true" />
              <h2 className="text-xl font-extrabold text-brand-navy">
                Historial guardado ({entries.length})
              </h2>
            </div>

            {entries.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-danger hover:bg-rose-50 transition-colors no-print"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Vaciar historial</span>
              </button>
            )}
          </div>

          {entries.length === 0 ? (
            <EmptyState
              title="Aún no tenés registros guardados"
              description="Cuando anotes tus sensaciones diarias en el formulario, aparecerán acá para que puedas mostrárselas a tu profesional."
            />
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-card bg-white border border-slate-200/90 p-5 shadow-soft"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                    <div className="flex items-center gap-2 text-brand-navy font-extrabold">
                      <Calendar className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                      <span>Fecha: {entry.date}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="inline-flex min-h-[38px] items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-brand-danger hover:bg-rose-50 no-print"
                      aria-label={`Eliminar registro del ${entry.date}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      <span>Eliminar</span>
                    </button>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-sm">
                    <div className="rounded-xl bg-brand-bg p-2.5">
                      <dt className="text-xs text-brand-muted">Dolor antes</dt>
                      <dd className="font-extrabold text-brand-navy">{entry.painBefore} / 10</dd>
                    </div>
                    <div className="rounded-xl bg-brand-bg p-2.5">
                      <dt className="text-xs text-brand-muted">Dolor después</dt>
                      <dd className="font-extrabold text-brand-navy">{entry.painAfter} / 10</dd>
                    </div>
                    <div className="rounded-xl bg-brand-bg p-2.5">
                      <dt className="text-xs text-brand-muted">Hinchazón</dt>
                      <dd className="font-bold capitalize text-brand-navy">{entry.swelling}</dd>
                    </div>
                    <div className="rounded-xl bg-brand-bg p-2.5">
                      <dt className="text-xs text-brand-muted">Ejercicios realizados</dt>
                      <dd className="font-bold text-brand-navy">
                        {entry.exercisesDone === 'si'
                          ? 'Sí'
                          : entry.exercisesDone === 'parcialmente'
                          ? 'Parcialmente'
                          : 'No'}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-brand-bg p-2.5 sm:col-span-2">
                      <dt className="text-xs text-brand-muted">Sensación general</dt>
                      <dd className="font-bold capitalize text-brand-navy">
                        {entry.generalFeeling}
                      </dd>
                    </div>
                  </dl>

                  {entry.observations && (
                    <div className="mt-3 rounded-xl bg-brand-soft/40 p-3 text-xs sm:text-sm text-brand-text">
                      <span className="font-bold text-brand-navy">Observaciones: </span>
                      <span>{entry.observations}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
