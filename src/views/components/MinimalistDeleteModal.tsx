import { Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: 'clase' | 'usuario';
}

export default function MinimalistDeleteModal({
  isOpen, onClose, onConfirm, itemName, itemType
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-pop-in">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 to-rose-500" />
        <div className="p-8 sm:p-10 text-center relative z-10">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-[24px] flex items-center justify-center mx-auto mb-6 border border-red-500/20 rotate-3 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <Trash2 className="w-10 h-10 -rotate-3" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-50 mb-3 tracking-tight">
            Eliminar {itemType}
          </h3>
          <p className="text-slate-400 mb-8 text-sm sm:text-base leading-relaxed">
            Estás a punto de eliminar permanentemente <br />
            <span className="font-bold text-slate-200 px-1">"{itemName}"</span>.<br />
            Esta acción no se puede deshacer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3.5 rounded-xl font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-5 py-3.5 rounded-xl font-bold text-slate-950 bg-red-500 hover:bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}