import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  Menu,
  X,
  Type,
  Moon,
  Sun,
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
  { to: '/', label: 'Mis ejercicios', icon: Dumbbell },
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
  onToggleLargeText,
  darkMode = false,
  onToggleDarkMode
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isExercisesActive =
    location.pathname === '/' || location.pathname.startsWith('/ejercicios');

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md no-print">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
        {/* Marca / Regreso al inicio (Ejercicios) */}
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-xl py-1 pr-2 focus-visible:outline-brand-teal"
          aria-label="Ir a Mis ejercicios — Tu rodilla, paso a paso"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white shadow-sm">
            <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path
                d="M12 6C12 6 13 11 13.5 13C14 14.5 18 14.5 18.5 13C19 11 20 6 20 6"
                stroke="#D6F1EE"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M13.5 19C13 21 12 26 12 26M18.5 19C19 21 20 26 20 26"
                stroke="#D6F1EE"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="16" cy="16" r="3" fill="#32A6A4" stroke="#FFFFFF" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="block text-sm sm:text-base font-extrabold text-brand-navy tracking-tight">
              Tu rodilla, paso a paso
            </span>
            <span className="hidden sm:block text-xs text-brand-muted">
              Recuperación posoperatoria LCA (HTH)
            </span>
          </div>
        </Link>

        {/* Navegación rápida en escritorio centrada en ejercicios */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
          <Link
            to="/"
            className={`rounded-xl px-3.5 py-2 text-sm font-bold transition-colors ${
              isExercisesActive
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-brand-text hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Mis ejercicios
          </Link>
          <NavLink
            to="/cuidados"
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-brand-soft text-brand-navy'
                  : 'text-brand-text hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            Cuidados
          </NavLink>
          <NavLink
            to="/que-evitar"
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-brand-soft text-brand-navy'
                  : 'text-brand-text hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            Qué evitar
          </NavLink>
          <NavLink
            to="/seguimiento"
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-brand-soft text-brand-navy'
                  : 'text-brand-text hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            Seguimiento
          </NavLink>
          <NavLink
            to="/preguntas"
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-brand-soft text-brand-navy'
                  : 'text-brand-text hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            Preguntas
          </NavLink>
        </nav>

        {/* Controles siempre visibles: Señales de alarma + Modo oscuro + Texto grande + Menú */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/alertas"
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm font-bold text-brand-danger border border-brand-danger/30 hover:bg-rose-100/80 transition-colors"
            title="Ver señales de alarma médica"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Alertas</span>
          </Link>

          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-pressed={darkMode}
              className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white text-brand-navy hover:bg-brand-soft/40 transition-colors"
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          <button
            type="button"
            onClick={onToggleLargeText}
            aria-pressed={largeText}
            className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold transition-colors ${
              largeText
                ? 'bg-brand-navy text-white border-brand-navy'
                : 'bg-white text-brand-navy border-slate-200 hover:bg-brand-soft/40'
            }`}
            title={largeText ? 'Desactivar modo de texto grande' : 'Activar modo de texto grande'}
            aria-label={
              largeText ? 'Desactivar modo de texto grande' : 'Activar modo de texto grande'
            }
          >
            <Type className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden md:inline">{largeText ? 'Texto normal' : 'A+'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="accessible-drawer-menu"
            className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white text-brand-navy hover:bg-brand-soft/40 transition-colors"
            aria-label={menuOpen ? 'Cerrar menú de secciones' : 'Abrir menú de secciones'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menú desplegable accesible con todas las pantallas */}
      {menuOpen && (
        <div
          id="accessible-drawer-menu"
          className="border-t border-slate-200 bg-white shadow-soft-lg"
          role="region"
          aria-label="Menú completo de la guía"
        >
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                Todas las secciones de la guía
              </p>
              <button
                type="button"
                onClick={onToggleLargeText}
                className="text-xs font-semibold text-brand-teal underline"
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
                      `flex min-h-[48px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                        item.danger
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-brand-danger border border-brand-danger/25 hover:bg-rose-100/70'
                          : isActive
                          ? 'bg-brand-navy text-white'
                          : 'bg-brand-bg text-brand-text hover:bg-brand-soft/60'
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
