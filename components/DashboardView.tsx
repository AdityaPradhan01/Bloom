
import React, { useMemo } from 'react';
import { User, AnalysisResult } from '../types';

interface DashboardViewProps {
  user: User;
  onStartScan: () => void;
  onUpload: (base64: string) => void;
  onViewResult: (result: AnalysisResult) => void;
  onViewHistory: () => void;
  onOpenSettings: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ user, onStartScan, onUpload, onViewResult, onViewHistory, onOpenSettings }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const avgScore = useMemo(() => {
    if (user.history.length === 0) return 0;
    return Math.round(user.history.reduce((acc, curr) => acc + curr.healthScore, 0) / user.history.length);
  }, [user.history]);

  return (
    <div className="flex-1 flex flex-col bg-[#fcfcfc] dark:bg-[#050505] overflow-hidden theme-transition h-full">
      <div className="flex-1 overflow-y-auto scroll-container px-8 pt-28 pb-40">
        <header className="mb-10 animate-in fade-in slide-in-from-top-2 duration-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-[1px] bg-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Operator Hub</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
            Hello,<br />
            <span className="text-blue-600 italic">{user.name.split(' ')[0]}</span>
          </h2>
        </header>

        <section className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 p-6 rounded-none shadow-sm flex flex-col justify-between h-28">
            <span className="text-[9px] text-slate-400 dark:text-white/20 font-black uppercase tracking-[0.2em]">Records</span>
            <p className="text-3xl font-black mono text-slate-900 dark:text-white tabular">{user.history.length}</p>
          </div>
          <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 p-6 rounded-none shadow-sm flex flex-col justify-between h-28">
            <span className="text-[9px] text-slate-400 dark:text-white/20 font-black uppercase tracking-[0.2em]">Health Avg</span>
            <p className={`text-3xl font-black mono tabular ${avgScore > 70 ? 'text-emerald-500' : avgScore > 40 ? 'text-amber-500' : 'text-red-500'}`}>
              {avgScore > 0 ? `${avgScore}%` : '---'}
            </p>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/20">
              Intelligence Queue
            </h3>
            {user.history.length > 0 && (
              <button 
                onClick={onViewHistory}
                className="text-[10px] font-black uppercase tracking-widest text-blue-600 pb-0.5 hover:text-blue-500 transition-colors"
              >
                Browse All
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {user.history.length === 0 ? (
              <div className="py-12 text-center border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.02]">
                <p className="text-[10px] text-slate-400 dark:text-white/10 font-black uppercase tracking-widest">No active logs</p>
              </div>
            ) : (
              user.history.slice(0, 3).map((log, idx) => (
                <button 
                  key={log.id}
                  onClick={() => onViewResult(log)}
                  className="w-full p-5 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-none flex justify-between items-center active:bg-slate-50 dark:active:bg-white/[0.05] transition-all"
                >
                  <div className="text-left truncate pr-4">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-tight mb-1">{log.productName}</p>
                    <p className="text-[9px] text-slate-400 dark:text-white/30 font-bold uppercase tracking-widest">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`text-xs font-black mono tabular shrink-0 px-3 py-1.5 rounded-sm ${
                    log.healthScore > 70 ? 'bg-emerald-500/10 text-emerald-600' : 
                    log.healthScore > 40 ? 'bg-amber-500/10 text-amber-600' : 
                    'bg-red-500/10 text-red-600'
                  }`}>
                    {log.healthScore}%
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        <div className="py-10 flex flex-col items-center">
          <button 
            onClick={onStartScan}
            className="w-full py-8 bg-blue-600 text-white flex items-center justify-center gap-4 active:scale-[0.98] transition-all shadow-[0_25px_60px_-15px_rgba(37,99,235,0.4)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 8v8"/></svg>
            <span className="text-[12px] font-black uppercase tracking-[0.5em]">Analyze New Label</span>
          </button>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-white dark:bg-black border-t border-slate-200 dark:border-white/5 flex items-center justify-around px-12 z-[60] safe-bottom">
        <button className="flex flex-col items-center gap-1.5 text-blue-600">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mb-1" />
          <span className="text-[9px] font-black uppercase tracking-widest">Hub</span>
        </button>
        <button 
          onClick={onViewHistory}
          className="flex flex-col items-center gap-1.5 text-slate-400 dark:text-white/20 active:text-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/><path d="M8 15h6"/></svg>
          <span className="text-[9px] font-black uppercase tracking-widest">History</span>
        </button>
        <button 
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-1.5 text-slate-400 dark:text-white/20 active:text-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span className="text-[9px] font-black uppercase tracking-widest">Config</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardView;
