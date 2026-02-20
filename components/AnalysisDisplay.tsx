
import React, { useState } from 'react';
import { AnalysisResult } from '../types';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
  isHistoryView?: boolean;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, onReset, isHistoryView }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'visual'>('summary');

  const getTheme = (verdict: string) => {
    switch (verdict) {
      case 'Excellent': return { label: 'OPTIMAL', bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' };
      case 'Good': return { label: 'STANDARD', bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' };
      case 'Fair': return { label: 'MODERATE', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' };
      case 'Caution': return { label: 'RESTRICTED', bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30' };
      case 'Avoid': return { label: 'CRITICAL', bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' };
      default: return { label: 'UNKNOWN', bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/30' };
    }
  };

  const theme = getTheme(result.dailyImpact.verdict);

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#f8fafc] dark:bg-[#050505] flex flex-col theme-transition scroll-container animate-in slide-in-from-bottom-6 duration-500">
      <header className="sticky top-0 z-[110] px-8 py-6 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex justify-between items-center safe-top pt-16">
        <div className="flex-1 truncate pr-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black tracking-[0.4em] text-blue-500 uppercase">Analysis Engine</span>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter truncate text-slate-900 dark:text-white">
            {result.productName}
          </h2>
        </div>
        <button 
          onClick={onReset}
          className={`shrink-0 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-none active:scale-95 transition-all shadow-xl`}
        >
          {isHistoryView ? 'Return' : 'Close'}
        </button>
      </header>

      <div className="bg-slate-100 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/5 px-8 py-2.5 flex justify-between items-center text-[8px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-white/20">
        <span>ID: {result.id}</span>
        <span>TS: {new Date(result.timestamp).toLocaleTimeString()}</span>
      </div>

      <nav className="sticky top-[110px] z-[105] flex bg-white/95 dark:bg-black/95 border-b border-slate-200 dark:border-white/5 px-4">
        {[
          { id: 'summary', label: 'Executive' },
          { id: 'details', label: 'Compounds' },
          { id: 'visual', label: 'Optical' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-2 ${
              activeTab === tab.id ? 'text-blue-600 border-blue-600' : 'text-slate-400 dark:text-white/10 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-8 space-y-12 pb-32 max-w-2xl mx-auto w-full">
        {activeTab === 'summary' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <section className="text-center py-10">
              <p className="text-[10px] font-black tracking-[0.5em] text-slate-400 dark:text-white/20 uppercase mb-4">Integrity Score</p>
              <div className="relative inline-flex items-center justify-center">
                <div className={`text-8xl font-black tracking-tighter tabular mb-2 italic ${theme.text}`}>
                  {result.healthScore}<span className="text-3xl not-italic ml-1 opacity-40">%</span>
                </div>
              </div>
              <div className="mt-4 flex flex-col items-center">
                <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] border-2 ${theme.border} ${theme.text}`}>
                  {theme.label}
                </span>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4">
              {result.quantities.slice(0, 4).map((q, idx) => (
                <div key={idx} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 p-6 shadow-sm">
                  <span className="text-[9px] text-slate-400 dark:text-white/20 font-black uppercase tracking-widest mb-2 block">{q.label}</span>
                  <p className="text-2xl font-black mono tabular text-slate-900 dark:text-white">{q.amount}<span className="text-xs ml-1 opacity-30">{q.unit}</span></p>
                  <div className={`text-[8px] font-black uppercase tracking-widest mt-4 flex items-center gap-2 ${
                    q.level === 'high' ? 'text-red-500' : q.level === 'moderate' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    <div className="w-1 h-1 rounded-full bg-current" />
                    {q.level} Density
                  </div>
                </div>
              ))}
            </section>

            <section className="p-8 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] shadow-sm">
              <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-400 dark:text-white/20 uppercase mb-6">Short-Term Impact</h3>
              <p className="text-sm leading-relaxed font-bold italic text-slate-700 dark:text-white/80">
                "{result.dailyImpact.shortTerm}"
              </p>
            </section>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <section className="space-y-4">
              <div className="text-sm text-slate-700 dark:text-white/80 leading-relaxed font-medium bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 p-8 italic shadow-sm">
                {result.detailedBreakdown}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-slate-400 dark:text-white/20 uppercase px-1">Constituent Mapping</h3>
              <div className="divide-y divide-slate-100 dark:divide-white/5 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] shadow-sm">
                {result.composition.map((ing, i) => (
                  <div key={i} className="p-6 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{ing.name}</span>
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-sm border ${
                        ing.healthImpact === 'negative' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
                        ing.healthImpact === 'positive' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>{ing.healthImpact}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-white/30 font-bold leading-relaxed">{ing.purpose}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'visual' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <div className="relative w-full aspect-video border border-slate-200 dark:border-white/10 overflow-hidden bg-black shadow-2xl">
                {result.capturedImage && (
                  <img src={result.capturedImage} className="w-full h-full object-cover opacity-60 grayscale brightness-75 contrast-125" alt="Optical Feed" />
                )}
                <div className="absolute inset-0 border border-white/10 pointer-events-none" />
                <div className="absolute top-6 left-6 bg-blue-600/90 backdrop-blur-md px-4 py-1.5 shadow-2xl">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Spectral Feed: Active</span>
                </div>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan z-20" />
             </div>

             <div className="space-y-6">
               <h3 className="text-[10px] font-black tracking-[0.4em] text-slate-400 dark:text-white/20 uppercase px-1">Optical Markers</h3>
               <div className="space-y-4">
                 {result.visualMarkers.map((marker, i) => (
                   <div key={i} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 shadow-sm">
                     <div className="px-6 py-4 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{marker.location}</p>
                        <span className={`text-[9px] font-black uppercase px-3 py-1 ${
                          marker.severity === 'high' ? 'bg-red-600 text-white' : 'bg-amber-500 text-black'
                        }`}>{marker.severity} RISK</span>
                     </div>
                     <div className="p-6">
                       <p className="text-xs text-slate-600 dark:text-white/60 font-bold leading-relaxed italic">"{marker.issue}"</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AnalysisDisplay;
