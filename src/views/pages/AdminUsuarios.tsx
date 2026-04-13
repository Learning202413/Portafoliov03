import { useState } from 'react';
import {
  Plus, Search, Edit, Trash2, Shield,
  Mail, Lock, X, UserPlus, Key , AlertCircle
} from 'lucide-react';
import type { AdminUser } from '../../models/types';
import MinimalistDeleteModal from '../components/MinimalistDeleteModal';

interface Props {
  users: AdminUser[];
  loading: boolean;
  onAddUser:       (email: string, password: string) => Promise<void>;
  onDeleteUser:    (userId: string) => Promise<void>;
  onResetPassword: (newPassword: string) => Promise<void>;

}

export default function AdminUsuarios({ users, loading, onAddUser, onDeleteUser, onResetPassword }: Props) {
  const [isFormOpen, setIsFormOpen]   = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newEmail, setNewEmail]       = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving]           = useState(false);
  const [searchTerm, setSearchTerm]   = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '', email: '' });
  const [showError, setShowError] = useState(false);

  const resetForm = () => {
    setNewEmail(''); setNewPassword('');
    setEditingUser(null); setIsFormOpen(false);
    setShowError(false);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setNewEmail(user.email);
    setNewPassword('');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
        setShowError(true);
        return;
      }
    if (!newPassword.trim()) return;
    setSaving(true);
    if (editingUser) {
      await onResetPassword(newPassword);
    } else {
      await onAddUser(newEmail, newPassword);
    }
    setSaving(false);
    resetForm();
  };

  const confirmDelete = async () => {
    if (deleteModal.id) await onDeleteUser(deleteModal.id);
    setDeleteModal({ isOpen: false, id: '', email: '' });
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-2">
          Gestion de Usuarios
        </h1>
        <p className="text-slate-400 text-base md:text-lg">
          Controla los accesos, roles y permisos de los administradores.
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-[300px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text" placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md pl-10 pr-4 py-2.5 text-sm text-slate-300 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full sm:w-auto bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-md text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} /> Nuevo Usuario
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="border-b border-slate-800">
              <tr>
                {['Usuario', 'Rol', 'Fecha Registro', ''].map(h => (
                  <th key={h} className={`px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest ${!h ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500 italic">Sin usuarios.</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-emerald-500 border border-slate-800">
                        {u.email.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-bold text-slate-50">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Shield className="w-3 h-3" /> {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEdit(u)} className="text-slate-500 hover:text-emerald-400 transition-colors" title="Cambiar contraseña">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, id: u.id, email: u.email })}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal formulario */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-pop-in flex flex-col max-h-[90vh]">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 z-20" />

            <div className="flex items-center justify-between p-6 sm:px-10 sm:pt-10 sm:pb-6 border-b border-slate-800/50 sticky top-0 z-10 bg-slate-950 shrink-0">
              <h2 className="text-2xl font-extrabold text-white">
                {editingUser ? 'Modificar Usuario' : 'Registrar Usuario'}
              </h2>
              <button type="button" onClick={resetForm} className="text-slate-500 hover:text-slate-300 p-2 rounded-xl hover:bg-slate-800">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest">
                    {editingUser ? 'Cambiar Contraseña' : 'Credenciales de Acceso'}
                  </h3>

                  {/* Email */}
                  <div className="relative group">
                    <Mail className={`absolute left-0 top-3.5 w-5 h-5 transition-colors ${editingUser ? 'text-slate-600' : 'text-slate-500 group-focus-within:text-emerald-500'}`} />
                    <input
                      type="email" placeholder="Correo electrónico"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      required
                      disabled={!!editingUser}
                      className={`w-full bg-transparent border-b-2 py-3 pl-8 font-medium outline-none transition-colors ${editingUser ? 'border-slate-800/50 text-slate-500 cursor-not-allowed' : 'border-slate-800 text-slate-100 placeholder:text-slate-700 focus:border-emerald-500'}`}
                    />
                  </div>

                  {/* Password */}
                  <div className="relative group">
                    <Lock className="absolute left-0 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="password"
                      placeholder={editingUser ? 'Nueva contraseña' : 'Contraseña inicial'}
                      value={newPassword}
                      onChange={e => {
                        setNewPassword(e.target.value);
                        if (e.target.value.length >= 6) setShowError(false);
                      }}
                      required
                      className={`w-full bg-transparent border-b-2 py-3 pl-8 text-slate-100 font-medium placeholder:text-slate-700 outline-none transition-all ${
                        showError && newPassword.length < 6
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-slate-800 focus:border-emerald-500'
                      }`}
                    />{showError && newPassword.length < 6 && (
                        <div className="flex items-center gap-1.5 text-red-400 text-[11px] font-bold uppercase mt-2">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Mínimo 6 caracteres requeridos
                        </div>
                      )}
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="submit" disabled={saving}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 py-4 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {editingUser ? <Key className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    {saving ? 'Guardando...' : editingUser ? 'Actualizar Contraseña' : 'Registrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <MinimalistDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', email: '' })}
        onConfirm={confirmDelete}
        itemName={deleteModal.email}
        itemType="usuario"
      />
    </div>
  );
}