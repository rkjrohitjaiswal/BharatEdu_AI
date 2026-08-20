import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ExamImprovementPlanProps {
  prediction: {
    expectedScoreRange: { min: number; max: number };
    readinessPercentage: number;
    disclaimer: string;
    improvementPath: string[];
  };
}

export const ExamImprovementPlan: React.FC<ExamImprovementPlanProps> = ({ prediction }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-emerald-600" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Score Improvement Projection</h3>
      </div>

      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-emerald-700 font-medium">Estimated Performance Band</div>
          <div className="text-2xl font-black text-emerald-900 mt-0.5">
            {prediction.expectedScoreRange.min}% – {prediction.expectedScoreRange.max}%
          </div>
        </div>
        <div className="text-[10px] text-emerald-600 max-w-[200px] text-right italic">{prediction.disclaimer}</div>
      </div>

      <div className="text-xs font-bold text-gray-800 mb-2">Grounded Action Steps to Achieve Upper Band:</div>
      <ul className="space-y-2 text-xs text-gray-600">
        {prediction.improvementPath.map((step, idx) => (
          <li key={idx} className="flex items-start space-x-2">
            <span className="text-emerald-500 font-bold">•</span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
