
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, AnalysisResult, User } from './types';
import ScannerView from './components/ScannerView';
import AnalysisDisplay from './components/AnalysisDisplay';
import LandingView from './components/LandingView';
import AuthView from './components/AuthView';
import SettingsView from './components/SettingsView';
import DashboardView from './components/DashboardView';
import HistoryView from './components/HistoryView';
import { analyzeProductBack } from './services/geminiService';

const STORAGE_KEY = 'bloom_user_data_v1';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isViewingHistory, setIsViewingHistory] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setState(AppState.DASHBOARD);
      } catch (e) {
        console.error("Failed to load user state", e);
      }
    }
  }, []);

  // Sync theme
  useEffect(() => {
    if (!user) return;
    const theme = user.preferences.theme || 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.preferences.theme]);

  // Persist
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const handleAuth = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setState(AppState.DASHBOARD);
  };

  const handleCapture = useCallback(async (base64: string) => {
    setState(AppState.PROCESSING);
    setIsViewingHistory(false);
    setError(null);
    try {
      const data = await analyzeProductBack(base64);
      setResult(data);
      if (user) {
        setUser(prev => prev ? {
          ...prev,
          history: [data, ...prev.history].slice(0, 50)
        } : null);
      }
      setState(AppState.RESULT);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Optical fault detected during analysis.");
      setState(AppState.DASHBOARD);
    }
  }, [user]);

  const viewResultDetail = (r: AnalysisResult, fromHistoryList: boolean = false) => {
    setResult(r);
    setIsViewingHistory(fromHistoryList || state === AppState.DASHBOARD || state === AppState.HISTORY);
    setState(AppState.RESULT);
  };

  const resetApp = () => {
    const targetState = isViewingHistory ? (state === AppState.RESULT ? AppState.DASHBOARD : AppState.HISTORY) : AppState.DASHBOARD;
    setResult(null);
    setState(targetState);
    setError(null);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-50 dark:bg-black text-slate-900 dark:text-white theme-transition font-sans">
      {/* Universal Status Bar */}
      {(state === AppState.DASHBOARD || state === AppState.HISTORY || state === AppState.IDLE || state === AppState.RESULT) && user && (
        <div className="fixed top-0 left-0 right-0 z-[60] px-6 py-4 flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/5 safe-top">
          <div 
            className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
            onClick={() => setState(AppState.DASHBOARD)}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Bloom</span>
          </div>
          <button 
            onClick={() => setState(AppState.SETTINGS)}
            className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full active:scale-95 transition-all"
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40">CONFIG</span>
          </button>
        </div>
      )}

      {state === AppState.LANDING && (
        <LandingView onStart={() => setState(AppState.AUTH)} />
      )}

      {state === AppState.AUTH && (
        <AuthView onAuth={handleAuth} />
      )}

      {state === AppState.DASHBOARD && user && (
        <DashboardView 
          user={user} 
          onStartScan={() => setState(AppState.IDLE)} 
          onUpload={handleCapture}
          onViewResult={(r) => viewResultDetail(r)}
          onViewHistory={() => setState(AppState.HISTORY)}
          onOpenSettings={() => setState(AppState.SETTINGS)}
        />
      )}

      {state === AppState.HISTORY && user && (
        <HistoryView 
          history={user.history} 
          onBack={() => setState(AppState.DASHBOARD)}
          onViewResult={(r) => viewResultDetail(r, true)}
        />
      )}

      {state === AppState.SETTINGS && user && (
        <SettingsView 
          user={user} 
          onUpdate={setUser} 
          onBack={() => setState(AppState.DASHBOARD)}
          onLogout={() => { setUser(null); setState(AppState.LANDING); }}
        />
      )}

      {state === AppState.IDLE && (
        <ScannerView onCapture={handleCapture} state={state} onQuit={() => setState(AppState.DASHBOARD)} />
      )}

      {state === AppState.PROCESSING && (
        <div className="absolute inset-0 bg-slate-50 dark:bg-black z-[100] flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-0.5 bg-slate-200 dark:bg-white/5 relative mb-10 overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-blue-600 animate-[loading-bar_1.2s_infinite]" />
          </div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em] mb-6 text-slate-400 dark:text-white/40 font-mono">Synthesizing Intel</h2>
          <style>{`
            @keyframes loading-bar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}

      {state === AppState.RESULT && result && (
        <AnalysisDisplay result={result} onReset={resetApp} isHistoryView={isViewingHistory} />
      )}

      {error && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white dark:bg-[#0A0A0A] border border-red-500/20 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/30" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              </div>
              
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-red-500 mb-4">Analysis Interrupted</h3>
              <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed mb-8">
                {error}
              </p>
              
              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={() => { setError(null); setState(AppState.IDLE); }} 
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95"
                >
                  Retry Scan
                </button>
                <button 
                  onClick={() => setError(null)} 
                  className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
