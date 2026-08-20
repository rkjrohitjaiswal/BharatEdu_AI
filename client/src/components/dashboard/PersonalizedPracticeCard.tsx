import React from 'react';
import { Target, Zap, ArrowRight, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PersonalizedPracticeCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/60 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Target className="w-32 h-32 text-indigo-400" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">AI Powered Engine</span>
          <h3 className="text-xl font-bold text-white">Adaptive Practice & Mastery</h3>
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-6">
        Real-time adaptive question generation targeted to your weak concepts, Knowledge Graph prerequisites, and exam goals.
      </p>

      <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800 mb-6">
        <div className="flex-1">
          <div className="text-xs text-slate-400">Today's Focus</div>
          <div className="text-sm font-semibold text-indigo-300">Quadratic Equations & Discriminant</div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs font-medium">
          <Zap className="w-3.5 h-3.5" />
          5 Questions
        </div>
      </div>

      <button
        onClick={() => navigate('/personalized-practice')}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all group-hover:scale-[1.01]"
      >
        <span>Start Personalized Practice</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
