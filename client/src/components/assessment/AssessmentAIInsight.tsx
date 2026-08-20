import React from 'react';
import { Bot } from 'lucide-react';

interface Props {
  insight?: {
    overallPerformance: string;
    keyStrengths: string[];
    keyGaps: string[];
    aiCoachAdvice: string;
  };
}

export const AssessmentAIInsight: React.FC<Props> = ({ insight }) => {
  return (
    <div className="p-6 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/60 border border-purple-500/30 rounded-3xl space-y-3 text-xs">
      <div className="flex items-center gap-2">
        <Bot className="w-5 h-5 text-purple-400" />
        <h3 className="text-sm font-bold text-white">AI Coach Insights</h3>
      </div>
      <p className="text-slate-300 leading-relaxed">
        {insight?.aiCoachAdvice || 'Your server-evaluated assessment scores reflect your verified concept mastery. Continue following your diagnostic practice plan.'}
      </p>
    </div>
  );
};

export default AssessmentAIInsight;
