import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { PageType } from '../models/types';

export function useAuthController(setPage: (p: PageType) => void) {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Recuperar sesión persistida
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminEmail(session?.user?.email ?? null);
      if (session) setPage('admin_semanas');
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAdminEmail(session?.user?.email ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return false;
    setPage('admin_semanas');
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdminEmail(null);
    setPage('inicio');
  };

  return { adminEmail, authLoading, login, logout };
}