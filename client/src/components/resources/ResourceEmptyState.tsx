import React from 'react';
import { BookOpenCheck, RefreshCw } from 'lucide-react';

export interface ResourceEmptyStateProps {
  onRefresh: () => void;
}

export const ResourceEmptyState: React.FC<ResourceEmptyStateProps> = ({ onRefresh }) => {
  return (
    <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto font-bold">
        <BookOpenCheck className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 text-base">No Matching Recommendations Found</h3>
        <p className="text-xs text-slate-500">Try adjusting your filters or trigger a fresh recommendation refresh.</p>
      </div>

      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Refresh Recommendations</span>
      </button>
    </div>
  );
};
