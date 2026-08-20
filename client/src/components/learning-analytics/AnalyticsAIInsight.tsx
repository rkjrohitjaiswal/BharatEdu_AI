import React from 'react';
import { Sparkles } from 'lucide-react';

export interface AnalyticsAIInsightProps {
  advice: any;
}

export const AnalyticsAIInsight: React.FC<AnalyticsAIInsightProps> = ({ advice }) => {
  if (!advice) return null;

  const {
    naturalLanguageSummary = 'Overall performance data analyzed.',
    trendExplanation = '',
    encouragingFeedback = '',
    studyStrategy = '',
    aiGenerated = false,
  } = advice;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-white">AI Progress Insights</h3>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
          {aiGenerated ? 'AI-generated explanation' : 'Deterministic Explanation'}
        </span>
      </div>

      <p className="text-sm text-indigo-100 font-semibold leading-relaxed">{naturalLanguageSummary}</p>
      {trendExplanation && <p className="text-xs text-slate-300">{trendExplanation}</p>}

      <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {encouragingFeedback && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="font-bold text-indigo-200 block mb-1">Encouragement:</span>
            <span className="text-slate-300">{encouragingFeedback}</span>
          </div>
        )}
        {studyStrategy && (
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span className="font-bold text-purple-200 block mb-1">Strategy Recommendation:</span>
            <span className="text-slate-300">{studyStrategy}</span>
          </div>
        )}
      </div>
    </div>
  );
};
