import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-[#244154] bg-[#061522] pb-24 lg:pb-8 pt-6 text-[#A7B9C6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-center sm:text-left">
          <p className="font-semibold text-[#F1F7FA]">
            Tu rodilla, paso a paso · Nicolás Notario (Estudiante de Kinesiología)
          </p>
          <p className="text-[11px] text-[#A7B9C6]">
            Kinefisiatría Traumatológica y Reumatológica · Reconstrucción de LCA (Injerto HTH)
          </p>
        </div>

        <Link
          to="/alertas"
          className="no-print inline-flex items-center gap-1.5 rounded-lg bg-rose-500/12 border border-rose-400/35 px-3.5 py-1.5 text-[11px] font-semibold text-rose-200 hover:bg-rose-500/20 transition-colors"
        >
          <ShieldAlert className="h-3.5 w-3.5 text-rose-300" aria-hidden="true" />
          <span>Señales de alarma</span>
        </Link>
      </div>
    </footer>
  );
};
