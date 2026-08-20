import React from 'react';
import { Target } from 'lucide-react';

export interface AssessmentEmptyStateProps {
  onStart: () => void;
}

export const AssessmentEmptyState: React.FC<AssessmentEmptyStateProps> = ({ onStart }) => {
  return (
    <div className="p-10 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
        <Target className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="font-extrabold text-base text-slate-900">No Active Assessment</h3>
        <p className="text-xs text-slate-500 font-medium">
          Start a fresh adaptive assessment aligned with your current learning state and prerequisite graph.
        </p>
      </div>

      <button
        onClick={onStart}
        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
      >
        Start New Assessment
      </button>
    </div>
  );
};
