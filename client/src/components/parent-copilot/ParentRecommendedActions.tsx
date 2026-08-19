import React from 'react';
import { HeartHandshake } from 'lucide-react';

export interface ParentRecommendedActionsProps {
  actions: any[];
  aiGenerated?: boolean;
}

export const ParentRecommendedActions: React.FC<ParentRecommendedActionsProps> = ({ actions, aiGenerated }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-teal-600" />
          <span>Recommended Home-Support Actions</span>
        </h3>
        {aiGenerated && (
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
            AI-generated guidance
          </span>
        )}
      </div>

      <div className="space-y-3">
        {actions.map((act: any, idx: number) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-teal-100 text-teal-800">
                {act.priority} PRIORITY
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-900 leading-snug">🌱 {act.parentAction}</p>
            <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/50">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Why this helps:</span>
                <span>{act.reason}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Current Insight:</span>
                <span>{act.evidence}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
