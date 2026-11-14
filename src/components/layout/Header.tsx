import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  Menu,
  X,
  Type,
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

const MENU_ITEMS = [
  { to: '/', label: 'Mis ejercicios 3D', icon: Dumbbell },
  { to: '/cuidados', label: 'Cuidados en casa', icon: HeartHandshake },
  { to: '/que-evitar', label: 'Qué evitar (Los NO)', icon: Ban },
  { to: '/actividades', label: 'Actividades cotidianas', icon: Footprints },
  { to: '/alertas', label: 'Señales de alarma', icon: AlertTriangle, danger: true },
  { to: '/seguimiento', label: 'Mi seguimiento voluntario', icon: ClipboardList },
  { to: '/mi-cirugia', label: 'Conocé tu cirugía (HTH)', icon: Stethoscope },
  { to: '/preguntas', label: 'Preguntas frecuentes', icon: HelpCircle },
  { to: '/fuentes', label: 'Fuentes y respaldo científico', icon: BookOpen }
];

export const Header: React.FC<HeaderProps> = ({
  largeText,
  onToggleLargeText
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isExercisesActive =
    location.pathname === '/' || location.pathname.startsWith('/ejercicios');

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-300/20 bg-[#061523]/95 backdrop-blur-xl no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-xl py-1 pr-2 focus-visible:outline-[#38d9d6]"
          aria-label="Ir a Mis ejercicios — Tu rodilla, paso a paso"
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0d2840] border border-[#38d9d6]/40">
            <svg className="h-5 w-5" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path
                d="M12 6C12 6 13 11 13.5 13C14 14.5 18 14.5 18.5 13C19 11 20 6 20 6"
                stroke="#67e8f9"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M13.5 19C13 21 12 26 12 26M18.5 19C19 21 20 26 20 26"
                stroke="#67e8f9"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="16" cy="16" r="3" fill="#38d9d6" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="block text-sm sm:text-base font-bold text-white tracking-tight">
              Tu rodilla, paso a paso
            </span>
            <span className="hidden sm:block text-[11px] font-medium text-sky-200">
              Rehabilitación posoperatoria LCA (HTH)
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-5" aria-label="Navegación principal">
          <Link
            to="/"
            className={`text-xs font-bold uppercase tracking-wider transition-colors ${
              isExercisesActive ? 'text-[#67e8f9]' : 'text-sky-100 hover:text-white'
            }`}
          >
            Ejercicios
          </Link>
          <NavLink
            to="/cuidados"
            className={({ isActive }) =>
              `text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive ? 'text-[#67e8f9]' : 'text-sky-100 hover:text-white'
              }`
            }
          >
            Cuidados
          </NavLink>
          <NavLink
            to="/que-evitar"
            className={({ isActive }) =>
              `text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive ? 'text-[#67e8f9]' : 'text-sky-100 hover:text-white'
              }`
            }
          >
            Qué evitar
          </NavLink>
          <NavLink
            to="/seguimiento"
            className={({ isActive }) =>
              `text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive ? 'text-[#67e8f9]' : 'text-sky-100 hover:text-white'
              }`
            }
          >
            Seguimiento
          </NavLink>
          <NavLink
            to="/preguntas"
            className={({ isActive }) =>
              `text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive ? 'text-[#67e8f9]' : 'text-sky-100 hover:text-white'
              }`
            }
          >
            Preguntas
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/alertas"
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-200 border border-rose-400/45 hover:bg-rose-500/30 transition-colors"
            title="Ver señales de alarma médica"
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-300" aria-hidden="true" />
            <span>Alertas</span>
          </Link>

          <button
            type="button"
            onClick={onToggleLargeText}
            aria-pressed={largeText}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              largeText
                ? 'bg-[#1db8c4] text-white border-[#38d9d6]'
                : 'bg-[#0a1e30] text-sky-100 border-cyan-300/25 hover:text-white hover:border-[#38d9d6]'
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
            className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full border border-cyan-300/25 bg-[#0a1e30] text-white hover:border-[#38d9d6] transition-colors"
            aria-label={menuOpen ? 'Cerrar menú de secciones' : 'Abrir menú de secciones'}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="accessible-drawer-menu"
          className="border-t border-cyan-300/20 bg-[#071828]/98 backdrop-blur-2xl"
          role="region"
          aria-label="Menú completo de la guía"
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#67e8f9]">
                Todas las secciones de la guía
              </p>
              <button
                type="button"
                onClick={onToggleLargeText}
                className="text-xs font-bold text-[#38d9d6] underline"
              >
                {largeText
                  ? 'Volver a tamaño de letra estándar'
                  : 'Agrandar tamaño de letra (A+)'}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex min-h-[44px] items-center gap-3 rounded-2xl px-4 py-2 text-sm font-semibold transition-all border ${
                        item.danger
                          ? 'bg-rose-950/40 text-rose-200 border-rose-400/40 hover:border-rose-300'
                          : isActive
                          ? 'bg-[#1db8c4] text-white border-[#38d9d6]'
                          : 'bg-[#0b2135] text-sky-100 border-cyan-300/20 hover:border-cyan-300/50 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
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
