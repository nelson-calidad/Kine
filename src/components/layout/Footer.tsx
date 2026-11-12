import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, BookOpen, Stethoscope } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white pb-24 lg:pb-12 pt-10 text-brand-text">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <h2 className="font-bold text-brand-navy mb-2.5">Tu rodilla, paso a paso</h2>
            <p className="text-brand-muted text-xs leading-relaxed">
              Guía de recuperación en casa después de una reconstrucción del ligamento cruzado anterior (LCA). Aplicación estática sin recolección de datos personales.
            </p>
          </div>

          <div className="no-print">
            <h2 className="font-bold text-brand-navy mb-2.5">Secciones principales</h2>
            <ul className="space-y-2 text-brand-muted">
              <li>
                <Link to="/ejercicios" className="hover:text-brand-navy underline-offset-2 hover:underline">
                  Biblioteca de ejercicios
                </Link>
              </li>
              <li>
                <Link to="/cuidados" className="hover:text-brand-navy underline-offset-2 hover:underline">
                  Cuidados domiciliarios
                </Link>
              </li>
              <li>
                <Link to="/que-evitar" className="hover:text-brand-navy underline-offset-2 hover:underline">
                  Qué evitar en casa (Los NO)
                </Link>
              </li>
              <li>
                <Link to="/actividades" className="hover:text-brand-navy underline-offset-2 hover:underline">
                  Actividades de la vida diaria
                </Link>
              </li>
            </ul>
          </div>

          <div className="no-print">
            <h2 className="font-bold text-brand-navy mb-2.5">Información y registro</h2>
            <ul className="space-y-2 text-brand-muted">
              <li>
                <Link to="/mi-cirugia" className="inline-flex items-center gap-1.5 hover:text-brand-navy underline-offset-2 hover:underline">
                  <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
                  Conocé tu cirugía (Injerto HTH)
                </Link>
              </li>
              <li>
                <Link to="/seguimiento" className="hover:text-brand-navy underline-offset-2 hover:underline">
                  Mi seguimiento voluntario
                </Link>
              </li>
              <li>
                <Link to="/preguntas" className="hover:text-brand-navy underline-offset-2 hover:underline">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link to="/fuentes" className="inline-flex items-center gap-1.5 hover:text-brand-navy underline-offset-2 hover:underline">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  Fuentes y respaldo científico
                </Link>
              </li>
            </ul>
          </div>

          <div className="no-print">
            <h2 className="font-bold text-brand-danger mb-2.5">Atención prioritaria</h2>
            <p className="text-xs text-brand-muted mb-3 leading-relaxed">
              Ante síntomas intensos, fiebre o signos de alarma, suspendé los ejercicios y consultá de inmediato.
            </p>
            <Link
              to="/alertas"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand-danger px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-danger/90 transition-colors"
            >
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              Ver señales de alarma
            </Link>
          </div>
        </div>

        {/* Crédito de autoría discreto */}
        <div className="mt-10 pt-6 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-muted">
          <p className="font-medium text-brand-navy/85">
            Desarrollado por Nicolás Notario · Estudiante de Kinesiología
          </p>
          <p>
            Kinefisiatría Traumatológica y Reumatológica · Reconstrucción de LCA (Injerto HTH)
          </p>
        </div>
      </div>
    </footer>
  );
};
