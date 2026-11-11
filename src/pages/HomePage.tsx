import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  HeartHandshake,
  Ban,
  Footprints,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Move,
  ThermometerSnowflake,
  Zap,
  ShieldCheck,
  Stethoscope,
  ClipboardList,
  BookOpen
} from 'lucide-react';
import { SafetyNotice } from '../components/common/SafetyNotice';

const MAIN_CONSULTATION_CARDS = [
  {
    to: '/ejercicios',
    title: 'Mis ejercicios',
    description: 'Movilidad inicial, asistida, progresión autorizada y ejercicios complementarios.',
    icon: Dumbbell,
    accent: 'bg-brand-soft text-brand-navy'
  },
  {
    to: '/cuidados',
    title: 'Cuidados en casa',
    description: 'Cuidado de la herida, manejo de hinchazón, posicionamiento, muletas y descanso.',
    icon: HeartHandshake,
    accent: 'bg-brand-soft text-brand-navy'
  },
  {
    to: '/que-evitar',
    title: 'Qué evitar',
    description: 'Los NO en casa durante tu recuperación y por qué es importante respetarlos.',
    icon: Ban,
    accent: 'bg-amber-100/80 text-brand-warning'
  },
  {
    to: '/actividades',
    title: 'Caminar y descansar',
    description: 'Cómo levantarte de la cama, sentarte, usar muletas, escaleras, dormir y bañarte.',
    icon: Footprints,
    accent: 'bg-brand-soft text-brand-navy'
  },
  {
    to: '/alertas',
    title: 'Señales de alarma',
    description: 'Pautas claras para diferenciar cuándo realizar una consulta médica urgente o de emergencia.',
    icon: AlertTriangle,
    accent: 'bg-rose-100 text-brand-danger',
    isDanger: true
  },
  {
    to: '/preguntas',
    title: 'Mis preguntas',
    description: 'Respuestas claras y breves a las dudas más frecuentes en el posoperatorio.',
    icon: HelpCircle,
    accent: 'bg-brand-soft text-brand-navy'
  }
];

const STAGE_GOALS = [
  {
    title: 'Recuperar movilidad',
    description: 'Mejorar gradualmente la flexión y la extensión dentro del rango autorizado.',
    icon: Move
  },
  {
    title: 'Controlar la hinchazón',
    description: 'Acompañar el reposo, la elevación y las pautas indicadas para desinflamar.',
    icon: ThermometerSnowflake
  },
  {
    title: 'Activar los músculos',
    description: 'Despertar suavemente el cuádriceps y movilizar el tobillo sin sobrecargar.',
    icon: Zap
  },
  {
    title: 'Caminar con seguridad',
    description: 'Desplazarte con muletas y rodillera respetando el apoyo prescripto.',
    icon: ShieldCheck
  }
];

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-10 sm:space-y-12">
      {/* 1. HERO VISUAL DE ALTA CALIDAD */}
      <section className="rounded-card-lg bg-brand-navy text-white p-6 sm:p-10 shadow-soft-lg overflow-hidden">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-block rounded-full bg-brand-teal/25 border border-brand-soft/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-soft">
              Guía de recuperación en casa · LCA (HTH)
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Tu rodilla, paso a paso
            </h1>
            <p className="text-base sm:text-lg text-brand-soft/95 leading-relaxed max-w-2xl">
              Aprendé a cuidar tu rodilla y conocé los ejercicios que pueden formar parte de tu recuperación.
            </p>
            <p className="text-xs sm:text-sm text-brand-soft/80">
              Guía de recuperación en casa después de una reconstrucción del ligamento cruzado anterior (LCA).
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/ejercicios"
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-brand-teal px-6 py-3.5 text-base font-bold text-white shadow-sm hover:bg-brand-teal/90 transition-colors"
              >
                <span>Explorar mis ejercicios</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                to="/cuidados"
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-white/10 border border-brand-soft/35 px-6 py-3.5 text-base font-bold text-white hover:bg-white/20 transition-colors"
              >
                <span>Cuidados en casa</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white p-3 shadow-soft">
              <img
                src="/images/hero-rodilla.svg"
                alt="Ilustración educativa de la articulación de la rodilla mostrando movilidad gradual y controlada"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TARJETA INFORMATIVA DE SEGURIDAD CLÍNICA */}
      <SafetyNotice
        title="Información importante antes de comenzar"
        message="Cada recuperación es diferente. Esta guía es educativa y no reemplaza las indicaciones de tu traumatólogo y kinesiólogo. Realizá solamente los ejercicios que te hayan autorizado."
        variant="info"
      />

      {/* 3. BLOQUE: ¿QUÉ QUERÉS CONSULTAR HOY? (6 TARJETAS PRINCIPALES) */}
      <section aria-labelledby="heading-consultar-hoy">
        <div className="mb-5">
          <h2 id="heading-consultar-hoy" className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
            ¿Qué querés consultar hoy?
          </h2>
          <p className="mt-1 text-sm sm:text-base text-brand-muted">
            Elegí un apartado para acceder rápidamente a la información clara y ordenada.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MAIN_CONSULTATION_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.to}
                to={card.to}
                className={`group flex flex-col justify-between rounded-card border p-5 sm:p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg ${
                  card.isDanger
                    ? 'bg-rose-50/70 border-brand-danger/30 hover:border-brand-danger'
                    : 'bg-white border-slate-200/85 hover:border-brand-teal/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.accent}`}>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <ArrowRight
                      className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                        card.isDanger ? 'text-brand-danger' : 'text-brand-teal'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3
                    className={`text-lg font-extrabold ${
                      card.isDanger ? 'text-brand-danger' : 'text-brand-navy'
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-brand-muted leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. SEGUNDA SECCIÓN: OBJETIVOS DE ESTA ETAPA */}
      <section
        aria-labelledby="heading-objetivos-etapa"
        className="rounded-card-lg bg-white border border-slate-200/85 p-6 sm:p-8 shadow-soft"
      >
        <div className="mb-6">
          <span className="inline-block mb-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-navy">
            Posoperatorio temprano
          </span>
          <h2 id="heading-objetivos-etapa" className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
            Objetivos de esta etapa
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAGE_GOALS.map((goal) => {
            const Icon = goal.icon;
            return (
              <div
                key={goal.title}
                className="rounded-2xl bg-brand-bg border border-slate-200/75 p-4 sm:p-5 flex flex-col"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-navy">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-extrabold text-brand-navy">{goal.title}</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-brand-muted leading-relaxed">
                  {goal.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bloque explicativo destacado */}
        <div className="mt-6 rounded-2xl bg-brand-soft/65 border border-brand-teal/35 p-4 sm:p-5">
          <p className="text-sm sm:text-base font-bold text-brand-navy leading-relaxed">
            &ldquo;Lo importante no es doblar la rodilla a la fuerza. El objetivo es mejorar el movimiento de forma gradual y segura&rdquo;.
          </p>
        </div>
      </section>

      {/* 5. ACCESOS COMPLEMENTARIOS DESDE EL INICIO (Cirugía HTH, Seguimiento voluntario y Fuentes) */}
      <section aria-labelledby="heading-mas-recursos">
        <h2 id="heading-mas-recursos" className="text-xl sm:text-2xl font-extrabold text-brand-navy mb-4">
          Más herramientas para tu recuperación
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            to="/mi-cirugia"
            className="flex items-start gap-4 rounded-card bg-white border border-slate-200/85 p-5 shadow-soft hover:border-brand-teal/50 transition-all"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-navy">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-extrabold text-brand-navy">Conocé tu cirugía (HTH)</h3>
              <p className="mt-1 text-xs sm:text-sm text-brand-muted leading-relaxed">
                Explicación sencilla de qué es el autoinjerto hueso–tendón–hueso rotuliano.
              </p>
            </div>
          </Link>

          <Link
            to="/seguimiento"
            className="flex items-start gap-4 rounded-card bg-white border border-slate-200/85 p-5 shadow-soft hover:border-brand-teal/50 transition-all"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-navy">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-extrabold text-brand-navy">Mi seguimiento voluntario</h3>
              <p className="mt-1 text-xs sm:text-sm text-brand-muted leading-relaxed">
                Anotá en tu dispositivo cómo sentís la rodilla para conversarlo en la consulta.
              </p>
            </div>
          </Link>

          <Link
            to="/fuentes"
            className="flex items-start gap-4 rounded-card bg-white border border-slate-200/85 p-5 shadow-soft hover:border-brand-teal/50 transition-all"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-navy">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-extrabold text-brand-navy">Fuentes y respaldo científico</h3>
              <p className="mt-1 text-xs sm:text-sm text-brand-muted leading-relaxed">
                Bibliografía clínica verificada y alcance académico de esta guía.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};
