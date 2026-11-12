import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Dumbbell, HeartHandshake, ClipboardList, AlertTriangle } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Ejercicios', icon: Dumbbell, end: true, matchExercises: true },
  { to: '/cuidados', label: 'Cuidados', icon: HeartHandshake, end: false },
  { to: '/seguimiento', label: 'Seguimiento', icon: ClipboardList, end: false },
  { to: '/alertas', label: 'Alertas', icon: AlertTriangle, end: false, isAlert: true }
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      aria-label="Navegación principal móvil"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md lg:hidden no-print"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 py-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isExercisesRoute =
            item.matchExercises &&
            (location.pathname === '/' || location.pathname.startsWith('/ejercicios'));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => {
                const active = isActive || Boolean(isExercisesRoute);
                return `flex min-h-[52px] flex-col items-center justify-center rounded-xl py-1 text-xs font-semibold transition-colors ${
                  item.isAlert
                    ? active
                      ? 'bg-brand-danger text-white'
                      : 'text-brand-danger hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    : active
                    ? 'bg-brand-soft/80 text-brand-navy font-bold'
                    : 'text-brand-muted hover:text-brand-navy'
                }`;
              }}
            >
              <Icon className="h-5 w-5 mb-0.5" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
