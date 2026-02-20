
import React, { useRef, useState, useEffect } from 'react';
import { AppState } from '../types';

interface ScannerViewProps {
  onCapture: (base64: string) => void;
  onQuit: () => void;
  state: AppState;
}

const ScannerView: React.FC<ScannerViewProps> = ({ onCapture, onQuit, state }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setCameraError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        onCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuit = () => {
    onQuit();
  };

  return (
    <div className="fixed inset-0 bg-slate-900 dark:bg-black flex flex-col items-center justify-between p-0 overflow-hidden z-[65] animate-in fade-in duration-500">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 dark:bg-[#050505]">
          <div className="w-16 h-[2px] bg-white/5 mb-8 rounded-full" />
          <p className="text-[10px] uppercase tracking-[0.6em] text-white/20 mono text-center px-12 leading-loose">
            Preview Mode Active<br />Hardware Sensors Disabled
          </p>
        </div>
      </div>

      <div className="w-full px-6 py-8 flex justify-between items-center z-20 bg-gradient-to-b from-black/70 to-transparent pt-16">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-500/30" />
          <span className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase mono">
            Preview Environment
          </span>
        </div>
        <button 
           onClick={() => window.location.reload()} 
           className="text-[9px] font-black tracking-widest text-white/30 uppercase mono px-4 py-2 border border-white/10 rounded-full"
        >
          REBOOT_SYS
        </button>
      </div>

      <div className="relative w-[85vw] aspect-[1/1.4] flex items-center justify-center z-10 max-w-sm">
        <div className="absolute inset-0 border-2 border-white/10 rounded-[3rem] pointer-events-none" />
        
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white/10 rounded-tl-[3rem]" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-white/10 rounded-tr-[3rem]" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-white/10 rounded-bl-[3rem]" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white/10 rounded-br-[3rem]" />
        
        <div className="text-center px-10">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-10 py-6 bg-white dark:bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl active:scale-95 transition-all shadow-2xl flex flex-col items-center gap-3"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">Upload Label</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">Select image for analysis</span>
          </button>
          
          {error && (
            <div className="mt-10 p-6 bg-red-600/20 border border-red-500/30 rounded-[2rem] max-w-[240px]">
              <p className="text-[10px] text-red-100 uppercase font-black tracking-widest leading-relaxed">
                {error}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full px-12 pb-20 pt-10 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center gap-10 z-20 safe-bottom">
        <div className="flex items-center justify-center gap-16">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2.5 active:scale-90 transition-transform"
          >
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-70"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">GAllery</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={state === AppState.PROCESSING}
            className={`shutter-btn shadow-[0_0_60px_rgba(255,255,255,0.2)] opacity-10`}
          />

          <button 
            onClick={handleQuit}
            className="flex flex-col items-center gap-2.5 active:scale-90 transition-transform"
          >
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-50"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Quit</span>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ScannerView;
