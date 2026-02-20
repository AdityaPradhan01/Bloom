
import React from 'react';
import { User } from '../types';

interface SettingsViewProps {
  user: User;
  onUpdate: (user: User) => void;
  onBack: () => void;
  onLogout: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdate, onBack, onLogout }) => {
  const toggleTheme = (theme: 'light' | 'dark') => {
    onUpdate({
      ...user,
      preferences: { ...user.preferences, theme }
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-black z-[100] flex flex-col theme-transition">
      <header className="px-6 py-5 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-white dark:bg-black/80 backdrop-blur-xl pt-14">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/40">Configuration</h2>
        <button 
          onClick={onBack} 
          className="text-[10px] text-blue-600 font-black uppercase tracking-widest px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-full"
        >
          CLOSE
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 scroll-container">
        <section className="space-y-4">
          <h3 className="text-[10px] text-slate-400 dark:text-[#555] font-black uppercase tracking-[0.2em]">Appearance</h3>
          <div className="grid grid-cols-2 gap-3">
            {(['light', 'dark'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => toggleTheme(mode)}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all active:scale-95 ${
                  user.preferences.theme === mode 
                    ? 'border-blue-500 bg-white dark:bg-blue-500/10 shadow-lg' 
                    : 'border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 opacity-60'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  mode === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                }`}>
                  {mode === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{mode} MODE</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] text-slate-400 dark:text-[#555] font-black uppercase tracking-[0.2em]">Profile</h3>
          <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm">
            <p className="text-[9px] text-slate-400 dark:text-[#444] font-black uppercase tracking-widest mb-1.5">ID Hash</p>
            <p className="mono text-[10px] text-slate-600 dark:text-white/60 truncate bg-slate-50 dark:bg-white/5 p-2 rounded-lg">{user.id}</p>
            <div className="mt-6">
              <p className="text-[9px] text-slate-400 dark:text-[#444] font-black uppercase tracking-widest mb-1.5">Contact</p>
              <p className="text-sm font-bold truncate">{user.email}</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] text-slate-400 dark:text-[#555] font-black uppercase tracking-[0.2em]">Primary Protocols</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Vegan', 'Keto', 'Standard', 'Low Sod.'].map(diet => (
              <button 
                key={diet}
                className={`p-4 border rounded-xl text-left flex justify-between items-center transition-all active:scale-95 ${
                  user.preferences.diet === diet 
                    ? 'border-blue-500 bg-white dark:bg-blue-500/10 shadow-sm' 
                    : 'border-slate-200 dark:border-white/5 bg-white dark:bg-white/5'
                }`}
                onClick={() => onUpdate({ ...user, preferences: { ...user.preferences, diet }})}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{diet}</span>
                {user.preferences.diet === diet && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
              </button>
            ))}
          </div>
        </section>

        <section className="pt-8">
          <button 
            onClick={onLogout}
            className="w-full py-5 bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-900/20 text-red-600 dark:text-red-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl active:scale-95 transition-all shadow-sm"
          >
            TERMINATE SESSION
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
