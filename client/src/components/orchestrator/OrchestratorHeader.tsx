import React from 'react';
import { Compass, Sparkles, RefreshCw } from 'lucide-react';

interface OrchestratorHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const OrchestratorHeader: React.FC<OrchestratorHeaderProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 shadow-xl mb-6 border border-indigo-500/30">
      <div className="flex justify-between items-start md:items-center">
        <div>
          <div className="flex items-center space-x-2 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Central AI Orchestrator • Feature 43</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Unified Student Intelligence & Action Plan</h1>
          <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
            Real-time synthesis across Knowledge Graph, Smart Revision, Exam Prep, Doubt Solver, Learning Path, and Risk Prediction.
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 flex items-center space-x-2 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Plan</span>
          </button>
        )}
      </div>
    </div>
  );
};
