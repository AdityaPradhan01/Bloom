
import React, { useState } from 'react';
import { User } from '../types';

interface AuthViewProps {
  onAuth: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth({
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email: email || 'operator@bloom.ai',
      name: name || (isLogin ? 'Researcher Delta' : 'New Operator'),
      preferences: {
        diet: 'Standard',
        allergies: [] as string[],
        monitoring: ['Sugars', 'Sodium', 'Additives'],
        theme: 'dark'
      },
      history: []
    });
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col px-8 pt-24 pb-12 overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.1)_0%,_transparent_70%)]" />
      </div>

      <div className="relative mb-16">
        <h2 className="text-5xl font-black tracking-tighter mb-3 leading-none">
          {isLogin ? (
            <>OPERATOR<br />ACCESS</>
          ) : (
            <>NEW<br />OPERATOR</>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-10 h-0.5 bg-blue-500" />
          <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black">Secure Terminal v2.0</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-8 flex-1">
        {!isLogin && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] text-[#555] font-black uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-xl text-white font-bold focus:outline-none focus:border-blue-500 transition-all focus:ring-4 focus:ring-blue-500/10"
              placeholder="Operator Identity"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] text-[#555] font-black uppercase tracking-widest ml-1">Operator Identifier (Email)</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-5 rounded-xl text-white font-bold focus:outline-none focus:border-blue-500 transition-all focus:ring-4 focus:ring-blue-500/10"
            placeholder="ID_00X@bloom.ai"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] text-[#555] font-black uppercase tracking-widest ml-1">Security Key (Password)</label>
          <input 
            type="password" 
            required
            className="w-full bg-white/5 border border-white/10 p-5 rounded-xl text-white font-bold focus:outline-none focus:border-blue-500 transition-all focus:ring-4 focus:ring-blue-500/10"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-6 bg-blue-600 text-white font-black text-[11px] tracking-[0.4em] uppercase rounded-xl shadow-2xl shadow-blue-600/20 active:scale-[0.98] transition-all"
        >
          {isLogin ? 'Initialize Session' : 'Create Operator Account'}
        </button>
      </form>

      <div className="relative mt-12 text-center pb-8">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-[10px] text-[#444] font-black uppercase tracking-widest hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1"
        >
          {isLogin ? 'Request New Access Credentials' : 'Return to Primary Access Terminal'}
        </button>
      </div>
    </div>
  );
};

export default AuthView;
