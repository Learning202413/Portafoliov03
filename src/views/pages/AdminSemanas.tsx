import { useState } from 'react';
import {
  Plus, Search, Edit, Trash2, FileText,
  Save, X, Link, Globe, Database, LayoutTemplate
} from 'lucide-react';
import type { WeekData } from '../../models/types';
import type { WeekInput, WeekUpdate } from '../../controllers/useWeeksController';
import MinimalistDeleteModal from '../components/MinimalistDeleteModal';

interface Props {
  weeks: WeekData[];
  loading: boolean;
  onAddWeek:    (w: WeekInput)  => Promise<void>;
  onUpdateWeek: (w: WeekUpdate) => Promise<void>;
  onDeleteWeek: (id: string)    => Promise<void>;
}

const emptyForm = { subtitle: '', title: '', description: '', topics: [''] };

export default function AdminSemanas({ weeks, loading, onAddWeek, onUpdateWeek, onDeleteWeek }: Props) {
  const [isFormOpen, setIsFormOpen]     = useState(false);
  const [formData, setFormData]         = useState(emptyForm);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'local' | 'url'>('local');
  const [pdfUrlInput, setPdfUrlInput]   = useState('');
  const [pdfFile, setPdfFile]           = useState<File | null>(null);
  const [existingPdf, setExistingPdf]   = useState<{ url: string; size: string } | null>(null);
  const [searchTerm, setSearchTerm]     = useState('');
  const [saving, setSaving]             = useState(false);
  const [deleteModal, setDeleteModal]   = useState({ isOpen: false, id: '', name: '' });

  /* ── helpers ── */
  const addTopic    = () => setFormData(f => ({ ...f, topics: [...f.topics, ''] }));
  const updateTopic = (i: number, v: string) => setFormData(f => {
    const t = [...f.topics]; t[i] = v; return { ...f, topics: t };
  });
  const removeTopic = (i: number) => setFormData(f => ({
    ...f, topics: f.topics.filter((_, idx) => idx !== i)
  }));

  const resetForm = () => {
    setFormData(emptyForm);
    setPdfUrlInput(''); setPdfFile(null); setExistingPdf(null);
    setUploadMethod('local'); setEditingId(null); setIsFormOpen(false);
  };

  const handleEdit = (w: WeekData) => {
    setFormData({
      subtitle:    w.subtitle ?? '',
      title:       w.title,
      description: w.description,
      topics:      w.topics.length ? w.topics : [''],
    });
    setPdfUrlInput(w.pdfUrl);
    setExistingPdf({ url: w.pdfUrl, size: w.pdfSize });
    setUploadMethod('local');
    setEditingId(w.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const base = {
      subtitle:    formData.subtitle,
      title:       formData.title,
      description: formData.description,
      topics:      formData.topics.filter(t => t.trim()),
      pdfUrl:      uploadMethod === 'url' ? pdfUrlInput : (existingPdf?.url ?? ''),
      pdfSize:     uploadMethod === 'url' ? 'URL Externa' : (existingPdf?.size ?? ''),
      pdfFile:     uploadMethod === 'local' && pdfFile ? pdfFile : undefined,
    };

    if (editingId) {
      const original = weeks.find(w => w.id === editingId)!;
      await onUpdateWeek({ ...base, id: editingId, createdAt: original.createdAt });
    } else {
      await onAddWeek(base);
    }

    setSaving(false);
    resetForm();
  };

  const confirmDelete = async () => {
    if (deleteModal.id) await onDeleteWeek(deleteModal.id);
    setDeleteModal({ isOpen: false, id: '', name: '' });
  };

  const filtered = [...weeks]
    .sort((a, b) => (a.subtitle ?? '').localeCompare(b.subtitle ?? '', undefined, { numeric: true }))
    .filter(w =>
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.subtitle ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-2">
          Semanas de clase
        </h1>
        <p className="text-slate-400 text-base md:text-lg">
          Publica y administra las semanas de clase.
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-[300px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text" placeholder="Filtrar registros..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md pl-10 pr-4 py-2.5 text-sm text-slate-300 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full sm:w-auto bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-md text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} /> Nuevo Registro
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="bg-slate-900 border-b border-slate-800">
              <tr>
                {['N° de semana', 'Título', 'Archivo', 'Fecha', ''].map(h => (
                  <th key={h} className={`px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest ${!h ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500 italic">Sin registros.</td></tr>
              ) : filtered.map(w => (
                <tr key={w.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-5 font-medium text-emerald-500">{w.subtitle ?? '-'}</td>
                  <td className="px-6 py-5 font-bold text-slate-50">{w.title}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 border border-slate-700 bg-slate-900/50 px-2.5 py-1.5 rounded w-fit text-slate-300 text-sm">
                      <FileText className="w-4 h-4 text-emerald-500" /> {w.pdfSize}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-500">
                    {new Date(w.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEdit(w)} className="text-slate-500 hover:text-emerald-400 transition-colors" title="Editar">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, id: w.id, name: `${w.subtitle ? w.subtitle + ' - ' : ''}${w.title}` })}
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
          <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-pop-in flex flex-col max-h-[90vh]">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 z-20" />

            <div className="flex items-center justify-between p-6 sm:px-10 sm:pt-10 sm:pb-6 border-b border-slate-800/50 sticky top-0 z-10 bg-slate-950 shrink-0">
              <h2 className="text-2xl font-extrabold text-white">
                {editingId ? 'Editar Clase' : 'Nueva Clase'}
              </h2>
              <button type="button" onClick={resetForm} className="text-slate-500 hover:text-slate-300 p-2 rounded-xl hover:bg-slate-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Info general */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4" /> Información General
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="text" placeholder="Semana"
                      value={formData.subtitle}
                      onChange={e => setFormData(f => ({ ...f, subtitle: e.target.value }))}
                      required
                      className="w-1/3 bg-transparent border-b-2 border-slate-800 py-3 text-emerald-500 font-mono font-bold placeholder:text-slate-700 focus:border-emerald-500 outline-none transition-colors"
                    />
                    <input
                      type="text" placeholder="Título de la clase"
                      value={formData.title}
                      onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                      required
                      className="w-2/3 bg-transparent border-b-2 border-slate-800 py-3 text-slate-100 font-medium placeholder:text-slate-700 focus:border-emerald-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Temas */}
                  <div className="space-y-3">
                    <label className="text-sm text-slate-400 font-medium flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-500" /> Temas
                    </label>
                    {formData.topics.map((t, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <input
                          type="text" value={t}
                          onChange={e => updateTopic(i, e.target.value)}
                          placeholder={`Tema ${i + 1}`}
                          className="flex-1 bg-transparent border-b-2 border-slate-800 py-2 text-slate-300 text-sm placeholder:text-slate-700 focus:border-emerald-500 outline-none transition-colors"
                        />
                        {formData.topics.length > 1 && (
                          <button type="button" onClick={() => removeTopic(i)} className="text-slate-600 hover:text-red-400 p-1 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addTopic} className="flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 mt-2">
                      <Plus className="w-3 h-3" /> Añadir tema
                    </button>
                  </div>

                  <textarea
                    placeholder="Resumen de la clase..."
                    value={formData.description}
                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                    required
                    className="w-full bg-transparent border-b-2 border-slate-800 py-3 text-slate-300 text-sm h-20 resize-none placeholder:text-slate-700 focus:border-emerald-500 outline-none transition-colors"
                  />
                </div>

                {/* PDF */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest">
                    Material de Estudio
                  </h3>

                  <div className="flex bg-slate-900 p-1 rounded-xl w-fit border border-slate-800">
                    {(['local', 'url'] as const).map(m => (
                      <button
                        key={m} type="button"
                        onClick={() => setUploadMethod(m)}
                        className={`px-6 py-2 text-xs font-bold rounded-lg transition-colors ${uploadMethod === m ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        {m === 'local' ? 'Archivo Local' : 'Usar Enlace'}
                      </button>
                    ))}
                  </div>

                  {uploadMethod === 'local' ? (
                    <label className="mt-4 border-2 border-dashed border-slate-800 bg-slate-900/50 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 hover:bg-slate-900 transition-all w-full group">
                      <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-7 h-7" />
                      </div>
                      <p className="text-slate-300 font-medium text-lg mb-1">
                        {pdfFile ? pdfFile.name : 'Cargar documento PDF'}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {pdfFile
                          ? `${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB`
                          : 'Arrastra o haz clic para explorar'}
                      </p>
                      <input
                        type="file" accept="application/pdf"
                        className="hidden"
                        onChange={e => setPdfFile(e.target.files?.[0] ?? null)}
                        required={!existingPdf}
                      />
                    </label>
                  ) : (
                    <div className="mt-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-8 flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-6">
                        <Link className="w-7 h-7 text-emerald-500" />
                      </div>
                      <div className="w-full max-w-md relative flex items-center">
                        <Globe className="absolute left-4 text-slate-500 w-5 h-5" />
                        <input
                          type="url" value={pdfUrlInput}
                          onChange={e => setPdfUrlInput(e.target.value)}
                          placeholder="https://drive.google.com/file/d/..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                          required={!existingPdf}
                        />
                      </div>
                    </div>
                  )}

                  {editingId && existingPdf && !pdfFile && uploadMethod === 'local' && (
                    <p className="text-xs text-center text-slate-400 mt-2">
                      Manteniendo archivo actual: {existingPdf.size}
                    </p>
                  )}
                </div>

                <div className="pt-8">
                  <button
                    type="submit" disabled={saving}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 py-4 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <MinimalistDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
        onConfirm={confirmDelete}
        itemName={deleteModal.name}
        itemType="clase"
      />
    </div>
  );
}