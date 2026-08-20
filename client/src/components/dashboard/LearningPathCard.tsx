import React, { useEffect, useState } from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchLearningPathSummary } from '../../services/api';

export const LearningPathCard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearningPathSummary()
      .then((res) => {
        if (res.success && res.data) {
          setSummary(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm animate-pulse space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-6 bg-slate-200 rounded w-2/3" />
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white shadow-xl border border-indigo-800/40 relative overflow-hidden flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">AI Learning Path</span>
        </div>
        <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> {summary?.currentLearningLevel || 'Foundation'} Level
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-black tracking-tight text-white">{summary?.topPathTitle || 'CBSE Personalized Curriculum'}</h3>
        <p className="text-xs text-indigo-100/80 line-clamp-2">{summary?.aiAdvice || 'Follow your adaptive prerequisite learning path.'}</p>
      </div>

      <div className="space-y-2 pt-2 border-t border-indigo-800/50">
        <div className="flex items-center justify-between text-xs text-indigo-200">
          <span>Overall Curriculum Progress</span>
          <span className="font-bold text-white">{summary?.overallProgressPercent || 0}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${summary?.overallProgressPercent || 0}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate('/learning-path')}
        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 group"
      >
        <span>Continue Learning Path</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
