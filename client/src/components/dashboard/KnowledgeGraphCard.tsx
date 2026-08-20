import React, { useEffect, useState } from 'react';
import { ArrowRight, GitBranch, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchStudentRootGaps } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const KnowledgeGraphCard: React.FC = () => {
  const { user } = useAuth();
  const [rootGaps, setRootGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.id) {
      fetchStudentRootGaps(user.id)
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setRootGaps(res.data);
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

  const topGap = rootGaps[0];

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Learning Map & Dependencies</h3>
            <p className="text-[11px] text-slate-500 font-medium">Concept readiness & root prerequisite gaps</p>
          </div>
        </div>

        <Link
          to="/knowledge-graph"
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
        >
          <span>View Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {topGap ? (
        <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-red-800 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Root Gap: {topGap.rootGapConceptName}
            </span>
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-red-100 text-red-700 border border-red-300">
              {topGap.severity} Severity
            </span>
          </div>

          <p className="text-[11px] text-slate-600 line-clamp-2">
            Affecting {topGap.affectedConceptsCount} downstream topic(s): {topGap.affectedConcepts?.join(', ')}
          </p>

          <Link
            to="/knowledge-graph"
            className="inline-flex items-center justify-center gap-1 w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] transition mt-2"
          >
            <span>Fix Prerequisite Gap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between">
          <span>All prerequisite paths are clear and healthy!</span>
          <Link to="/knowledge-graph" className="font-bold text-indigo-600 hover:underline">
            Explore Graph
          </Link>
        </div>
      )}
    </div>
  );
};
