import React, { Suspense, lazy, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Ban,
  ClipboardList,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  Printer,
  ChevronRight,
  Layers,
  LayoutGrid,
  CheckCircle2,
  OctagonAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EXERCISES_DATA } from '../data/exercises';
import { ExerciseCarousel } from '../components/exercises/ExerciseCarousel';
import { ExerciseCard } from '../components/exercises/ExerciseCard';

const ConstellationHero3D = lazy(
  () => import('../components/exercises/three/ConstellationHero3D')
);

type ClinicalModuleTab =
  | 'cuidados'
  | 'evitar'
  | 'seguimiento'
  | 'preguntas'
  | 'alertas'
  | 'fuentes';

const CARE_CARDS = [
  {
    title: 'Herida quirúrgica',
    desc: 'Mantener el vendaje limpio y seco. No retirar apósitos ni mojar la herida sin indicación médica.'
  },
  {
    title: 'Manejo del frío local',
    desc: 'Aplicar frío protegiendo siempre la piel con un paño para ayudar a controlar el dolor y la inflamación.'
  },
  {
    title: 'Muletas y apoyo',
    desc: 'Respetar estrictamente el grado de carga y uso de inmovilizador o muletas autorizado por el equipo quirúrgico.'
  },
  {
    title: 'Posicionamiento',
    desc: 'Al descansar, elevar el miembro con apoyo bajo el talón o pantorrilla distal dejando la rodilla en extensión.'
  },
  {
    title: 'Descanso y dosificación',
    desc: 'Alternar períodos de reposo con los ejercicios indicados según tolerancia clínica diaria.'
  }
];

const AVOID_CARDS = [
  {
    title: 'Flexiones forzadas',
    desc: 'No empujar la rodilla más allá del rango tolerado ni forzar ante dolor intenso o bloqueo.'
  },
  {
    title: 'Movimientos bruscos o giros',
    desc: 'Evitar rotaciones sobre el pie apoyado, rebotes o cambios rápidos de dirección.'
  },
  {
    title: 'Sobrecarga sin autorización',
    desc: 'No abandonar las muletas ni cargar todo el peso corporal antes de la indicación profesional.'
  },
  {
    title: 'Ejercicios avanzados no indicados',
    desc: 'No realizar saltos, trote, sentadillas profundas ni trabajo con cargas elevadas en esta etapa.'
  },
  {
    title: 'Almohada bajo la rodilla de forma sostenida',
    desc: 'Permanecer con la rodilla semiflexionada sobre una almohada dificulta recuperar la extensión completa a 0°.'
  }
];

const TRACKING_CARDS = [
  {
    title: 'Registro de dolor',
    desc: 'Anotar el nivel de molestia antes y después de la sesión para adecuar la progresión.'
  },
  {
    title: 'Registro de derrame',
    desc: 'Observar si la hinchazón disminuye con el reposo y el hielo o si aumenta tras la actividad.'
  },
  {
    title: 'Evolución del rango articular',
    desc: 'Seguir de manera progresiva la recuperación de la extensión a 0° y la ganancia de flexión.'
  },
  {
    title: 'Tolerancia a ejercicios',
    desc: 'Identificar qué ejercicios resultan cómodos y cuáles generan fatiga o tensión anterior.'
  },
  {
    title: 'Observaciones del profesional',
    desc: 'Registrar las pautas específicas indicadas en cada control kinesiológico y médico.'
  }
];

const HOME_FAQS = [
  {
    q: '¿Cuándo puedo comenzar a flexionar?',
    a: 'El inicio y el rango de flexión dependen de la indicación de tu cirujano y kinesiólogo (por ejemplo, si hubo procedimientos meniscales asociados). Comenzá siempre de forma suave y controlada según esa pauta.'
  },
  {
    q: '¿Es normal presentar inflamación?',
    a: 'Un derrame leve a moderado es frecuente durante las primeras semanas. El reposo con pierna elevada, el frío local protegido y el bombeo de tobillo ayudan a controlarlo.'
  },
  {
    q: '¿Qué hago si aumenta el dolor?',
    a: 'Si aparece dolor intenso durante un ejercicio, detené la actividad, aplicá las medidas de reposo indicadas y consultalo con tu kinesiólogo antes de retomar.'
  },
  {
    q: '¿Por qué debo recuperar la extensión?',
    a: 'Alcanzar la extensión completa a 0° es indispensable para caminar sin renguera y permitir que el cuádriceps estabilice adecuadamente la rodilla.'
  },
  {
    q: '¿Todos los pacientes hacen los mismos ejercicios?',
    a: 'No. Esta guía es educativa; la selección de ejercicios, el momento de inicio y la dosificación se adaptan de forma individual según la evolución clínica y las indicaciones del equipo tratante.'
  }
];

const ALARM_SIGNS = [
  'Fiebre persistente o escalofríos.',
  'Secreción, calor marcado o enrojecimiento progresivo en la herida quirúrgica.',
  'Dolor intenso que empeora y no cede con el reposo ni la medicación indicada.',
  'Hinchazón importante, tensión o dolor inusual en la pantorrilla.',
  'Empeoramiento significativo de los síntomas o aparición de bloqueo articular.'
];

export const HomePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [activeModule, setActiveModule] = useState<ClinicalModuleTab>('cuidados');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const flexionExercises = useMemo(
    () => EXERCISES_DATA.filter((e) => e.section !== 'complementario'),
    []
  );

  const complementaryExercises = useMemo(
    () => EXERCISES_DATA.filter((e) => e.section === 'complementario'),
    []
  );

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* =================================================================== */}
      {/* 1. PORTADA (HERO): BREVE, DIRECTA + RODILLA ANATÓMICA 3D            */}
      {/* =================================================================== */}
      <section aria-labelledby="hero-heading" className="no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center gap-5 sm:gap-8 rounded-2xl border border-[#244154] bg-[#0B2030] p-5 sm:p-7">
          {/* Izquierda en escritorio: Etiqueta discreta, Título, Subtítulo, Descripción breve y 2 Botones */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#10283A] border border-[#244154] px-3 py-1 text-xs font-medium text-[#82E5E4] mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#25C8CC]" />
              <span>Semanas 1–3 · Según indicación profesional</span>
            </span>

            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#F1F7FA] tracking-tight leading-tight"
            >
              Tu rodilla, paso a paso.
            </h1>

            <p className="mt-1.5 text-base sm:text-lg font-medium text-[#82E5E4]">
              Rehabilitación postoperatoria de LCA (HTH)
            </p>

            <p className="mt-2.5 text-sm sm:text-base text-[#A7B9C6] leading-relaxed max-w-lg">
              Guía interactiva de ejercicios y cuidados para la recuperación inicial.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('modulo-ejercicios-principales')}
                className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#25C8CC] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#061522] hover:bg-[#82E5E4] transition-colors"
              >
                Ver ejercicios
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveModule('cuidados');
                  scrollToSection('modulos-clinicos');
                }}
                className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-[#244154] bg-[#10283A] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
              >
                Cuidados y recomendaciones
              </button>
            </div>
          </div>

          {/* Derecha en escritorio: Rodilla Anatómica 3D */}
          <div className="lg:col-span-6 h-[240px] sm:h-[290px] lg:h-[320px] w-full">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center rounded-2xl border border-[#244154] bg-[#081A28]">
                  <span className="text-xs font-medium text-[#A7B9C6]">
                    Cargando anatomía 3D de rodilla...
                  </span>
                </div>
              }
            >
              <ConstellationHero3D />
            </Suspense>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. MÓDULO A — EJERCICIOS PRINCIPALES (PROTAGONISTA)                 */}
      {/* =================================================================== */}
      <section
        id="modulo-ejercicios-principales"
        aria-labelledby="flexion-heading"
        className="scroll-mt-20 space-y-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#244154] pb-3.5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#25C8CC] block mb-1">
              Módulo A · 5 Ejercicios principales del banner
            </span>
            <h2 id="flexion-heading" className="text-2xl sm:text-3xl font-semibold text-[#F1F7FA]">
              Recuperación de la flexión
            </h2>
          </div>

          <div className="flex items-center gap-2 no-print">
            <div className="inline-flex items-center rounded-xl border border-[#244154] bg-[#0B2030] p-1">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                aria-pressed={viewMode === 'carousel'}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  viewMode === 'carousel'
                    ? 'bg-[#25C8CC] text-[#061522]'
                    : 'text-[#A7B9C6] hover:text-[#F1F7FA]'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Vista protagonista</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#25C8CC] text-[#061522]'
                    : 'text-[#A7B9C6] hover:text-[#F1F7FA]'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Todas las tarjetas</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              aria-label="Imprimir cartilla"
              className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-xl border border-[#244154] bg-[#0B2030] px-3 py-1.5 text-xs font-semibold text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-[#25C8CC]" aria-hidden="true" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        </div>

        {viewMode === 'carousel' ? (
          <div className="no-print">
            <ExerciseCarousel
              exercises={flexionExercises}
              startIndexOffset={0}
              variant="banner"
            />
          </div>
        ) : null}

        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-5 lg:grid-cols-2'
              : 'hidden print:grid print:grid-cols-1 print:gap-5'
          }
        >
          {flexionExercises.map((exercise, idx) => {
            const isOddLast =
              flexionExercises.length % 2 === 1 && idx === flexionExercises.length - 1;
            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                indexNumber={idx + 1}
                featured={isOddLast}
              />
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. MÓDULO B — EJERCICIOS COMPLEMENTARIOS (SECCIÓN SECUNDARIA)       */}
      {/* =================================================================== */}
      <section
        id="modulo-ejercicios-complementarios"
        aria-labelledby="complementaria-heading"
        className="pt-6 border-t border-[#244154] space-y-4"
      >
        <div className="rounded-2xl border border-[#244154] bg-[#0B2030] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#82E5E4] block mb-1">
              Módulo B · Ejercicios complementarios (6 al 9)
            </span>
            <h2
              id="complementaria-heading"
              className="text-xl sm:text-2xl font-semibold text-[#F1F7FA]"
            >
              Movilidad y activación complementaria
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#A7B9C6] max-w-3xl leading-relaxed">
              La rehabilitación temprana no consiste exclusivamente en ganar flexión: también
              requiere preservar la extensión completa a 0°, activar el cuádriceps y recuperar el
              control muscular según indicación profesional.
            </p>
          </div>
        </div>

        {viewMode === 'carousel' ? (
          <div className="no-print">
            <ExerciseCarousel
              exercises={complementaryExercises}
              startIndexOffset={5}
              variant="complementary"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {complementaryExercises.map((exercise, idx) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                indexNumber={idx + 6}
                featured={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* =================================================================== */}
      {/* 4. MÓDULOS EDUCATIVOS ORGANIZADOS POR PESTAÑAS (CUIDADOS, EVITAR,   */}
      {/*    SEGUIMIENTO, PREGUNTAS, SEÑALES DE ALARMA Y FUENTES)             */}
      {/* =================================================================== */}
      <section
        id="modulos-clinicos"
        aria-labelledby="modulos-clinicos-heading"
        className="pt-6 border-t border-[#244154] scroll-mt-20 space-y-4 no-print"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#25C8CC] block mb-1">
              Módulos educativos y de acompañamiento
            </span>
            <h2
              id="modulos-clinicos-heading"
              className="text-xl sm:text-2xl font-semibold text-[#F1F7FA]"
            >
              Cuidados, recomendaciones y seguimiento
            </h2>
          </div>
          <p className="text-xs text-[#A7B9C6]">
            Seleccioná un módulo para consultar sus pautas o abrir la sección completa.
          </p>
        </div>

        {/* Pestañas de selección de módulo */}
        <div
          role="tablist"
          aria-label="Módulos educativos"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1"
        >
          {(
            [
              { id: 'cuidados', label: 'Cuidados', icon: HeartHandshake },
              { id: 'evitar', label: 'Qué evitar', icon: Ban },
              { id: 'seguimiento', label: 'Seguimiento', icon: ClipboardList },
              { id: 'preguntas', label: 'Preguntas frecuentes', icon: HelpCircle },
              { id: 'alertas', label: 'Señales de alarma', icon: AlertTriangle },
              { id: 'fuentes', label: 'Fuentes', icon: BookOpen }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeModule === tab.id;
            const isAlert = tab.id === 'alertas';
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveModule(tab.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors ${
                  active
                    ? isAlert
                      ? 'bg-rose-500/20 border-rose-400 text-rose-100'
                      : 'bg-[#25C8CC] border-[#25C8CC] text-[#061522]'
                    : isAlert
                    ? 'bg-[#0B2030] border-rose-500/35 text-rose-200 hover:border-rose-400'
                    : 'bg-[#0B2030] border-[#244154] text-[#A7B9C6] hover:text-[#F1F7FA]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel del módulo activo */}
        <div className="rounded-2xl border border-[#244154] bg-[#0B2030] p-4 sm:p-6">
          {/* MÓDULO C: CUIDADOS */}
          {activeModule === 'cuidados' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-[#F1F7FA]">
                    Cuidados domiciliarios esenciales
                  </h3>
                  <p className="text-xs text-[#A7B9C6]">
                    Herida quirúrgica, manejo del frío, muletas, posicionamiento y descanso.
                  </p>
                </div>
                <Link
                  to="/cuidados"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#244154] bg-[#10283A] px-3.5 py-2 text-xs font-semibold text-[#82E5E4] hover:border-[#25C8CC]"
                >
                  <span>Abrir guía completa de cuidados</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CARE_CARDS.map((card, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#244154] bg-[#10283A] p-3.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <CheckCircle2 className="h-4 w-4 text-[#25C8CC] shrink-0" />
                        <h4 className="text-sm font-semibold text-[#F1F7FA]">{card.title}</h4>
                      </div>
                      <p className="text-xs text-[#A7B9C6] leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MÓDULO D: QUÉ EVITAR */}
          {activeModule === 'evitar' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-[#F1F7FA]">
                    Conductas que deben evitarse en esta etapa
                  </h3>
                  <p className="text-xs text-[#A7B9C6]">
                    Precauciones para proteger el injerto HTH y favorecer la recuperación.
                  </p>
                </div>
                <Link
                  to="/que-evitar"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#244154] bg-[#10283A] px-3.5 py-2 text-xs font-semibold text-[#82E5E4] hover:border-[#25C8CC]"
                >
                  <span>Ver detalle de restricciones</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {AVOID_CARDS.map((card, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#244154] bg-[#10283A] p-3.5"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Ban className="h-4 w-4 text-amber-300 shrink-0" />
                      <h4 className="text-sm font-semibold text-[#F1F7FA]">{card.title}</h4>
                    </div>
                    <p className="text-xs text-[#A7B9C6] leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MÓDULO E: SEGUIMIENTO */}
          {activeModule === 'seguimiento' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-[#F1F7FA]">
                    Seguimiento de evolución diaria
                  </h3>
                  <p className="text-xs text-[#A7B9C6]">
                    Parámetros útiles para registrar en tu dispositivo y compartir en consulta.
                  </p>
                </div>
                <Link
                  to="/seguimiento"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#25C8CC] px-4 py-2 text-xs font-semibold text-[#061522] hover:bg-[#82E5E4]"
                >
                  <span>Abrir registro interactivo</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TRACKING_CARDS.map((card, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#244154] bg-[#10283A] p-3.5"
                  >
                    <h4 className="text-sm font-semibold text-[#F1F7FA] mb-1">{card.title}</h4>
                    <p className="text-xs text-[#A7B9C6] leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MÓDULO F: PREGUNTAS FRECUENTES */}
          {activeModule === 'preguntas' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-[#F1F7FA]">
                    Preguntas frecuentes
                  </h3>
                  <p className="text-xs text-[#A7B9C6]">
                    Respuestas educativas breves y prudentes sobre la recuperación inicial.
                  </p>
                </div>
                <Link
                  to="/preguntas"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#244154] bg-[#10283A] px-3.5 py-2 text-xs font-semibold text-[#82E5E4] hover:border-[#25C8CC]"
                >
                  <span>Ver todas las preguntas</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-2">
                {HOME_FAQS.map((item, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#244154] bg-[#10283A] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-xs sm:text-sm font-semibold text-[#F1F7FA]"
                      >
                        <span>{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 shrink-0 text-[#25C8CC]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 text-[#25C8CC]" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="border-t border-[#244154] bg-[#061522]/60 px-4 py-3 text-xs text-[#A7B9C6] leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MÓDULO H: SEÑALES DE ALARMA */}
          {activeModule === 'alertas' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-[#F1F7FA]">
                    Señales de alarma para consulta médica
                  </h3>
                  <p className="text-xs text-[#A7B9C6]">
                    Orientación informativa; esta página no es una herramienta diagnóstica.
                  </p>
                </div>
                <Link
                  to="/alertas"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400/50 bg-rose-500/20 px-3.5 py-2 text-xs font-semibold text-rose-100 hover:bg-rose-500/30"
                >
                  <span>Ver detalle completo de alertas</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                <div className="lg:col-span-7 rounded-xl border border-[#244154] bg-[#10283A] p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 block mb-2">
                    Consultar al equipo tratante ante:
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#F1F7FA]">
                    {ALARM_SIGNS.map((sign, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-5 rounded-xl border border-rose-500/40 bg-rose-950/25 p-4 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <OctagonAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-rose-100">
                        Atención médica urgente inmediata
                      </h4>
                      <p className="mt-1.5 text-xs text-rose-200/90 leading-relaxed">
                        La aparición de <strong>dificultad respiratoria</strong> o{' '}
                        <strong>dolor torácico</strong> requiere acudir o comunicarse de inmediato
                        con un servicio de emergencias médicas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO G: FUENTES Y CIRUGÍA */}
          {activeModule === 'fuentes' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                to="/fuentes"
                className="group rounded-xl border border-[#244154] bg-[#10283A] p-4 flex items-center justify-between hover:border-[#25C8CC] transition-colors"
              >
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#25C8CC]">
                    Módulo G · Respaldo académico
                  </span>
                  <h3 className="text-base font-semibold text-[#F1F7FA] mt-0.5">
                    Bibliografía y fundamentos científicos
                  </h3>
                  <p className="text-xs text-[#A7B9C6] mt-1">
                    Guías clínicas y protocolos internacionales de rehabilitación de LCA.
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#25C8CC] shrink-0" />
              </Link>

              <Link
                to="/mi-cirugia"
                className="group rounded-xl border border-[#244154] bg-[#10283A] p-4 flex items-center justify-between hover:border-[#25C8CC] transition-colors"
              >
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#82E5E4]">
                    Educación anatómica
                  </span>
                  <h3 className="text-base font-semibold text-[#F1F7FA] mt-0.5">
                    ¿En qué consiste la cirugía LCA (HTH)?
                  </h3>
                  <p className="text-xs text-[#A7B9C6] mt-1">
                    Explicación del autoinjerto hueso–tendón–hueso rotuliano y sus tiempos biológicos.
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#25C8CC] shrink-0" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
