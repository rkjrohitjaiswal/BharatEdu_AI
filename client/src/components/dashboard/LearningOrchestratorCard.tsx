import React, { useEffect, useState } from 'react';
import { fetchStudentNextBestAction } from '../../services/api';
import { Compass, ArrowRight, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LearningOrchestratorCard: React.FC = () => {
  const [nextAction, setNextAction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetchStudentNextBestAction();
    if (res.success && res.data) {
      setNextAction(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/30 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2 text-yellow-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Orchestrator • Next Best Action</span>
          </div>
          <span className="bg-white/10 text-yellow-300 text-xs px-2.5 py-1 rounded-full border border-white/10 font-black">
            Feature 43
          </span>
        </div>

        {nextAction ? (
          <>
            <h3 className="text-xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              {nextAction.title}
            </h3>
            <p className="text-xs text-indigo-200 mb-4 line-clamp-2">{nextAction.reason}</p>

            <div className="flex items-center space-x-4 text-xs text-slate-300 mb-4">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-yellow-400" />
                <span>{nextAction.estimatedMinutes} Mins</span>
              </span>
              <span className="bg-white/10 text-indigo-200 px-2.5 py-0.5 rounded-full font-bold capitalize">
                {nextAction.priority} Priority
              </span>
            </div>
          </>
        ) : (
          <p className="text-xs text-indigo-200 mb-4">Central AI synthesis across all learning engines.</p>
        )}
      </div>

      <Link
        to="/orchestrator"
        className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
      >
        <span>Open Central Orchestrator</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
