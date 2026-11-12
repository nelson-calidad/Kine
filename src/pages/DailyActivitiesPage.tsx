import React from 'react';
import {
  Bed,
  Armchair,
  Footprints,
  ArrowUpDown,
  MoonStar,
  Bath,
  CheckCircle2
} from 'lucide-react';
import { DAILY_ACTIVITIES_DATA } from '../data/care';
import { SectionHeader } from '../components/common/SectionHeader';
import { InfoCard } from '../components/common/InfoCard';

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
          </InfoCard>
        ))}
      </div>
    </div>
  );
};
