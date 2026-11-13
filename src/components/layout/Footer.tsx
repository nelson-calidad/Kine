import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, BookOpen, Stethoscope } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-void pb-24 lg:pb-12 pt-12 text-silver-mist">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <h2 className="font-normal text-bone-white tracking-[-0.03em] text-base mb-2.5">
              Tu rodilla, paso a paso
            </h2>
            <p className="text-ash-gray text-xs font-light leading-relaxed">
              Guía interactiva 3D de recuperación en casa después de una reconstrucción del ligamento cruzado anterior (LCA). Aplicación estática sin recolección de datos personales.
            </p>
          </div>

          <div className="no-print">
            <h2 className="dala-label text-saffron-spark mb-3">Secciones principales</h2>
            <ul className="space-y-2 text-xs text-ash-gray">
              <li>
                <Link to="/ejercicios" className="hover:text-bone-white transition-colors">
                  Carrusel 3D de ejercicios
                </Link>
              </li>
              <li>
                <Link to="/cuidados" className="hover:text-bone-white transition-colors">
                  Cuidados domiciliarios
                </Link>
              </li>
              <li>
                <Link to="/que-evitar" className="hover:text-bone-white transition-colors">
                  Qué evitar en casa (Los NO)
                </Link>
              </li>
              <li>
                <Link to="/actividades" className="hover:text-bone-white transition-colors">
                  Actividades de la vida diaria
                </Link>
              </li>
            </ul>
          </div>

          <div className="no-print">
            <h2 className="dala-label text-saffron-spark mb-3">Información y registro</h2>
            <ul className="space-y-2 text-xs text-ash-gray">
              <li>
                <Link to="/mi-cirugia" className="inline-flex items-center gap-1.5 hover:text-bone-white transition-colors">
                  <Stethoscope className="h-3.5 w-3.5 text-electric-iris" aria-hidden="true" />
                  Conocé tu cirugía (Injerto HTH)
                </Link>
              </li>
              <li>
                <Link to="/seguimiento" className="hover:text-bone-white transition-colors">
                  Mi seguimiento voluntario
                </Link>
              </li>
              <li>
                <Link to="/preguntas" className="hover:text-bone-white transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link to="/fuentes" className="inline-flex items-center gap-1.5 hover:text-bone-white transition-colors">
                  <BookOpen className="h-3.5 w-3.5 text-electric-iris" aria-hidden="true" />
                  Fuentes y respaldo científico
                </Link>
              </li>
            </ul>
          </div>

          <div className="no-print">
            <h2 className="dala-label text-rose-400 mb-3">Atención prioritaria</h2>
            <p className="text-xs font-light text-ash-gray mb-3.5 leading-relaxed">
              Ante síntomas intensos, fiebre o signos de alarma, suspendé los ejercicios y consultá de inmediato.
            </p>
            <Link
              to="/alertas"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-rose-500/20 border border-rose-500/40 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 transition-colors"
            >
              <ShieldAlert className="h-4 w-4 text-rose-400" aria-hidden="true" />
              Ver señales de alarma
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ash-gray">
          <p className="font-medium text-silver-mist">
            Desarrollado por Nicolás Notario · Estudiante de Kinesiología
          </p>
          <p className="font-light">
            Kinefisiatría Traumatológica y Reumatológica · Reconstrucción de LCA (Injerto HTH)
          </p>
        </div>
      </div>
    </footer>
  );
};
