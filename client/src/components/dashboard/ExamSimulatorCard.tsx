import React from 'react';
import { Award, Clock, ArrowRight, Sparkles, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExamSimulatorCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Award className="w-32 h-32 text-purple-400" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">AI Exam Engine</span>
          <h3 className="text-xl font-bold text-white">Full-Length Exam Simulator</h3>
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-6">
        Practice realistic full-length & sectional mock tests with server-authoritative timing, negative marking, and instant AI analytics.
      </p>

      <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800 mb-6">
        <div className="flex-1">
          <div className="text-xs text-slate-400">Recommended Mock</div>
          <div className="text-sm font-semibold text-purple-300">Class 10 CBSE Board Mock Test</div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          180 Mins
        </div>
      </div>

      <button
        onClick={() => navigate('/exam-simulator')}
        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all group-hover:scale-[1.01]"
      >
        <span>Launch Exam Simulator</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
