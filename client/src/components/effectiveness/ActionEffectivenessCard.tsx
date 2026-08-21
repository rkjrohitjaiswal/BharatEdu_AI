import React from 'react';
import { IActionEffectivenessMetricsClient } from '../../types/learning-effectiveness';
import { CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

interface ActionEffectivenessCardProps {
  metric: IActionEffectivenessMetricsClient;
}

export const ActionEffectivenessCard: React.FC<ActionEffectivenessCardProps> = ({ metric }) => {
  const isStrong = metric.effectivenessScore >= 75;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="font-extrabold text-sm text-gray-900 capitalize">
            {metric.actionType.replace('_', ' ')}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isStrong ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {metric.effectivenessScore}% Score
          </span>
        </div>

        <div className="text-xs text-gray-500 space-y-1 mb-3">
          <div className="flex justify-between">
            <span>Completions:</span>
            <span className="font-bold text-gray-800">{metric.completions} / {metric.attempts} ({metric.completionRatePct}%)</span>
          </div>
          <div className="flex justify-between">
            <span>Measurable Improvements:</span>
            <span className="font-bold text-emerald-600">{metric.measurableImprovements}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-600 flex items-center justify-between">
        <span className="capitalize text-indigo-600 font-semibold">{metric.evidenceLevel.replace('_', ' ')}</span>
        <span>{metric.avgActualMinutes}m avg</span>
      </div>
    </div>
  );
};
