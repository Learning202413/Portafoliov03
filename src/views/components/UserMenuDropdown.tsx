import { useState, useEffect, useRef } from 'react';
import { LogOut } from 'lucide-react';

interface Props {
  email: string;
  onLogout: () => void;
}

export default function UserMenuDropdown({ email, onLogout }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-emerald-500/10 border-2 border-transparent hover:border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      >
        {email.charAt(0).toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in slide-down">
          <div className="p-6 flex flex-col items-center text-center bg-slate-800/30 border-b border-slate-800">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-3xl mb-3">
              {email.charAt(0).toUpperCase()}
            </div>
            <p className="text-base font-bold text-slate-100 truncate w-full px-2" title={email}>
              {email}
            </p>
            <p className="text-xs text-emerald-400 font-mono mt-1 bg-emerald-500/10 px-3 py-0.5 rounded-full">
              Administrador
            </p>
          </div>
          <div className="p-2 bg-slate-950/30">
            <button
              onClick={() => { onLogout(); setIsOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}