import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, HeartHandshake, AlertTriangle } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/ejercicios', label: 'Ejercicios', icon: Dumbbell, end: false },
  { to: '/cuidados', label: 'Cuidados', icon: HeartHandshake, end: false },
  { to: '/alertas', label: 'Alertas', icon: AlertTriangle, end: false, isAlert: true }
];

export const BottomNavigation: React.FC = () => {
  return (
    <nav
      aria-label="Navegación principal móvil"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 backdrop-blur-md lg:hidden no-print"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 py-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex min-h-[52px] flex-col items-center justify-center rounded-xl py-1 text-xs font-semibold transition-colors ${
                  item.isAlert
                    ? isActive
                      ? 'bg-brand-danger text-white'
                      : 'text-brand-danger hover:bg-rose-50'
                    : isActive
                    ? 'bg-brand-soft/80 text-brand-navy font-bold'
                    : 'text-brand-muted hover:text-brand-navy'
                }`
              }
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
