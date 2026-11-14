import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, HeartHandshake, ClipboardList, HelpCircle } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/ejercicios', label: 'Ejercicios', icon: Dumbbell, end: false },
  { to: '/cuidados', label: 'Cuidados', icon: HeartHandshake, end: false },
  { to: '/seguimiento', label: 'Seguimiento', icon: ClipboardList, end: false },
  { to: '/preguntas', label: 'Preguntas', icon: HelpCircle, end: false }
];

export const BottomNavigation: React.FC = () => {
  return (
    <nav
      aria-label="Navegación principal móvil"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#244154] bg-[#061522]/95 backdrop-blur-md lg:hidden no-print"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 px-1.5 py-1 gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex min-h-[46px] flex-col items-center justify-center rounded-xl py-1 text-[10px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#10283A] text-[#25C8CC] border border-[#244154]'
                    : 'text-[#A7B9C6] hover:text-[#F1F7FA]'
                }`
              }
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
