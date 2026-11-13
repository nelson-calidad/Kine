import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Dumbbell, HeartHandshake, ClipboardList, AlertTriangle } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Ejercicios 3D', icon: Dumbbell, end: true, matchExercises: true },
  { to: '/cuidados', label: 'Cuidados', icon: HeartHandshake, end: false },
  { to: '/seguimiento', label: 'Seguimiento', icon: ClipboardList, end: false },
  { to: '/alertas', label: 'Alertas', icon: AlertTriangle, end: false, isAlert: true }
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      aria-label="Navegación principal móvil"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/90 backdrop-blur-xl lg:hidden no-print"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 py-1.5 gap-1">
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
                return `flex min-h-[48px] flex-col items-center justify-center rounded-2xl py-1 text-[11px] font-semibold transition-all ${
                  item.isAlert
                    ? active
                      ? 'bg-rose-500 text-white'
                      : 'text-rose-400 hover:bg-rose-950/40'
                    : active
                    ? 'bg-electric-iris text-bone-white shadow-[0_0_16px_rgba(128,82,255,0.45)]'
                    : 'text-ash-gray hover:text-bone-white'
                }`;
              }}
            >
              <Icon className="h-4 w-4 mb-0.5" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
