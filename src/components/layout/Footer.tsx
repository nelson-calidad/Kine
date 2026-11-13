import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-white/10 bg-void pb-24 lg:pb-8 pt-6 text-ash-gray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-center sm:text-left">
          <p className="font-medium text-silver-mist">
            Tu rodilla, paso a paso · Nicolás Notario (Kinesiología)
          </p>
          <p className="text-[11px] font-light text-ash-gray">
            Rehabilitación posoperatoria LCA (Injerto HTH)
          </p>
        </div>

        <Link
          to="/alertas"
          className="no-print inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/35 px-3.5 py-1.5 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/25 transition-colors"
        >
          <ShieldAlert className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
          <span>Señales de alarma</span>
        </Link>
      </div>
    </footer>
  );
};
