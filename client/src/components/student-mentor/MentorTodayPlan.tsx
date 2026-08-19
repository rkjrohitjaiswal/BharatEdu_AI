import React from 'react';
import { ArrowRight, Clock, Sun, Sunset, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface IMentorTask {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  estimatedMinutes: number;
  reason: string;
  actionUrl: string;
}

export interface MentorTodayPlanProps {
  plan: {
    morning: IMentorTask[];
    afternoon: IMentorTask[];
    evening: IMentorTask[];
    totalEstimatedMinutes: number;
    availableDailyMinutes: number;
  };
}

export const MentorTodayPlan: React.FC<MentorTodayPlanProps> = ({ plan }) => {
  if (!plan) return null;

  const renderSection = (title: string, icon: React.ReactNode, tasks: IMentorTask[]) => {
    if (tasks.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          {icon} {title}
        </h4>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-100 text-indigo-800">
                    {task.priority}
                  </span>
                  <h5 className="font-bold text-slate-900 text-xs">{task.title}</h5>
                </div>
                <p className="text-xs text-slate-600 font-medium">{task.description}</p>
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {task.estimatedMinutes} min
                  </span>
                  <span>• {task.reason}</span>
                </div>
              </div>

              <Link
                to={task.actionUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shrink-0 self-start sm:self-center transition"
              >
                <span>Start Task</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Today's Mentor Plan</h3>
          <p className="text-xs text-slate-500">
            Total estimated time: {plan.totalEstimatedMinutes} min (Daily limit: {plan.availableDailyMinutes} min)
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {renderSection('Morning Session', <Sun className="w-4 h-4 text-amber-500" />, plan.morning)}
        {renderSection('Afternoon Session', <Sunset className="w-4 h-4 text-orange-500" />, plan.afternoon)}
        {renderSection('Evening Session', <Moon className="w-4 h-4 text-indigo-500" />, plan.evening)}
      </div>
    </div>
  );
};
