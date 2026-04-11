import { useState } from 'react';
import { useAuthController }  from './controllers/useAuthController';
import { useWeeksController } from './controllers/useWeeksController';
import { useUsersController } from './controllers/useUsersController';
import type { PageType } from './models/types';

// Vistas
import Navbar           from './views/components/Navbar';
import Inicio           from './views/pages/Inicio';
import Semanas          from './views/pages/Semanas';
import SobreMi          from './views/pages/SobreMi';
import Login            from './views/pages/Login';
import AdminSemanas     from './views/pages/AdminSemanas';
import AdminUsuarios    from './views/pages/AdminUsuarios';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('inicio');

  // Controllers
  const auth  = useAuthController(setCurrentPage);
  const weeks = useWeeksController();
  const users = useUsersController();

  const renderPage = () => {
    if (auth.authLoading) return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        Cargando...
      </div>
    );

    if (auth.adminEmail) {
      switch (currentPage) {
        case 'admin_semanas':
          return (
            <AdminSemanas
              weeks={weeks.weeks}
              loading={weeks.loading}
              onAddWeek={weeks.addWeek}
              onUpdateWeek={weeks.updateWeek}
              onDeleteWeek={weeks.deleteWeek}
            />
          );
        case 'admin_usuarios':
          return (
            <AdminUsuarios
              users={users.users}
              loading={users.loading}
              onAddUser={users.addUser}
              onDeleteUser={users.deleteUser}
              onResetPassword={users.resetPassword}
            />
          );
        default:
          return <AdminSemanas weeks={weeks.weeks} loading={weeks.loading}
                   onAddWeek={weeks.addWeek} onUpdateWeek={weeks.updateWeek}
                   onDeleteWeek={weeks.deleteWeek} />;
      }
    }

    switch (currentPage) {
      case 'semanas':   return <Semanas weeks={weeks.weeks} loading={weeks.loading} />;
      case 'sobre_mi':  return <SobreMi />;
      case 'login':     return <Login onLogin={auth.login} />;
      default:          return <Inicio setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="overflow-x-hidden min-h-screen w-full bg-slate-950 font-sans text-slate-400 flex flex-col">
      <Navbar
        currentPage={currentPage}
        setPage={setCurrentPage}
        adminEmail={auth.adminEmail}
        onLogout={auth.logout}
      />
      <main className="flex-1 w-full flex flex-col relative">
        {renderPage()}
      </main>
    </div>
  );
}