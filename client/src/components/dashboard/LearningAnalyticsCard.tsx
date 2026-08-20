import React, { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchStudentAnalyticsSummary } from '../../services/api';

export const LearningAnalyticsCard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStudentAnalyticsSummary()
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
          <BarChart3 className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Learning Analytics
            </span>
            <span className="text-xs font-semibold text-slate-500 capitalize flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Trend: {summary.masteryTrend}
            </span>
          </div>
          <h4 className="font-bold text-sm text-slate-900">
            Mastery: {summary.currentMastery}% | Accuracy: {summary.accuracy}% | Streak: {summary.streakDays} Days
          </h4>
          <p className="text-xs text-slate-500 font-medium">Top Priority: {summary.topPriorityTopic}</p>
        </div>
      </div>

      <Link
        to="/analytics"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition shrink-0 self-start sm:self-center"
      >
        <span>View Analytics</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
