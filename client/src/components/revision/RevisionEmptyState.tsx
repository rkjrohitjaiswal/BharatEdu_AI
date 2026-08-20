import React from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';

export interface RevisionEmptyStateProps {
  onRefresh?: () => void;
}

export const RevisionEmptyState: React.FC<RevisionEmptyStateProps> = ({ onRefresh }) => {
  return (
    <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-3 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h3 className="font-extrabold text-base text-slate-900">All Revisions Up to Date!</h3>
      <p className="text-xs text-slate-500 font-medium">
        Great job! You have completed all scheduled spaced-repetition items for today.
      </p>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      )}
    </div>
  );
};
