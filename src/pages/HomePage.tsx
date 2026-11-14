import React, { Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Ban,
  ClipboardList,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  OctagonAlert,
  ChevronDown,
  ChevronUp,
  ArrowDown
} from 'lucide-react';
import { EXERCISES_DATA } from '../data/exercises';
import { ExerciseCard } from '../components/exercises/ExerciseCard';
import { ExerciseModal } from '../components/exercises/ExerciseModal';

const ConstellationHero3D = lazy(
  () => import('../components/exercises/three/ConstellationHero3D')
);

type ClinicalModuleTab =
  | 'cuidados'
  | 'evitar'
  | 'seguimiento'
  | 'preguntas'
  | 'alertas';

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
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);
  const [activeModule, setActiveModule] = useState<ClinicalModuleTab>('cuidados');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const scrollToExercises = () => {
    const el = document.getElementById('seccion-ejercicios');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* =================================================================== */}
      {/* 1. PORTADA MINIMALISTA CON RODILLA ANATÓMICA 3D PROTAGONISTA        */}
      {/* =================================================================== */}
      <section aria-labelledby="hero-heading" className="no-print pt-1 sm:pt-2">
        <div className="mx-auto max-w-4xl flex flex-col items-center text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#25C8CC]">
            REHABILITACIÓN · LCA / HTH
          </span>

          <h1
            id="hero-heading"
            className="mt-1.5 text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#F1F7FA] tracking-tight"
          >
            Conocé tu rodilla
          </h1>

          <p className="mt-1 text-sm sm:text-base text-[#A7B9C6]">
            Explorá tu recuperación, paso a paso
          </p>

          {/* Rodilla anatómica 3D protagonista (60–70% del área visual principal) */}
          <div className="mt-4 w-full h-[340px] sm:h-[420px] lg:h-[460px]">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center rounded-2xl border border-[#1E394B] bg-[#071826]">
                  <span className="text-xs font-medium text-[#A7B9C6]">
                    Cargando modelo anatómico 3D...
                  </span>
                </div>
              }
            >
              <ConstellationHero3D />
            </Suspense>
          </div>

          {/* Acción única debajo del modelo + referencia clínica discreta */}
          <div className="mt-5 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={scrollToExercises}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#25C8CC] px-6 py-2.5 text-sm font-semibold text-[#061522] hover:bg-[#82E5E4] transition-colors shadow-soft"
            >
              <span>Explorar los ejercicios</span>
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </button>

            <p className="text-[11px] sm:text-xs text-[#A7B9C6]">
              Etapa inicial · Semanas 1–3 · Según indicación profesional
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. SECCIÓN UNIFICADA DE EJERCICIOS (CUADRÍCULA RESPONSIVE)          */}
      {/* =================================================================== */}
      <section
        id="seccion-ejercicios"
        aria-labelledby="unified-exercises-heading"
        className="scroll-mt-16 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#1E394B] pb-3.5">
          <div>
            <h2
              id="unified-exercises-heading"
              className="text-2xl sm:text-3xl font-semibold text-[#F1F7FA] tracking-tight"
            >
              Tus ejercicios
            </h2>
            <p className="mt-0.5 text-sm text-[#A7B9C6]">
              Movilidad y recuperación funcional
            </p>
          </div>

          <p className="text-xs text-[#A7B9C6] max-w-md sm:text-right">
            Tocá cualquier tarjeta para abrir su vista ampliada. La selección y progresión dependen
            de la indicación de tu equipo tratante.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {EXERCISES_DATA.map((exercise, idx) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              indexNumber={idx + 1}
              onExpand={() => setSelectedExerciseIndex(idx)}
            />
          ))}
        </div>
      </section>

      {/* Modal de vista ampliada del ejercicio */}
      <ExerciseModal
        exercises={EXERCISES_DATA}
        activeIndex={selectedExerciseIndex}
        onClose={() => setSelectedExerciseIndex(null)}
        onSelectIndex={(idx) => setSelectedExerciseIndex(idx)}
      />

      {/* =================================================================== */}
      {/* 3. MÓDULOS EDUCATIVOS Y CLÍNICOS COMPLEMENTARIOS                    */}
      {/* =================================================================== */}
      <section
        id="modulos-clinicos"
        aria-labelledby="modulos-clinicos-heading"
        className="pt-6 border-t border-[#1E394B] scroll-mt-16 space-y-4 no-print"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2
              id="modulos-clinicos-heading"
              className="text-xl sm:text-2xl font-semibold text-[#F1F7FA]"
            >
              Cuidados, recomendaciones y seguimiento
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-[#A7B9C6]">
              Pautas de protección del injerto HTH, control diario y señales de alarma.
            </p>
          </div>
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
              { id: 'preguntas', label: 'Preguntas', icon: HelpCircle },
              { id: 'alertas', label: 'Señales de alarma', icon: AlertTriangle }
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
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium border transition-colors ${
                  active
                    ? isAlert
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-100'
                      : 'bg-[#10283A] border-[#25C8CC] text-[#25C8CC]'
                    : 'bg-[#0B2030] border-[#1E394B] text-[#A7B9C6] hover:text-[#F1F7FA]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel del módulo activo */}
        <div className="rounded-2xl border border-[#1E394B] bg-[#0B2030] p-4 sm:p-6">
          {activeModule === 'cuidados' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#F1F7FA]">
                    Cuidados domiciliarios esenciales
                  </h3>
                  <p className="text-xs text-[#A7B9C6]">
                    Herida quirúrgica, manejo del frío, muletas, posicionamiento y descanso.
                  </p>
                </div>
                <Link
                  to="/cuidados"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E394B] bg-[#10283A] px-3.5 py-2 text-xs font-medium text-[#82E5E4] hover:border-[#25C8CC]"
                >
                  <span>Ver guía completa</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CARE_CARDS.map((card, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#1E394B] bg-[#10283A] p-3.5 flex flex-col justify-between"
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

          {activeModule === 'evitar' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#F1F7FA]">
                    Conductas que deben evitarse en esta etapa
                  </h3>
                  <p className="text-xs text-[#A7B9C6]">
                    Precauciones para proteger el injerto HTH y favorecer la recuperación.
                  </p>
                </div>
                <Link
                  to="/que-evitar"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E394B] bg-[#10283A] px-3.5 py-2 text-xs font-medium text-[#82E5E4] hover:border-[#25C8CC]"
                >
                  <span>Ver detalle</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {AVOID_CARDS.map((card, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#1E394B] bg-[#10283A] p-3.5"
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

          {activeModule === 'seguimiento' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#F1F7FA]">
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
                  <span>Abrir registro</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TRACKING_CARDS.map((card, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#1E394B] bg-[#10283A] p-3.5"
                  >
                    <h4 className="text-sm font-semibold text-[#F1F7FA] mb-1">{card.title}</h4>
                    <p className="text-xs text-[#A7B9C6] leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModule === 'preguntas' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#F1F7FA]">
                    Preguntas frecuentes
                  </h3>
                  <p className="text-xs text-[#A7B9C6]">
                    Respuestas educativas breves sobre la recuperación inicial.
                  </p>
                </div>
                <Link
                  to="/preguntas"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E394B] bg-[#10283A] px-3.5 py-2 text-xs font-medium text-[#82E5E4] hover:border-[#25C8CC]"
                >
                  <span>Ver todas</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-2">
                {HOME_FAQS.map((item, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#1E394B] bg-[#10283A] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#F1F7FA]"
                      >
                        <span>{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 shrink-0 text-[#25C8CC]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 text-[#25C8CC]" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="border-t border-[#1E394B] bg-[#061522]/60 px-4 py-3 text-xs text-[#A7B9C6] leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeModule === 'alertas' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#F1F7FA]">
                    Señales de alarma para consulta médica
                  </h3>
                  <p className="text-xs text-[#A7B9C6]">
                    Orientación informativa; esta página no reemplaza la evaluación médica.
                  </p>
                </div>
                <Link
                  to="/alertas"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-500/15 px-3.5 py-2 text-xs font-medium text-amber-100 hover:bg-amber-500/25"
                >
                  <span>Ver detalle de alertas</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                <div className="lg:col-span-7 rounded-xl border border-[#1E394B] bg-[#10283A] p-4">
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

                <div className="lg:col-span-5 rounded-xl border border-rose-500/35 bg-rose-950/20 p-4 flex flex-col justify-between">
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
        </div>
      </section>
    </div>
  );
};
