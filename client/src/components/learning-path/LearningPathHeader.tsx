import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

export interface LearningPathHeaderProps {
  title: string;
  description: string;
  board: string;
  classLevel: string;
  onRefresh: () => void;
  refreshing: boolean;
}

export const LearningPathHeader: React.FC<LearningPathHeaderProps> = ({
  title,
  description,
  board,
  classLevel,
  onRefresh,
  refreshing,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-800/50">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Compass className="w-64 h-64 text-indigo-400" />
      </div>

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-extrabold text-xs tracking-wider uppercase">
              {board} • {classLevel}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <Sparkles className="w-3 h-3" /> AI Personalized
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            <span>{refreshing ? 'Recalculating...' : 'Refresh Path'}</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{title}</h1>
        <p className="text-xs sm:text-sm text-indigo-100/80 max-w-2xl leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
