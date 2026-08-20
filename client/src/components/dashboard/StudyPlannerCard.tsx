import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchStudyPlannerSummary } from '../../services/api';

export const StudyPlannerCard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStudyPlannerSummary()
      .then((res) => {
        if (res.success && res.data) setSummary(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse h-28" />;
  }

  if (!summary) return null;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              AI Study Planner
            </span>
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" /> {summary.completedMinutes}/{summary.plannedMinutes} min ({summary.completionPercent}%)
            </span>
          </div>

          <h4 className="font-bold text-sm text-slate-900">
            🎯 Priority: {summary.topPriority}
          </h4>

          {summary.nextTask ? (
            <p className="text-xs text-slate-500 font-medium">
              Next Task: <span className="font-bold text-slate-700">{summary.nextTask.title}</span> ({summary.nextTask.estimatedMinutes} min)
            </p>
          ) : (
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All planned tasks completed for today!
            </p>
          )}
        </div>
      </div>

      <Link
        to="/study-planner"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition shrink-0 self-start sm:self-center"
      >
        <span>Open Planner</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
