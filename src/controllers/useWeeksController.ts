import { useState, useEffect, useCallback } from 'react';
import { weekModel } from '../models/weekModel';
import type { WeekData } from '../models/types';

// Extiende WeekData para incluir el archivo PDF opcional en operaciones de escritura
export type WeekInput = Omit<WeekData, 'id' | 'createdAt'> & { pdfFile?: File };
export type WeekUpdate = WeekData & { pdfFile?: File };

export function useWeeksController() {
  const [weeks, setWeeks]     = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchWeeks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weekModel.getAll();
      setWeeks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWeeks(); }, [fetchWeeks]);

  const addWeek = async (input: WeekInput) => {
    try {
      let { pdfUrl, pdfSize } = input;
      if (input.pdfFile) {
        const uploaded = await weekModel.uploadPdf(input.pdfFile);
        pdfUrl  = uploaded.url;
        pdfSize = uploaded.size;
      }
      const created = await weekModel.create({ ...input, pdfUrl, pdfSize });
      setWeeks(prev => [...prev, created]);
    } catch (err: any) { setError(err.message); }
  };

  const updateWeek = async (input: WeekUpdate) => {
    try {
      let { pdfUrl, pdfSize } = input;
      if (input.pdfFile) {
        const uploaded = await weekModel.uploadPdf(input.pdfFile);
        pdfUrl  = uploaded.url;
        pdfSize = uploaded.size;
      }
      await weekModel.update(input.id, { ...input, pdfUrl, pdfSize });
      setWeeks(prev =>
        prev.map(w => w.id === input.id ? { ...input, pdfUrl, pdfSize } : w)
      );
    } catch (err: any) { setError(err.message); }
  };

  const deleteWeek = async (id: string) => {
    try {
      await weekModel.delete(id);
      setWeeks(prev => prev.filter(w => w.id !== id));
    } catch (err: any) { setError(err.message); }
  };

  return { weeks, loading, error, addWeek, updateWeek, deleteWeek, refetch: fetchWeeks };
}