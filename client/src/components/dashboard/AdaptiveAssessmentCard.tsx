import React, { useEffect, useState } from 'react';
import { ArrowRight, Clock, Target, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createAdaptiveAssessment, fetchStudentRootGaps } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdaptiveAssessmentCard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rootGap, setRootGap] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [starting, setStarting] = useState<boolean>(false);

  useEffect(() => {
    if (user?.id) {
      fetchStudentRootGaps(user.id)
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setRootGap(res.data[0]);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const handleStart = async () => {
    setStarting(true);
    try {
      const targetId = rootGap ? rootGap.rootGapConceptId : 'math_linear_eq';
      const res = await createAdaptiveAssessment(targetId, 'adaptive_practice', 5);
      if (res.success && res.data?.assessmentId) {
        navigate('/adaptive-assessment', { state: { assessmentId: res.data.assessmentId } });
      } else {
        navigate('/adaptive-assessment');
      }
    } catch (err) {
      navigate('/adaptive-assessment');
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse h-32" />;
  }

  const conceptName = rootGap ? rootGap.rootGapConceptName : 'Linear Equations in Two Variables';
  const reason = rootGap
    ? `Prerequisite gap affecting ${rootGap.affectedConceptsCount} topic(s)`
    : 'Foundational topic practice for maximum concept readiness';

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Adaptive Assessment</h3>
            <p className="text-[11px] text-slate-500 font-medium">Real-time difficulty adaptation engine</p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
          <Zap className="w-3 h-3" /> Adaptive
        </span>
      </div>

      <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-purple-950">Recommended Target: {conceptName}</span>
          <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-white text-purple-700 border border-purple-200">
            Easy Difficulty
          </span>
        </div>

        <p className="text-[11px] text-purple-800 font-medium">{reason}</p>

        <div className="flex items-center justify-between pt-1 border-t border-purple-200/60 text-[11px] text-slate-600">
          <span className="flex items-center gap-1 font-semibold">
            <Clock className="w-3.5 h-3.5 text-purple-600" /> Est. Time: 10 minutes
          </span>
          <span className="font-semibold text-purple-700">5 Adaptive Questions</span>
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={starting}
        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
      >
        <span>{starting ? 'Initializing...' : 'Start Assessment'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
