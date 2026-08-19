import React from 'react';
import { Calendar } from 'lucide-react';

export interface IParentWeeklyPlanDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  activity: string;
  focusTopic: string;
}

export interface ParentWeeklySupportPlanProps {
  plan: IParentWeeklyPlanDay[];
  aiGenerated?: boolean;
}

export const ParentWeeklySupportPlan: React.FC<ParentWeeklySupportPlanProps> = ({ plan, aiGenerated }) => {
  if (!plan || plan.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-600" />
          <span>Weekly Parent Support Plan</span>
        </h3>
        {aiGenerated && (
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
            AI-generated guidance
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {plan.map((dayPlan, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-extrabold uppercase text-teal-700 block mb-1">
                {dayPlan.day}
              </span>
              <p className="text-xs text-slate-700 leading-snug font-medium">{dayPlan.activity}</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-semibold truncate">
              Focus: {dayPlan.focusTopic}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
