import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ThermometerSnowflake,
  AlignHorizontalSpaceAround,
  Accessibility,
  Moon,
  Droplets,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { CARE_SECTIONS_DATA } from '../data/care';
import { SectionHeader } from '../components/common/SectionHeader';
import { InfoCard } from '../components/common/InfoCard';

const ICON_MAP: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
  ThermometerSnowflake: <ThermometerSnowflake className="h-5 w-5" aria-hidden="true" />,
  AlignHorizontalSpaceAround: <AlignHorizontalSpaceAround className="h-5 w-5" aria-hidden="true" />,
  Accessibility: <Accessibility className="h-5 w-5" aria-hidden="true" />,
  Moon: <Moon className="h-5 w-5" aria-hidden="true" />,
  Droplets: <Droplets className="h-5 w-5" aria-hidden="true" />
};

export const CarePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        badge="Cuidados domiciliarios"
        title="Cómo cuidar tu rodilla"
        subtitle="Recomendaciones prácticas para acompañar el posoperatorio en casa con tranquilidad y proteger la evolución de tu cirugía."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CARE_SECTIONS_DATA.map((item) => (
          <InfoCard
            key={item.id}
            badge={`Apartado ${item.letter}`}
            title={`${item.letter}. ${item.title}`}
            subtitle={item.summary}
            icon={ICON_MAP[item.iconName]}
            collapsible={true}
            defaultExpanded={true}
          >
            <ul className="space-y-2.5 text-sm sm:text-base text-brand-text">
              {item.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-brand-teal mt-1"
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {item.highlightNote && (
              <div className="mt-4 rounded-xl bg-brand-soft/50 border border-brand-teal/25 p-3.5 text-xs sm:text-sm font-medium text-brand-navy">
                {item.highlightNote}
              </div>
            )}
          </InfoCard>
        ))}
      </div>

      {/* Accesos rápidos a Qué evitar y Actividades cotidianas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 no-print">
        <Link
          to="/que-evitar"
          className="flex items-center justify-between rounded-card bg-white border border-slate-200 p-5 shadow-soft hover:border-brand-warning transition-colors"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-warning">
              Precauciones
            </span>
            <h2 className="text-lg font-extrabold text-brand-navy">
              Qué evitar durante tu recuperación
            </h2>
          </div>
          <ArrowRight className="h-5 w-5 text-brand-navy shrink-0" aria-hidden="true" />
        </Link>

        <Link
          to="/actividades"
          className="flex items-center justify-between rounded-card bg-white border border-slate-200 p-5 shadow-soft hover:border-brand-teal transition-colors"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Vida diaria
            </span>
            <h2 className="text-lg font-extrabold text-brand-navy">
              Movete con seguridad en casa
            </h2>
          </div>
          <ArrowRight className="h-5 w-5 text-brand-navy shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};
