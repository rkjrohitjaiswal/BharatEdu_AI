import React from 'react';
import { Sparkles } from 'lucide-react';

interface ResourceAIInsightProps {
  coach: {
    headline: string;
    explanation: string;
    prerequisiteTip: string;
    nextStepAdvice: string;
  };
}

export const ResourceAIInsight: React.FC<ResourceAIInsightProps> = ({ coach }) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-5 border border-purple-150 shadow-sm mb-6">
      <div className="flex items-center space-x-2 text-purple-700 font-bold text-xs uppercase tracking-wider mb-2">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <span>AI Resource Coach Insight</span>
      </div>

      <h4 className="text-base font-extrabold text-gray-900 mb-2">{coach.headline}</h4>
      <p className="text-xs text-gray-700 mb-3">{coach.explanation}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-purple-100">
        <div>
          <div className="font-bold text-purple-900 mb-0.5">Prerequisite Advice:</div>
          <div className="text-gray-600">{coach.prerequisiteTip}</div>
        </div>
        <div>
          <div className="font-bold text-indigo-900 mb-0.5">Recommended Next Action:</div>
          <div className="text-gray-600">{coach.nextStepAdvice}</div>
        </div>
      </div>
    </div>
  );
};
