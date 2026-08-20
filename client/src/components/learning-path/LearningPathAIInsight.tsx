import React from 'react';
import { Sparkles } from 'lucide-react';

export interface LearningPathAIInsightProps {
  description: string;
}

export const LearningPathAIInsight: React.FC<LearningPathAIInsightProps> = ({ description }) => {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-md flex items-start gap-3 border border-indigo-800/40">
      <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 shrink-0">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="space-y-0.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">AI Curriculum Coach Insight</h4>
        <p className="text-xs text-indigo-100/90 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
