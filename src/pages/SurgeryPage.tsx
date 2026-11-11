import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Info, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { SafetyNotice } from '../components/common/SafetyNotice';
import { ExerciseImage } from '../components/common/ExerciseImage';

export const SurgeryPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        badge="Explicación para pacientes"
        title="Conocé tu cirugía"
        subtitle="Comprender cómo funciona el ligamento cruzado anterior y en qué consiste el autoinjerto HTH rotuliano te ayuda a cuidar mejor tu rodilla."
      />

      {/* Bloque destacado: ¿Qué significa HTH? */}
      <div className="rounded-card-lg bg-brand-navy text-white p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-brand-teal px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-2">
              Sigla quirúrgica
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">¿Qué significa HTH?</h2>
            <p className="mt-1 text-lg sm:text-xl font-bold text-brand-soft">
              Hueso – Tendón – Hueso.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 border border-brand-soft/30 p-4 text-xs sm:text-sm text-brand-soft max-w-md">
            Es un autoinjerto (tejido propio del paciente) tomado de la porción central del tendón rotuliano junto con dos pequeños bloques óseos en sus extremos.
          </div>
        </div>
      </div>

      {/* Contenido explicativo principal (Sección 6) */}
      <article className="rounded-card bg-white border border-slate-200/90 p-6 sm:p-8 shadow-soft space-y-4 text-base sm:text-lg text-brand-text leading-relaxed">
        <div className="flex items-center gap-2.5 text-brand-navy font-extrabold text-xl mb-2">
          <Stethoscope className="h-6 w-6 text-brand-teal" aria-hidden="true" />
          <h2>¿Cómo funciona la reconstrucción del LCA?</h2>
        </div>

        <p>
          El <strong>ligamento cruzado anterior (LCA)</strong> ayuda a estabilizar la rodilla y limita el desplazamiento excesivo de la tibia hacia adelante.
        </p>

        <p>
          Cuando se rompe y se indica una reconstrucción, se coloca un injerto que sustituye la función del ligamento lesionado.
        </p>

        <p>
          En esta guía se utiliza como ejemplo una reconstrucción mediante <strong>autoinjerto hueso–tendón–hueso (HTH) rotuliano</strong>.
        </p>

        <p>
          El injerto incluye una porción central del tendón rotuliano y pequeños bloques óseos que se fijan en túneles realizados en el fémur y la tibia.
        </p>

        <div className="rounded-2xl bg-amber-50 border border-brand-warning/35 p-4 sm:p-5 text-sm sm:text-base">
          <p className="font-bold text-brand-navy">
            ¿Por qué puede molestar la parte delantera de la rodilla?
          </p>
          <p className="mt-1 text-brand-text">
            Puede existir sensibilidad o molestia en la parte anterior de la rodilla por la zona donde se obtuvo el injerto. Por eso es fundamental realizar los ejercicios de flexión y activación del cuádriceps de manera gradual y sin forzar dolor intenso.
          </p>
        </div>
      </article>

      {/* Dos imágenes comparativas: Rodilla sana y Reconstrucción del LCA con injerto HTH */}
      <section aria-labelledby="heading-esquemas-cirugia">
        <h2 id="heading-esquemas-cirugia" className="text-xl sm:text-2xl font-extrabold text-brand-navy mb-4">
          Esquemas educativos comparativos
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-card bg-white border border-slate-200/90 p-5 shadow-soft">
            <ExerciseImage
              src="/images/rodilla-sana.svg"
              alt="Esquema educativo de una rodilla sana mostrando fémur, rótula, tendón rotuliano, ligamento cruzado anterior intacto y tibia"
              title="Rodilla sana"
              category="Anatomía orientativa"
              className="h-64 sm:h-72 w-full"
            />
            <h3 className="mt-4 text-lg font-extrabold text-brand-navy">1. Rodilla sana</h3>
            <p className="mt-1 text-sm text-brand-muted leading-relaxed">
              El ligamento cruzado anterior conecta el fémur con la tibia en el centro de la articulación, mientras el tendón rotuliano une la rótula con la tibia en la cara anterior.
            </p>
          </div>

          <div className="rounded-card bg-white border border-slate-200/90 p-5 shadow-soft">
            <ExerciseImage
              src="/images/reconstruccion-hth.svg"
              alt="Esquema educativo de reconstrucción del LCA con injerto HTH rotuliano fijado en túneles del fémur y la tibia"
              title="Reconstrucción del LCA con injerto HTH"
              category="Procedimiento quirúrgico"
              className="h-64 sm:h-72 w-full"
            />
            <h3 className="mt-4 text-lg font-extrabold text-brand-navy">
              2. Reconstrucción del LCA con injerto HTH
            </h3>
            <p className="mt-1 text-sm text-brand-muted leading-relaxed">
              El injerto tomado del tercio central del tendón rotuliano con sus pequeños bloques óseos se fija en túneles óseos del fémur y de la tibia para restablecer la estabilidad.
            </p>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-2 text-xs text-brand-muted">
          <Info className="h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
          <span>
            Nota docente: Estas ilustraciones esquemáticas pueden reemplazarse directamente en la carpeta <code>/public/images/</code> por láminas anatómicas verificadas de la cátedra.
          </span>
        </p>
      </section>

      <SafetyNotice
        title="¿Qué pasa si hubo procedimientos asociados?"
        message="Si durante la misma cirugía se realizó una sutura meniscal o el tratamiento de otra estructura articular, tu médico traumatólogo y tu kinesiólogo pueden indicarte límites particulares de flexión o de apoyo con muletas."
        variant="info"
      />

      <div className="pt-2 no-print">
        <Link
          to="/ejercicios"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-brand-navy px-6 py-3 text-sm sm:text-base font-bold text-white hover:bg-brand-navy/90 transition-colors"
        >
          <span>Explorar los ejercicios domiciliarios</span>
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};
