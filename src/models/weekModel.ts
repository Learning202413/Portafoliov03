import { supabase } from '../lib/supabaseClient';
import type { WeekData } from './types';

// Mapea la fila de Supabase → WeekData (camelCase)
const toWeekData = (row: any): WeekData => ({
  id:          row.id,
  subtitle:    row.subtitle ?? undefined,
  title:       row.title,
  description: row.description,
  topics:      row.topics ?? [],
  pdfUrl:      row.pdf_url,
  pdfSize:     row.pdf_size,
  createdAt:   new Date(row.created_at).getTime(),
});

export const weekModel = {

  async getAll(): Promise<WeekData[]> {
    const { data, error } = await supabase
      .from('weeks')
      .select('*')
      .order('subtitle', { ascending: true });
    if (error) throw error;
    return data.map(toWeekData);
  },

  async create(week: Omit<WeekData, 'id' | 'createdAt'>): Promise<WeekData> {
    const { data, error } = await supabase
      .from('weeks')
      .insert({
        subtitle:    week.subtitle,
        title:       week.title,
        description: week.description,
        topics:      week.topics,
        pdf_url:     week.pdfUrl,
        pdf_size:    week.pdfSize,
      })
      .select()
      .single();
    if (error) throw error;
    return toWeekData(data);
  },

  async update(id: string, week: Partial<WeekData>): Promise<void> {
    const { error } = await supabase
      .from('weeks')
      .update({
        subtitle:    week.subtitle,
        title:       week.title,
        description: week.description,
        topics:      week.topics,
        pdf_url:     week.pdfUrl,
        pdf_size:    week.pdfSize,
      })
      .eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('weeks')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  /** Sube un PDF al bucket y devuelve la URL pública + tamaño */
  async uploadPdf(file: File): Promise<{ url: string; size: string }> {
    const path = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(path, file, { upsert: false });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('pdfs').getPublicUrl(path);
    return {
      url:  data.publicUrl,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    };
  },
};