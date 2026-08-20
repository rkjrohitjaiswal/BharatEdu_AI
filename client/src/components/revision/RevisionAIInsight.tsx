import React from 'react';
import { Sparkles } from 'lucide-react';

export interface RevisionAIInsightProps {
  advice?: string;
  summary?: any;
}

export const RevisionAIInsight: React.FC<RevisionAIInsightProps> = ({ advice, summary }) => {
  const text = advice || summary?.aiAdvice || summary?.aiExplanation || 'Focus on critical prerequisite concepts to maximize long-term retention.';

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white shadow-md flex items-start gap-3">
      <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 shrink-0">
        <Sparkles className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">AI Revision Coach Insight</h4>
        <p className="text-xs text-indigo-100/90 leading-relaxed mt-0.5">{text}</p>
      </div>
    </div>
  );
};
