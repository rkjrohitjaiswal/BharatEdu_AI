import React, { useEffect, useState } from 'react';
import { ArrowRight, BrainCircuit, Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTodayRevisionPlan } from '../../services/api';

export const RevisionCard: React.FC = () => {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTodayRevisionPlan()
      .then((res) => {
        if (res.success && res.data) {
          setPlan(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse h-32" />;
  }

  const tasks = plan?.priorityItems || plan?.tasks || [];
  if (tasks.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Smart Revision Due</h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {plan.totalDue} topics due today ({plan.totalOverdue} overdue)
            </p>
          </div>
        </div>

        <Link
          to="/revision"
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tasks.slice(0, 3).map((task: any, idx: number) => (
          <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {task.subject}
                </span>
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {task.estimatedMinutes} min
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{task.topic}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">💡 {task.reason}</p>
            </div>

            <Link
              to="/revision"
              className="inline-flex items-center justify-center gap-1 w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] transition mt-2"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Revise Now</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
