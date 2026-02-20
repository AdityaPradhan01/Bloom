
import React, { useState } from 'react';
import { AnalysisResult } from '../types';

interface HistoryViewProps {
  history: AnalysisResult[];
  onBack: () => void;
  onViewResult: (result: AnalysisResult) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onBack, onViewResult }) => {
  const [search, setSearch] = useState('');

  const filtered = history.filter(item => 
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#f8fafc] dark:bg-[#050505] z-[70] flex flex-col theme-transition animate-in fade-in duration-300">
      <header className="sticky top-0 z-[80] px-8 py-6 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex justify-between items-center safe-top pt-16">
        <div>
          <span className="text-[9px] font-black tracking-[0.5em] text-blue-500 uppercase block mb-1">Optical Database</span>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Historical Records
          </h2>
        </div>
        <button 
          onClick={onBack}
          className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest"
        >
          Close
        </button>
      </header>

      <div className="p-8 flex-1 overflow-y-auto scroll-container pb-32">
        <div className="relative mb-10">
          <input 
            type="text"
            placeholder="Search Records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-none text-xs font-bold focus:outline-none focus:border-blue-500 transition-all pl-14"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/20"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-20">Database Empty</p>
            </div>
          ) : (
            filtered.map((log) => (
              <button 
                key={log.id}
                onClick={() => onViewResult(log)}
                className="w-full p-6 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 flex items-center gap-6 active:bg-slate-50 dark:active:bg-white/[0.05] transition-all text-left shadow-sm group"
              >
                <div className="w-14 h-14 bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10 overflow-hidden">
                   {log.capturedImage ? (
                     <img src={log.capturedImage} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-500" alt="" />
                   ) : (
                     <div className="w-2 h-2 bg-blue-500" />
                   )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight mb-1.5">{log.productName}</p>
                  <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 dark:text-white/20">{new Date(log.timestamp).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.5 border border-current ${
                      log.dailyImpact.verdict === 'Excellent' || log.dailyImpact.verdict === 'Good' ? 'text-emerald-500' : 
                      log.dailyImpact.verdict === 'Fair' ? 'text-amber-500' : 'text-red-500'
                    }`}>{log.dailyImpact.verdict}</span>
                  </div>
                </div>
                <div className={`text-lg font-black mono tabular shrink-0 ${
                  log.healthScore > 70 ? 'text-emerald-500' : log.healthScore > 40 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {log.healthScore}%
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
