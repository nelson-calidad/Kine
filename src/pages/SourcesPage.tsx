import React from 'react';
import { BookOpen, ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';
import { SCIENTIFIC_SOURCES_DATA, EDITORIAL_SCOPE_INFO } from '../data/sources';
import { SectionHeader } from '../components/common/SectionHeader';
import { SafetyNotice } from '../components/common/SafetyNotice';

export const SourcesPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        badge="Bibliografía y marco académico"
        title="Fuentes y respaldo científico"
        subtitle="Referencias científicas verificadas que sustentan las recomendaciones educativas de esta guía posoperatoria."
      />

      {/* Contexto académico del proyecto */}
      <section className="rounded-card bg-white border border-slate-200/90 p-6 sm:p-7 shadow-soft space-y-3">
        <div className="flex items-center gap-2.5 text-brand-navy font-extrabold text-lg">
          <GraduationCap className="h-6 w-6 text-brand-teal" aria-hidden="true" />
          <h2>Contexto académico</h2>
        </div>
        <p className="text-sm sm:text-base text-brand-text leading-relaxed">
          {EDITORIAL_SCOPE_INFO.academicContext}
        </p>
        <div className="rounded-xl bg-brand-soft/50 border border-brand-teal/30 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-teal mb-1">
            Tema central del trabajo
          </p>
          <p className="text-sm sm:text-base font-bold text-brand-navy">
            &ldquo;{EDITORIAL_SCOPE_INFO.academicTopic}&rdquo;
          </p>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted">
          <strong>Estado de revisión editorial:</strong> {EDITORIAL_SCOPE_INFO.lastEditorialCheck}
        </p>
      </section>

      {/* Listado de fuentes científicas verificadas */}
      <section aria-labelledby="heading-referencias" className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-navy" aria-hidden="true" />
          <h2 id="heading-referencias" className="text-xl sm:text-2xl font-extrabold text-brand-navy">
            Bibliografía consultada
          </h2>
        </div>

        <div className="space-y-4">
          {SCIENTIFIC_SOURCES_DATA.map((source) => (
            <article
              key={source.id}
              className="rounded-card bg-white border border-slate-200/90 p-5 sm:p-6 shadow-soft"
            >
              <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-navy mb-2">
                {source.role}
              </span>
              <h3 className="text-lg font-extrabold text-brand-navy leading-snug">
                {source.title}
              </h3>
              <p className="mt-1 text-sm font-semibold text-brand-text">{source.authors}</p>
              <p className="text-xs sm:text-sm text-brand-muted italic mt-0.5">
                {source.publication}
              </p>
              <p className="mt-3 text-sm text-brand-text leading-relaxed">{source.summary}</p>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand-bg px-4 py-2 text-xs sm:text-sm font-bold text-brand-navy border border-slate-200 hover:bg-brand-soft/60 transition-colors"
                >
                  <span>Consultar fuente original</span>
                  <ExternalLink className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Distinción entre pautas clínicas verificadas y funciones de diseño */}
      <section className="rounded-card bg-brand-bg border border-slate-200/90 p-6 space-y-2">
        <div className="flex items-center gap-2 text-brand-navy font-extrabold">
          <ShieldCheck className="h-5 w-5 text-brand-teal" aria-hidden="true" />
          <h2>Transparencia editorial: pautas clínicas vs. funciones interactivas</h2>
        </div>
        <p className="text-sm text-brand-text leading-relaxed">
          {EDITORIAL_SCOPE_INFO.clinicalVsDesignNote}
        </p>
      </section>

      <SafetyNotice
        title="Alcance educativo"
        message="Material educativo académico. No reemplaza la evaluación ni las indicaciones del equipo de salud."
        variant="info"
      />
    </div>
  );
};
