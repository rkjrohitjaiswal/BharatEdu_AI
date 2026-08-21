import React from 'react';
import { TrendingUp, Sparkles, RefreshCw } from 'lucide-react';

interface EffectivenessHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const EffectivenessHeader: React.FC<EffectivenessHeaderProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl mb-6 border border-emerald-500/30">
      <div className="flex justify-between items-start md:items-center">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Learning Effectiveness & Outcome Optimization • Feature 44</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Did the Recommended Action Help?</h1>
          <p className="text-xs text-teal-200 mt-1 max-w-2xl">
            Empirical outcome measurement distinguishing action completion from true mastery and accuracy improvement.
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 flex items-center space-x-2 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Recalculate Outcomes</span>
          </button>
        )}
      </div>
    </div>
  );
};
