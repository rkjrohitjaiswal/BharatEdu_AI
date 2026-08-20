import React from 'react';
import { Sparkles } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  insight: IClassroomIntelligenceClient['aiInsight'];
}

export const ClassroomAIInsight: React.FC<Props> = ({ insight }) => {
  return (
    <div className="p-6 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/60 border border-purple-500/30 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          AI Classroom Executive Insight
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/40">
          {insight.generatedByAI ? 'Assistive AI' : 'Deterministic Fallback'}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="font-bold text-slate-100 text-sm">{insight.headline}</div>
        <p className="text-slate-300 leading-relaxed">{insight.summary}</p>
      </div>

      {insight.recommendedFocus && insight.recommendedFocus.length > 0 && (
        <div className="pt-2 border-t border-purple-500/20 space-y-1 text-xs">
          <div className="font-semibold text-purple-300">Recommended Executive Focus:</div>
          {insight.recommendedFocus.map((f, i) => (
            <div key={i} className="text-slate-300 flex items-center gap-1.5">
              <span className="text-purple-400">•</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassroomAIInsight;
