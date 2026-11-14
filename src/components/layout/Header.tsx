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
  { to: '/ejercicios', label: 'Ejercicios 3D (Principales y Complementarios)', icon: Dumbbell },
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
    <header className="sticky top-0 z-40 border-b border-[#244154] bg-[#061522]/95 backdrop-blur-md no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-xl py-1 pr-2 focus-visible:outline-[#25C8CC]"
          aria-label="Ir al inicio — Tu rodilla, paso a paso"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B2030] border border-[#244154]">
            <svg className="h-5 w-5" viewBox="0 0 32 32" fill="none" aria-hidden="true">
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
              <circle cx="16" cy="16" r="3" fill="#25C8CC" />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="block text-sm sm:text-base font-semibold text-[#F1F7FA] tracking-tight">
              Tu rodilla, paso a paso
            </span>
            <span className="hidden sm:block text-[11px] text-[#A7B9C6]">
              Rehabilitación postoperatoria LCA (HTH)
            </span>
          </div>
        </Link>

        {/* Navegación principal limpia: Inicio · Ejercicios · Cuidados · Seguimiento · Preguntas */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#10283A] text-[#25C8CC] border border-[#244154]'
                    : 'text-[#A7B9C6] hover:text-[#F1F7FA] hover:bg-[#0B2030]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Acceso a Señales de alarma + Texto grande + Menú */}
        <div className="flex items-center gap-2">
          <NavLink
            to="/alertas"
            className={({ isActive }) =>
              `inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                isActive
                  ? 'bg-rose-500/25 text-rose-100 border-rose-400/60'
                  : 'bg-[#0B2030] text-rose-200 border-rose-500/35 hover:border-rose-400/60'
              }`
            }
            title="Ver señales de alarma médica"
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-400" aria-hidden="true" />
            <span>Señales de alarma</span>
          </NavLink>

          <button
            type="button"
            onClick={onToggleLargeText}
            aria-pressed={largeText}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              largeText
                ? 'bg-[#25C8CC] text-[#061522] border-[#25C8CC]'
                : 'bg-[#0B2030] text-[#A7B9C6] border-[#244154] hover:text-[#F1F7FA]'
            }`}
            title={largeText ? 'Desactivar modo de texto grande' : 'Activar modo de texto grande'}
            aria-label={
              largeText ? 'Desactivar modo de texto grande' : 'Activar modo de texto grande'
            }
          >
            <Type className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden md:inline">{largeText ? 'Normal' : 'A+'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="accessible-drawer-menu"
            className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-[#244154] bg-[#0B2030] text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
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
          className="border-t border-[#244154] bg-[#0B2030]"
          role="region"
          aria-label="Menú completo de la guía"
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#82E5E4]">
                Módulos de la guía clínica
              </p>
              <button
                type="button"
                onClick={onToggleLargeText}
                className="text-xs font-semibold text-[#25C8CC] underline"
              >
                {largeText
                  ? 'Volver a tamaño de letra estándar'
                  : 'Agrandar tamaño de letra (A+)'}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {DRAWER_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex min-h-[42px] items-center gap-3 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors border ${
                        item.danger
                          ? 'bg-rose-950/30 text-rose-200 border-rose-500/35 hover:border-rose-400'
                          : isActive
                          ? 'bg-[#10283A] text-[#25C8CC] border-[#25C8CC]'
                          : 'bg-[#061522] text-[#F1F7FA] border-[#244154] hover:border-[#25C8CC]/60'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[#25C8CC]" aria-hidden="true" />
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
