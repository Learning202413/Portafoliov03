import { useState } from 'react';
import {
  BookOpen, ChevronDown, LayoutTemplate, Database,
  FileText, Download, Eye
} from 'lucide-react';
import type { WeekData } from '../../models/types';

interface Props {
  weeks: WeekData[];
  loading: boolean;
}

export default function Semanas({ weeks, loading }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...weeks].sort((a, b) =>
    (a.subtitle ?? '').localeCompare(b.subtitle ?? '', undefined, {
      numeric: true, sensitivity: 'base'
    })
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-lg">
        Cargando semanas...
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-1.5 w-10 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-slate-50 font-extrabold tracking-tight">
            Semanas de Clase
          </h2>
        </div>
        <p className="text-base md:text-lg text-slate-400 pl-14">
          Explora los temas de cada sesión.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {sorted.length === 0 ? (
          <div className="text-center py-20 px-4 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
            <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-5" />
            <p className="text-slate-500 text-lg md:text-xl font-medium">
              No hay semanas publicadas aún.
            </p>
          </div>
        ) : (
          sorted.map((week, index) => {
            const isExpanded = expandedId === week.id;
            return (
              <div
                key={week.id}
                className={`bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden
                  ${isExpanded
                    ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-[1.01] sm:scale-[1.02]'
                    : 'border-slate-800 hover:border-slate-700 hover:shadow-lg'}`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : week.id)}
                  className={`w-full flex items-center justify-between p-5 sm:p-6 lg:p-8 transition-colors text-left gap-4 focus:outline-none ${isExpanded ? 'bg-slate-900' : 'hover:bg-slate-800/40'}`}
                >
                  <div className="flex items-center gap-5 sm:gap-6 min-w-0">
                    <div className={`p-4 rounded-2xl border transition-all duration-300 flex-shrink-0
                      ${isExpanded
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      <BookOpen className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                    <div className="min-w-0 py-1">
                      <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-emerald-500 mb-1.5 block">
                        {week.subtitle ?? `Semana ${index + 1}`}
                      </span>
                      <h3 className={`font-extrabold leading-tight truncate transition-colors duration-300
                        ${isExpanded
                          ? 'text-slate-50 text-xl sm:text-2xl md:text-3xl'
                          : 'text-slate-200 text-lg sm:text-xl md:text-2xl'}`}
                      >
                        {week.title}
                      </h3>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0
                    ${isExpanded
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-slate-950 text-slate-500 border border-slate-800'}`}
                  >
                    <ChevronDown className={`w-6 h-6 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Expandable body */}
                <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="p-5 sm:p-6 lg:p-8 border-t border-slate-800/80 bg-gradient-to-b from-slate-900/40 to-slate-950/20">
                      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

                        {/* Left: info */}
                        <div className="w-full lg:w-2/5 flex flex-col gap-8">
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                              <LayoutTemplate className="w-4 h-4" /> Resumen de la Clase
                            </h4>
                            <div className="bg-slate-900/80 p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-inner">
                              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">{week.description}</p>
                            </div>
                          </div>

                          {week.topics.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Database className="w-4 h-4" /> Temas Tratados
                              </h4>
                              <div className="flex flex-wrap gap-2.5">
                                {week.topics.map((topic, i) => (
                                  <span key={i} className="text-sm font-medium text-slate-200 bg-slate-800/60 border border-slate-700/60 px-4 py-2.5 rounded-xl flex items-center gap-2.5 shadow-sm hover:bg-slate-700 hover:border-slate-500 transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] flex-shrink-0" />
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-auto pt-4">
                            <a
                              href={week.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between w-full p-4 md:p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500/60 hover:-translate-y-1 text-emerald-300 transition-all group/btn shadow-[0_8px_16px_-6px_rgba(16,185,129,0.2)]"
                            >
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 group-hover/btn:border-emerald-400 transition-colors flex-shrink-0">
                                  <FileText className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div className="flex flex-col items-start min-w-0">
                                  <span className="text-lg font-bold truncate w-full text-slate-50 group-hover/btn:text-emerald-400 transition-colors">
                                    Material PDF
                                  </span>
                                  <span className="text-sm text-emerald-500/80 font-mono mt-0.5">{week.pdfSize}</span>
                                </div>
                              </div>
                              <div className="bg-emerald-500 text-slate-950 p-2 rounded-lg opacity-80 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all flex-shrink-0 shadow-md">
                                <Download className="w-5 h-5" />
                              </div>
                            </a>
                          </div>
                        </div>

                        {/* Right: PDF preview */}
                        <div className="w-full lg:w-3/5 flex flex-col pt-4 lg:pt-0">
                          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 border-b-0 rounded-t-2xl px-5 py-3.5">
                            <span className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                              <Eye className="w-4 h-4 text-emerald-500" /> Previsualización del Documento
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                            </div>
                          </div>
                          <div className="w-full h-[450px] sm:h-[550px] lg:h-[600px] rounded-b-2xl border border-slate-800 overflow-hidden bg-slate-950 shadow-inner relative">
                            <iframe
                              src={`${week.pdfUrl}#toolbar=0`}
                              className="w-full h-full border-none absolute inset-0 z-10 bg-slate-950"
                              title={`PDF ${week.title}`}
                            />
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}