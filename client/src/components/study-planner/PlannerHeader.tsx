import React from 'react';
import { Calendar, RefreshCw, Zap } from 'lucide-react';

export interface PlannerHeaderProps {
  date: string;
  onRefresh: () => void;
  loading: boolean;
}

export const PlannerHeader: React.FC<PlannerHeaderProps> = ({ date, onRefresh, loading }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Adaptive Study Planner</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalized daily schedule built on your learning gaps & readiness targets ({date})
          </p>
        </div>
      </div>

      <button
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        <span>Adaptive Refresh</span>
      </button>
    </div>
  );
};
