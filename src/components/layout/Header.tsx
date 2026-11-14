import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  Menu,
  X,
  Type,
  Home,
  Dumbbell,
  HeartHandshake,
  Ban,
  Footprints,
  ClipboardList,
  HelpCircle,
  Stethoscope,
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  largeText: boolean;
  onToggleLargeText: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const PRIMARY_NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/ejercicios', label: 'Ejercicios', end: false },
  { to: '/cuidados', label: 'Cuidados', end: false },
  { to: '/seguimiento', label: 'Seguimiento', end: false },
  { to: '/preguntas', label: 'Preguntas', end: false }
];

const DRAWER_ITEMS = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/ejercicios', label: 'Ejercicios de rehabilitación', icon: Dumbbell },
  { to: '/cuidados', label: 'Cuidados y recomendaciones', icon: HeartHandshake },
  { to: '/que-evitar', label: 'Qué evitar en esta etapa', icon: Ban },
  { to: '/seguimiento', label: 'Seguimiento de evolución', icon: ClipboardList },
  { to: '/preguntas', label: 'Preguntas frecuentes', icon: HelpCircle },
  { to: '/actividades', label: 'Actividades de la vida diaria', icon: Footprints },
  { to: '/mi-cirugia', label: 'Cirugía LCA (Injerto HTH)', icon: Stethoscope },
  { to: '/fuentes', label: 'Fuentes científicas', icon: BookOpen },
  { to: '/alertas', label: 'Señales de alarma', icon: AlertTriangle, danger: true }
];

export const Header: React.FC<HeaderProps> = ({
  largeText,
  onToggleLargeText
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#1E394B] bg-[#061522]/95 backdrop-blur-md no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg py-0.5 pr-1 focus-visible:outline-[#25C8CC]"
          aria-label="Ir al inicio — Tu rodilla, paso a paso"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0B2030] border border-[#1E394B]">
            <svg className="h-4 w-4" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path
                d="M12 6C12 6 13 11 13.5 13C14 14.5 18 14.5 18.5 13C19 11 20 6 20 6"
                stroke="#F1F7FA"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M13.5 19C13 21 12 26 12 26M18.5 19C19 21 20 26 20 26"
                stroke="#F1F7FA"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="16" cy="16" r="2.8" fill="#25C8CC" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-[#F1F7FA] tracking-tight">
            Tu rodilla, paso a paso
          </span>
        </Link>

        {/* Navegación principal en escritorio */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-[#25C8CC] bg-[#0B2030]'
                    : 'text-[#A7B9C6] hover:text-[#F1F7FA]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Ícono discreto de señales de alarma + Texto grande + Menú */}
        <div className="flex items-center gap-1.5">
          <NavLink
            to="/alertas"
            className={({ isActive }) =>
              `inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                isActive
                  ? 'bg-[#10283A] text-amber-300 border-amber-400/50'
                  : 'bg-[#0B2030] text-[#A7B9C6] border-[#1E394B] hover:text-amber-300 hover:border-amber-400/40'
              }`
            }
            title="Señales de alarma"
            aria-label="Señales de alarma"
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </NavLink>

          <button
            type="button"
            onClick={onToggleLargeText}
            aria-pressed={largeText}
            className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg border px-2 text-xs font-medium transition-colors ${
              largeText
                ? 'bg-[#10283A] text-[#25C8CC] border-[#25C8CC]/60'
                : 'bg-[#0B2030] text-[#A7B9C6] border-[#1E394B] hover:text-[#F1F7FA]'
            }`}
            title={largeText ? 'Desactivar modo de texto grande' : 'Activar modo de texto grande'}
            aria-label={
              largeText ? 'Desactivar modo de texto grande' : 'Activar modo de texto grande'
            }
          >
            <Type className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="accessible-drawer-menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E394B] bg-[#0B2030] text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
            aria-label={menuOpen ? 'Cerrar menú de secciones' : 'Abrir menú de secciones'}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Menú desplegable */}
      {menuOpen && (
        <div
          id="accessible-drawer-menu"
          className="border-t border-[#1E394B] bg-[#0B2030]"
          role="region"
          aria-label="Menú completo de la guía"
        >
          <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6">
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {DRAWER_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex min-h-[38px] items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors border ${
                        item.danger
                          ? 'bg-[#061522] text-amber-200 border-amber-500/30 hover:border-amber-400'
                          : isActive
                          ? 'bg-[#10283A] text-[#25C8CC] border-[#25C8CC]/60'
                          : 'bg-[#061522] text-[#F1F7FA] border-[#1E394B] hover:border-[#25C8CC]/50'
                      }`
                    }
                  >
                    <Icon
                      className={`h-3.5 w-3.5 shrink-0 ${
                        item.danger ? 'text-amber-300' : 'text-[#25C8CC]'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
