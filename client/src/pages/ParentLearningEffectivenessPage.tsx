import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchParentChildEffectiveness } from '../services/api';
import { EffectivenessScore } from '../components/effectiveness/EffectivenessScore';

export const ParentLearningEffectivenessPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) loadData();
  }, [studentId]);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchParentChildEffectiveness(studentId || 'student_1');
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading Child Learning Effectiveness Report...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-gray-500">Failed to load child effectiveness data.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-extrabold">Child Learning Effectiveness Report</h1>
        <p className="text-xs text-teal-200 mt-1">Empirical progress and learning outcome measurement for your child.</p>
      </div>

      <EffectivenessScore
        score={data.overallEffectivenessScore}
        confidence={data.confidence}
        completionRate={data.completionRatePct}
        improvementRate={data.improvementRatePct}
      />
    </div>
  );
};
