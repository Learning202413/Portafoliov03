import { useState } from 'react';
import { UserCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface Props {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPw]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await onLogin(email, password);
    if (!ok) setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    setLoading(false);
  };

  return (
    <div className="animate-fade-in w-full max-w-md mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 sm:p-10 shadow-2xl overflow-hidden w-full">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-500" />

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex bg-slate-950 border border-slate-800 p-4 sm:p-5 rounded-2xl mb-6 shadow-inner">
            <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-3 tracking-tight">
            Bienvenido
          </h2>
          <p className="text-slate-400 text-sm sm:text-base px-2">
            Ingresa tus credenciales para administrar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl text-center font-medium animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 text-left">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-base bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-slate-50 transition-all placeholder:text-slate-600 shadow-inner"
                  placeholder="admin@universidad.edu"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 text-left">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 text-base bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-slate-50 transition-all placeholder:text-slate-600 shadow-inner"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold py-4 text-base sm:text-lg rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] mt-8 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'INICIAR SESIÓN'}
          </button>
        </form>
      </div>
    </div>
  );
}