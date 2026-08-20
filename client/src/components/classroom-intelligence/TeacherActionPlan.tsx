import React from 'react';
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  plan: IClassroomIntelligenceClient['actionPlan'];
}

export const TeacherActionPlan: React.FC<Props> = ({ plan }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-5">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <Calendar className="w-5 h-5 text-purple-400" />
        Teacher Daily & Weekly Action Plan
      </h3>

      <div className="space-y-4 text-xs">
        <div>
          <h4 className="font-bold text-purple-300 mb-2 uppercase tracking-wider">Today's Priorities</h4>
          <div className="space-y-1.5">
            {plan.todayPriorities.map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span className="text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-indigo-300 mb-2 uppercase tracking-wider">This Week's Focus</h4>
          <div className="space-y-1.5">
            {plan.thisWeekPriorities.map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherActionPlan;
