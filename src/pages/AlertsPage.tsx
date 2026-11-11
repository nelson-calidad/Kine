import React from 'react';
import { AlertTriangle, ShieldAlert, OctagonAlert } from 'lucide-react';
import { URGENT_ALERTS_DATA, EMERGENCY_ALERTS_DATA } from '../data/restrictions';
import { SectionHeader } from '../components/common/SectionHeader';

export const AlertsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        badge="Atención prioritaria"
        title="Señales de alarma"
        subtitle="Identificá rápidamente qué síntomas requieren una consulta médica urgente o atención de emergencia inmediata."
      />

      {/* Mensaje destacado obligatorio */}
      <div
        role="alert"
        className="rounded-card-lg bg-brand-danger text-white p-6 sm:p-7 shadow-soft-lg"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <OctagonAlert className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Ante signos de emergencia, no hagas ejercicios. Buscá atención médica inmediata.
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-rose-100 leading-relaxed">
              No tomes medicación por tu cuenta ni esperes a la próxima sesión de kinesiología si presentás alguno de los signos listados a continuación.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* CATEGORÍA 1: CONSULTA MÉDICA URGENTE */}
        <section
          aria-labelledby="heading-consulta-urgente"
          className="rounded-card-lg bg-amber-50/90 border-2 border-brand-warning/50 p-6 sm:p-7 shadow-soft"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-warning text-white">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-warning">
                Comunicarse a la brevedad con el equipo médico o guardia
              </span>
              <h2 id="heading-consulta-urgente" className="text-xl sm:text-2xl font-extrabold text-brand-navy">
                Consulta médica urgente
              </h2>
            </div>
          </div>

          <ul className="space-y-3 mt-4">
            {URGENT_ALERTS_DATA.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-xl bg-white p-4 border border-brand-warning/30 text-brand-text font-semibold shadow-sm"
              >
                <AlertTriangle
                  className="h-5 w-5 shrink-0 text-brand-warning mt-0.5"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CATEGORÍA 2: EMERGENCIA */}
        <section
          aria-labelledby="heading-emergencia"
          className="rounded-card-lg bg-rose-50/95 border-2 border-brand-danger/60 p-6 sm:p-7 shadow-soft"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-danger text-white">
              <ShieldAlert className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-danger">
                Acudir o llamar al servicio de emergencias de inmediato
              </span>
              <h2 id="heading-emergencia" className="text-xl sm:text-2xl font-extrabold text-brand-navy">
                Emergencia
              </h2>
            </div>
          </div>

          <ul className="space-y-3 mt-4">
            {EMERGENCY_ALERTS_DATA.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-xl bg-white p-4 border border-brand-danger/35 text-brand-text font-bold shadow-sm"
              >
                <ShieldAlert
                  className="h-5 w-5 shrink-0 text-brand-danger mt-0.5"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-white border border-brand-danger/30 p-4 text-sm text-brand-text">
            <p className="font-bold text-brand-danger">Recordatorio importante:</p>
            <p className="mt-1 leading-relaxed">
              Esta aplicación no evalúa síntomas ni calcula riesgos médicos. Si tenés dudas ante un síntoma importante, priorizá siempre la valoración presencial en un centro de salud.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
