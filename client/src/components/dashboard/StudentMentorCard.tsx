import React, { useEffect, useState } from 'react';
import { ArrowRight, Bot, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchStudentMentorSummary } from '../../services/api';

export const StudentMentorCard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStudentMentorSummary()
      .then((res) => {
        if (res.success && res.data) setSummary(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse h-28" />
    );
  }

  if (!summary) return null;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shrink-0 mt-0.5">
          <Bot className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
              AI Success Mentor
            </span>
            <span className="text-xs font-bold text-amber-300">
              Success Score: {summary.successScore}/100
            </span>
          </div>
          <h4 className="font-bold text-sm text-white">Top Priority: {summary.topPriority}</h4>
          <p className="text-xs text-indigo-200 font-medium leading-snug">
            "{summary.encouragingMessage}" ({summary.recommendedStudyMinutes} min rec.)
          </p>
        </div>
      </div>

      <Link
        to="/mentor"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition shrink-0 self-start sm:self-center"
      >
        <span>Open AI Mentor</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
