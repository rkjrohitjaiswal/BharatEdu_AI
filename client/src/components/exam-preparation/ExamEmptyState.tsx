import React from 'react';
import { Target } from 'lucide-react';

interface ExamEmptyStateProps {
  onSetupPlan?: () => void;
}

export const ExamEmptyState: React.FC<ExamEmptyStateProps> = ({ onSetupPlan }) => {
  return (
    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center max-w-lg mx-auto my-8">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Target className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-extrabold text-gray-900 mb-2">No Active Exam Preparation Plan</h3>
      <p className="text-xs text-gray-500 mb-6">
        Select your target board exam, target score, and daily study budget to generate a personalized readiness roadmap.
      </p>
      <button
        onClick={onSetupPlan}
        className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all"
      >
        Initialize Exam Preparation Journey
      </button>
    </div>
  );
};
