import React, { useEffect, useState } from 'react';
import { fetchTeacherEffectiveness } from '../services/api';

export const TeacherLearningEffectivenessPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchTeacherEffectiveness();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading Teacher Effectiveness Analytics...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-extrabold">Teacher Cohort Learning Effectiveness</h1>
        <p className="text-xs text-teal-200 mt-1">Aggregated intervention effectiveness and assessment transfer rates for Class 10-A.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400 font-bold uppercase">Class Effectiveness Score</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{data?.overallEffectivenessScore || 78}%</div>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="text-xs text-emerald-800 font-bold uppercase">Most Effective Approach</div>
          <div className="text-lg font-black text-emerald-900 mt-1">{data?.mostEffectiveIntervention}</div>
        </div>
        <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 shadow-sm">
          <div className="text-xs text-indigo-800 font-bold uppercase">Highest Assessment Transfer</div>
          <div className="text-lg font-black text-indigo-900 mt-1">{data?.highestTransferAction}</div>
        </div>
      </div>
    </div>
  );
};
