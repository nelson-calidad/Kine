import React from 'react';
import {
  Bed,
  Armchair,
  Footprints,
  ArrowUpDown,
  MoonStar,
  Bath,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { DAILY_ACTIVITIES_DATA } from '../data/care';
import { SectionHeader } from '../components/common/SectionHeader';
import { InfoCard } from '../components/common/InfoCard';
import { SafetyNotice } from '../components/common/SafetyNotice';

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  Bed: <Bed className="h-5 w-5" aria-hidden="true" />,
  Armchair: <Armchair className="h-5 w-5" aria-hidden="true" />,
  Footprints: <Footprints className="h-5 w-5" aria-hidden="true" />,
  ArrowUpDown: <ArrowUpDown className="h-5 w-5" aria-hidden="true" />,
  MoonStar: <MoonStar className="h-5 w-5" aria-hidden="true" />,
  Bath: <Bath className="h-5 w-5" aria-hidden="true" />
};

export const DailyActivitiesPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        badge="Actividades de la vida diaria"
        title="Movete con seguridad en casa"
        subtitle="Guía práctica para organizar tus traslados, el descanso y el aseo diario cuidando la rodilla operada."
      />

      <SafetyNotice
        title="Prioridad de las indicaciones quirúrgicas y kinésicas"
        message="Cada apartado orienta sobre cuidados generales en el domicilio, pero las instrucciones particulares de tu equipo quirúrgico (como el porcentaje de apoyo permitido o el bloqueo de la férula) prevalecen en todos los casos."
        variant="info"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {DAILY_ACTIVITIES_DATA.map((activity) => (
          <InfoCard
            key={activity.id}
            title={activity.title}
            subtitle={activity.summary}
            icon={ACTIVITY_ICONS[activity.iconName]}
            collapsible={true}
            defaultExpanded={true}
          >
            <ul className="space-y-2 text-sm sm:text-base text-brand-text">
              {activity.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-brand-teal mt-1"
                    aria-hidden="true"
                  />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-soft/45 border border-brand-teal/25 p-3 text-xs font-semibold text-brand-navy">
              <Stethoscope className="h-4 w-4 shrink-0 text-brand-teal mt-0.5" aria-hidden="true" />
              <span>{activity.surgicalTeamNote}</span>
            </div>
          </InfoCard>
        ))}
      </div>
    </div>
  );
};
