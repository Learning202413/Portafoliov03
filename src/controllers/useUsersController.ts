import { useState, useEffect, useCallback } from 'react';
import { userModel } from '../models/userModel';
import type { AdminUser } from '../models/types';

export function useUsersController() {
  const [users, setUsers]     = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userModel.getAll();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const addUser = async (email: string, password: string) => {
    try {
      await userModel.create(email, password);
      await fetchUsers(); // recargar para obtener el id real
    } catch (err: any) { setError(err.message); }
  };

  const deleteUser = async (userId: string) => {
    try {
      await userModel.delete(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err: any) { setError(err.message); }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      await userModel.updatePassword(newPassword);
    } catch (err: any) { setError(err.message); }
  };


return { users, loading, error, addUser, deleteUser, resetPassword, refetch: fetchUsers };

  return { users, loading, error, addUser, deleteUser, resetPassword, refetch: fetchUsers };
}