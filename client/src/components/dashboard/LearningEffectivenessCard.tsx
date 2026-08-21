import React, { useEffect, useState } from 'react';
import { fetchEffectivenessRecommendations } from '../../services/api';
import { TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LearningEffectivenessCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetchEffectivenessRecommendations();
    if (res.success && res.data) {
      setData(res.data);
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
    <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-500/30 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>What's Working For You?</span>
          </div>
          <span className="bg-white/10 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-white/10 font-black">
            Feature 44
          </span>
        </div>

        <h3 className="text-lg font-extrabold tracking-tight text-white mb-2 leading-tight">
          {data?.strongestInterventions?.[0] ? `${data.strongestInterventions[0]} appears associated with higher mastery retention.` : 'Practice & AI Doubt Solver are showing strong positive outcomes.'}
        </h3>
        <p className="text-xs text-teal-200 mb-4">Empirical outcome measurement comparing completed tasks to actual learning gains.</p>
      </div>

      <Link
        to="/learning-effectiveness"
        className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
      >
        <span>View Effectiveness Analytics</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
