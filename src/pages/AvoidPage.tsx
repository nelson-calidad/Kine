import React from 'react';
import { Ban, Info } from 'lucide-react';
import { RESTRICTIONS_DATA } from '../data/restrictions';
import { SectionHeader } from '../components/common/SectionHeader';
import { SafetyNotice } from '../components/common/SafetyNotice';

export const AvoidPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        badge="Los NO en casa"
        title="Qué evitar durante tu recuperación"
        subtitle="Conocer qué movimientos y conductas evitar te ayuda a proteger el injerto HTH, evitar dolor innecesario y favorecer una evolución segura."
      />

      <SafetyNotice
        title="Precauciones de esta etapa (no son prohibiciones permanentes)"
        message="Estas pautas corresponden al cuidado posoperatorio para proteger la cicatrización biológica y el control articular. A medida que avances en tu rehabilitación, tu equipo tratante te irá indicando cuándo y cómo retomar cada actividad."
        variant="warning"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {RESTRICTIONS_DATA.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between rounded-card bg-white border border-slate-200/90 p-5 sm:p-6 shadow-soft"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-brand-danger border border-brand-danger/25">
                  <Ban className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-brand-navy leading-snug">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-brand-text leading-relaxed">
                    {item.whyImportant}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs sm:text-sm text-brand-muted">
              <Info className="h-4 w-4 shrink-0 text-brand-teal mt-0.5" aria-hidden="true" />
              <span>{item.contextNote}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
