import { LayoutGrid, MonitorPlay, User } from 'lucide-react';
import type { PageType } from '../../models/types';

export default function Inicio({ setPage }: { setPage: (p: PageType) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-slate-900 border border-slate-800 p-5 md:p-8 rounded-full mb-8 md:mb-12 shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-transform duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(16,185,129,0.25)]">
        <LayoutGrid className="w-14 h-14 md:w-20 md:h-20 text-emerald-400" />
      </div>

      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-6 md:mb-8 text-slate-50 font-extrabold leading-tight px-4 w-full break-words">
        Semanas de clase
      </h1>

      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-3xl lg:max-w-5xl mb-10 md:mb-14 text-slate-400 px-6 w-full mx-auto leading-relaxed">
        Mi prototipo de portafolio del curso de Arquitectura de software
      </p>

      <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-6 sm:px-0 max-w-xs sm:max-w-none mx-auto justify-center">
        <button
          onClick={() => setPage('semanas')}
          className="w-full sm:w-auto bg-emerald-500 text-slate-950 px-10 py-4 font-extrabold border-2 border-emerald-500 shadow-[6px_6px_0px_0px_rgba(16,185,129,0.4)] hover:shadow-none hover:translate-y-[6px] hover:translate-x-[6px] transition-all duration-200 flex items-center justify-center gap-3 uppercase tracking-widest text-sm md:text-base rounded-lg sm:rounded-none"
        >
          <MonitorPlay className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" /> Ver Clases
        </button>
        <button
          onClick={() => setPage('sobre_mi')}
          className="w-full sm:w-auto bg-slate-900 text-emerald-500 px-10 py-4 font-extrabold border-2 border-emerald-500 shadow-[6px_6px_0px_0px_rgba(16,185,129,0.2)] hover:shadow-none hover:translate-y-[6px] hover:translate-x-[6px] transition-all duration-200 flex items-center justify-center gap-3 uppercase tracking-widest text-sm md:text-base rounded-lg sm:rounded-none"
        >
          <User className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" /> Conoceme
        </button>
      </div>
    </div>
  );
}