
import React from 'react';

interface LandingViewProps {
  onStart: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] aspect-square bg-blue-600/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[60%] aspect-square bg-slate-800/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <header className="px-8 py-10 flex justify-between items-center safe-top">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">Bloom Intelligence</span>
          </div>
          <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Build 3.1.0_PRO</div>
        </header>

        <main className="flex-1 flex flex-col px-10 pt-20">
          <h1 className="text-7xl font-black tracking-tight leading-[0.82] mb-10 text-white">
            DECODE<br />THE<br /><span className="text-blue-500">LABELS.</span>
          </h1>
          <p className="text-white/50 text-xl leading-relaxed max-w-[280px] mb-16 font-medium tracking-tight">
            Sophisticated optical analysis for industrial nutrition and compound verification.
          </p>

          <div className="mt-auto mb-20">
            <button 
              onClick={onStart}
              className="w-full py-7 bg-white text-black font-black text-xs tracking-[0.4em] uppercase rounded-none hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-6 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
              Initialize System
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </main>

        <footer className="px-10 py-10 border-t border-white/5 flex justify-between items-center safe-bottom">
          <div>
            <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.3em] mb-1">Standardized Protocol</p>
            <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">ISO-27001 Certified</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.3em] mb-1">Optical Engine</p>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Active Link</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingView;
