import { User } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function SobreMi() {
  return (
    <div className="animate-fade-in w-full max-w-lg mx-auto px-4 flex-1 flex flex-col justify-center py-12">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 md:p-12 text-center shadow-2xl flex flex-col items-center">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center mb-8 relative group overflow-hidden shadow-inner flex-shrink-0">
          <div className="absolute inset-0 bg-emerald-500/10 blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />
          <User className="w-16 h-16 md:w-20 md:h-20 text-slate-400 relative z-10 group-hover:text-emerald-400 transition-colors duration-300" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-3">
          Jazztin William Chuqui Contreras
        </h2>
        <p className="text-emerald-400 font-mono text-sm md:text-base mb-8 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
          Estudiante
        </p>
        <p className="text-base md:text-lg text-slate-400 mb-10 leading-relaxed">
          Cantera Reiver's
        </p>
        <div className="flex justify-center gap-5 w-full pt-8 border-t border-emerald-400">
          <a href="https://github.com/Learning202413" target="_blank" className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:-translate-y-1 transition-all shadow-sm">
            <GithubIcon className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/in/jazztin-chuqui-65803732a/" target="_blank" className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:-translate-y-1 transition-all shadow-sm">
            <LinkedinIcon className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
}