import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQ_DATA } from '../data/faq';
import { SectionHeader } from '../components/common/SectionHeader';
import { SafetyNotice } from '../components/common/SafetyNotice';

export const FAQPage: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [FAQ_DATA[0]?.id || '']: true
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    FAQ_DATA.forEach((item) => {
      next[item.id] = true;
    });
    setOpenIds(next);
  };

  const collapseAll = () => {
    setOpenIds({});
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        badge="Dudas habituales"
        title="Preguntas frecuentes"
        subtitle="Respuestas breves y claras a las consultas más comunes durante el posoperatorio temprano de reconstrucción del LCA."
        rightSlot={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-soft/40"
            >
              Abrir todas
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-soft/40"
            >
              Cerrar todas
            </button>
          </div>
        }
      />

      <div className="space-y-3">
        {FAQ_DATA.map((item) => {
          const isOpen = Boolean(openIds[item.id]);
          return (
            <div
              key={item.id}
              className="rounded-card bg-white border border-slate-200/90 shadow-soft overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="flex w-full min-h-[56px] items-center justify-between gap-4 p-5 text-left hover:bg-brand-bg/60 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle
                    className="h-5 w-5 shrink-0 text-brand-teal mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-base sm:text-lg font-extrabold text-brand-navy">
                    {item.question}
                  </span>
                </div>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft/60 text-brand-navy">
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 text-sm sm:text-base text-brand-text leading-relaxed">
                  <p className="pl-8">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SafetyNotice
        title="¿Tenés otra duda sobre tu evolución?"
        message="Anotala en la sección Mi seguimiento para conversarla directamente con tu traumatólogo o kinesiólogo en tu próximo control."
        variant="info"
      />
    </div>
  );
};
