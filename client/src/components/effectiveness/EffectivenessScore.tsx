import React from 'react';
import { Award, CheckCircle2, TrendingUp } from 'lucide-react';

interface EffectivenessScoreProps {
  score: number;
  confidence: number;
  completionRate: number;
  improvementRate: number;
}

export const EffectivenessScore: React.FC<EffectivenessScoreProps> = ({
  score,
  confidence,
  completionRate,
  improvementRate,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white shadow-xl mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
        <div className="pt-2 md:pt-0">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Overall Effectiveness Index</div>
          <div className="text-3xl font-black text-emerald-400 flex items-center justify-center space-x-1">
            <span>{score}%</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{confidence}% Statistical Confidence</div>
        </div>

        <div className="pt-4 md:pt-0 md:pl-6">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Task Completion Rate</div>
          <div className="text-2xl font-extrabold text-white">{completionRate}%</div>
          <div className="text-[11px] text-indigo-300 mt-1">Actions Executed</div>
        </div>

        <div className="pt-4 md:pt-0 md:pl-6">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Measurable Improvement</div>
          <div className="text-2xl font-extrabold text-teal-300">{improvementRate}%</div>
          <div className="text-[11px] text-teal-400/80 mt-1">Mastery & Accuracy Gain</div>
        </div>

        <div className="pt-4 md:pt-0 md:pl-6">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Evidence Status</div>
          <div className="text-sm font-bold text-yellow-300 mt-2 flex items-center justify-center space-x-1">
            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
            <span>Sufficient Outcomes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
