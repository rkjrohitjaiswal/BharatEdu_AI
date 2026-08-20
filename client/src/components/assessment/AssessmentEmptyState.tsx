import React from 'react';
import { Award } from 'lucide-react';

export const AssessmentEmptyState: React.FC = () => {
  return (
    <div className="p-12 bg-slate-900/40 border border-slate-800 rounded-3xl text-center space-y-3">
      <Award className="w-12 h-12 text-slate-500 mx-auto" />
      <h3 className="text-lg font-bold text-white">No Active Assessments</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">
        Your teacher or AI system has not assigned any active diagnostic test sets yet. Check back soon!
      </p>
    </div>
  );
};

export default AssessmentEmptyState;
