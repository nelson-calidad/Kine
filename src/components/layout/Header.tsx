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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        {/* Marca Dala: Prisma Geométrico (#8052ff -> #15846e) + Tipografía Escultural */}
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl py-1 pr-2 focus-visible:outline-electric-iris"
          aria-label="Ir a Mis ejercicios — Tu rodilla, paso a paso"
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] border border-white/15">
            <svg className="h-5 w-5" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="dalaPrismGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8052ff" />
                  <stop offset="55%" stopColor="#ffb829" />
                  <stop offset="100%" stopColor="#15846e" />
                </linearGradient>
              </defs>
              <polygon
                points="16,4 28,25 4,25"
                stroke="url(#dalaPrismGrad)"
                strokeWidth="2.2"
                fill="rgba(128,82,255,0.16)"
              />
              <circle cx="16" cy="17" r="2.8" fill="#ffffff" />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="block text-sm sm:text-base font-normal text-bone-white tracking-[-0.03em]">
              Tu rodilla, paso a paso
            </span>
            <span className="hidden sm:block text-[11px] font-semibold uppercase tracking-wider text-ash-gray">
              LCA (HTH) · 3D Studio
            </span>
          </div>
        </Link>

        {/* Navegación rápida en escritorio (Dala 12px-13px Uppercase Weight 600 #9a9a9a -> #ffffff) */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Navegación principal">
          <Link
            to="/"
            className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
              isExercisesActive ? 'text-bone-white' : 'text-ash-gray hover:text-bone-white'
            }`}
          >
            Ejercicios 3D
          </Link>
          <NavLink
            to="/cuidados"
            className={({ isActive }) =>
              `text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive ? 'text-bone-white' : 'text-ash-gray hover:text-bone-white'
              }`
            }
          >
            Cuidados
          </NavLink>
          <NavLink
            to="/que-evitar"
            className={({ isActive }) =>
              `text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive ? 'text-bone-white' : 'text-ash-gray hover:text-bone-white'
              }`
            }
          >
            Qué evitar
          </NavLink>
          <NavLink
            to="/seguimiento"
            className={({ isActive }) =>
              `text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive ? 'text-bone-white' : 'text-ash-gray hover:text-bone-white'
              }`
            }
          >
            Seguimiento
          </NavLink>
          <NavLink
            to="/preguntas"
            className={({ isActive }) =>
              `text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive ? 'text-bone-white' : 'text-ash-gray hover:text-bone-white'
              }`
            }
          >
            Preguntas
          </NavLink>
        </nav>

        {/* Controles siempre visibles */}
        <div className="flex items-center gap-2">
          <Link
            to="/alertas"
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-rose-500/15 px-3.5 py-1.5 text-xs font-semibold text-rose-300 border border-rose-500/35 hover:bg-rose-500/25 transition-colors"
            title="Ver señales de alarma médica"
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-400" aria-hidden="true" />
            <span>Alertas</span>
          </Link>

          <button
            type="button"
            onClick={onToggleLargeText}
            aria-pressed={largeText}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
              largeText
                ? 'bg-electric-iris text-white border-electric-iris'
                : 'bg-white/[0.03] text-silver-mist border-white/15 hover:text-bone-white hover:border-white/30'
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
            className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-bone-white hover:border-electric-iris transition-colors"
            aria-label={menuOpen ? 'Cerrar menú de secciones' : 'Abrir menú de secciones'}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Menú desplegable sobre terciopelo negro */}
      {menuOpen && (
        <div
          id="accessible-drawer-menu"
          className="border-t border-white/10 bg-[#050508]/95 backdrop-blur-2xl"
          role="region"
          aria-label="Menú completo de la guía"
        >
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="dala-label text-saffron-spark">
                TODAS LAS SECCIONES DE LA GUÍA
              </p>
              <button
                type="button"
                onClick={onToggleLargeText}
                className="text-xs font-semibold text-electric-iris underline"
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
                      `flex min-h-[46px] items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all border ${
                        item.danger
                          ? 'bg-rose-950/30 text-rose-300 border-rose-500/30 hover:border-rose-400'
                          : isActive
                          ? 'bg-electric-iris text-bone-white border-electric-iris shadow-[0_0_20px_rgba(128,82,255,0.4)]'
                          : 'bg-white/[0.02] text-silver-mist border-white/10 hover:border-white/25 hover:text-bone-white'
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
