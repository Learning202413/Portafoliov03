import { supabase } from '../lib/supabaseClient';
import type { AdminUser } from './types';

export const userModel = {

  /** Lista usuarios desde la tabla de perfiles */
  async getAll(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, created_at');
    if (error) throw error;
    return data.map(u => ({
      id:        u.id,
      email:     u.email,
      role:      u.role,
      createdAt: new Date(u.created_at).getTime(),
    }));
  },
  /**
   * Registra un nuevo administrador.
   * Nota: en producción se recomienda un Edge Function con el
   * service_role key para no exponer signUp sin captcha.
   */
  async create(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  },

  /** Elimina el perfil (el trigger de cascade elimina auth.users) */
  async delete(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    if (error) throw error;
  },

  /**
   * Cambia la contraseña del usuario autenticado.
   * Para cambiar la de otro usuario se necesita service_role (Edge Function).
   */
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },
};