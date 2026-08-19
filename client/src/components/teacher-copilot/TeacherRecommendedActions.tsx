import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export interface TeacherRecommendedActionsProps {
  actions: any[];
  aiGenerated?: boolean;
}

export const TeacherRecommendedActions: React.FC<TeacherRecommendedActionsProps> = ({ actions, aiGenerated }) => {
  const navigate = useNavigate();
  if (!actions || actions.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Recommended Remediation Actions</span>
        </h3>
        {aiGenerated && (
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
            AI-generated recommendation
          </span>
        )}
      </div>

      <div className="space-y-3">
        {actions.map((act: any, idx: number) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-100 text-amber-800">
                {act.priority} PRIORITY
              </span>
              {act.targetUrl && (
                <button
                  onClick={() => navigate(act.targetUrl)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <span>Execute Action</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs font-semibold text-slate-900 leading-snug">{act.action}</p>
            <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/50">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Reason:</span>
                <span>{act.reason}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Evidence:</span>
                <span>{act.evidence}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
