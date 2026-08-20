import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ExamGapAnalysisProps {
  gaps: Array<{ gapId: string; gapType: string; topic: string; impactScore: number; description: string }>;
}

export const ExamGapAnalysis: React.FC<ExamGapAnalysisProps> = ({ gaps }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Exam Gap Analysis</h3>
      </div>

      <div className="space-y-3">
        {gaps.map((gap, idx) => (
          <div key={idx} className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex justify-between items-center">
            <div>
              <span className="font-bold text-xs text-amber-900">{gap.topic}</span>
              <p className="text-xs text-amber-700 mt-0.5">{gap.description}</p>
            </div>
            <span className="text-xs font-black text-amber-800 bg-amber-200 px-2 py-1 rounded-md">
              -{gap.impactScore} Impact
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
