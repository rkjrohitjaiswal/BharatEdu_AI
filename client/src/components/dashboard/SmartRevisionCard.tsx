import React, { useEffect, useState } from 'react';
import { ArrowRight, Clock, Flame, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchDailyRevisionQueue } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const SmartRevisionCard: React.FC = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.id) {
      fetchDailyRevisionQueue()
        .then((res) => {
          if (res.success && res.data) {
            setQueue(res.data);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  if (loading) {
    return <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse h-32" />;
  }

  const topItem = queue?.revisionItems?.[0];

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Smart Revision & Spaced Repetition</h3>
            <p className="text-[11px] text-slate-500 font-medium">Daily AI-scheduled revision items</p>
          </div>
        </div>

        <Link
          to="/revision"
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
        >
          <span>Revision Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 font-medium">Due Today</span>
          <div className="font-black text-sm text-slate-900">{queue?.totalDue || 0} items</div>
        </div>

        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
          <span className="text-[10px] text-red-600 font-medium">Critical</span>
          <div className="font-black text-sm text-red-700">{queue?.prioritySummary?.critical || 0} items</div>
        </div>

        <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
          <span className="text-[10px] text-indigo-600 font-medium">Est. Time</span>
          <div className="font-black text-sm text-indigo-700">{queue?.estimatedMinutes || 0} min</div>
        </div>
      </div>

      {topItem && (
        <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[9px] font-extrabold text-indigo-700 uppercase">Top Priority: {topItem.topic}</span>
            <p className="text-[11px] text-slate-600 font-medium line-clamp-1">{topItem.reason}</p>
          </div>

          <Link
            to="/revision"
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition shadow-sm shrink-0"
          >
            Start Revision
          </Link>
        </div>
      )}
    </div>
  );
};
