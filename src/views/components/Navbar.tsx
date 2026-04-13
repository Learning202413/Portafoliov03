import { useState } from 'react';
import {
  Home, BookOpen, User, Menu, X, Users,
  UserCircle, LogOut,
} from 'lucide-react';
import type { PageType } from '../../models/types';
import UserMenuDropdown from './UserMenuDropdown';

interface Props {
  currentPage: PageType;
  setPage: (p: PageType) => void;
  adminEmail: string | null;
  onLogout: () => void;
}

export default function Navbar({ currentPage, setPage, adminEmail, onLogout }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const publicNav = [
    { id: 'inicio',    label: 'Inicio',           icon: <Home    className="w-4 h-4" /> },
    { id: 'semanas',   label: 'Semanas de Clase',  icon: <BookOpen className="w-4 h-4" /> },
    { id: 'sobre_mi',  label: 'Sobre Mí',          icon: <User    className="w-4 h-4" /> },
  ] as const;

  const adminNav = [
    { id: 'admin_semanas',   label: 'Semanas', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'admin_usuarios',  label: 'Usuarios',          icon: <Users   className="w-4 h-4" /> },
  ] as const;

  const navItems = adminEmail ? adminNav : publicNav;

  const go = (page: PageType) => { setPage(page); setMobileOpen(false); };

  return (
    <header className="w-full h-16 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex-shrink-0">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-7xl mx-auto w-full">

        {/* Logo */}
        <div
          className="flex items-center cursor-pointer group flex-shrink-0"
          onClick={() => go(adminEmail ? 'admin_semanas' : 'inicio')}
        >
          <div className="h-9 sm:h-10 w-28 sm:w-32 rounded-lg flex items-center justify-center font-mono text-xs">
            <img
              src="../../src/assets/upla.png"
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id as PageType)}
              className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${currentPage === item.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner'
                  : 'text-slate-400 hover:text-slate-50 hover:bg-slate-900 border border-transparent'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}

          <div className="w-px h-6 bg-slate-800 mx-2" />

          {adminEmail
            ? <UserMenuDropdown email={adminEmail} onLogout={onLogout} />
            : (
              <button
                onClick={() => go('login')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
                  ${currentPage === 'login'
                    ? 'bg-emerald-500 text-slate-950 border border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-emerald-400'}`}
              >
                <UserCircle className="w-4 h-4" /> Iniciar Sesión
              </button>
            )
          }
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-50 p-2 border border-transparent hover:border-slate-800 rounded-lg ml-auto"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden p-4 space-y-2 border-b bg-slate-950 border-slate-800 shadow-xl absolute top-full left-0 w-full z-[100]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id as PageType)}
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                ${currentPage === item.id ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-900'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}

          <div className="h-px w-full bg-slate-800 my-2" />

          {adminEmail ? (
            <div className="px-2">
              <div className="px-2 py-3 mb-2 bg-slate-900 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">Sesión iniciada como</p>
                <p className="text-sm font-bold text-slate-200 truncate">{adminEmail}</p>
              </div>
              <button
                onClick={() => { onLogout(); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </button>
            </div>
          ) : (
            <button
              onClick={() => go('login')}
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors
                ${currentPage === 'login'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 text-emerald-400 hover:bg-slate-800 border border-slate-800'}`}
            >
              <UserCircle className="w-5 h-5" /> Iniciar Sesión
            </button>
          )}
        </div>
      )}
    </header>
  );
}