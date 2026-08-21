import React, { useEffect, useState } from 'react';
import { fetchStudentEffectiveness, refreshStudentEffectiveness } from '../services/api';
import { EffectivenessHeader } from '../components/effectiveness/EffectivenessHeader';
import { EffectivenessScore } from '../components/effectiveness/EffectivenessScore';
import { ActionEffectivenessCard } from '../components/effectiveness/ActionEffectivenessCard';
import { Sparkles, Award } from 'lucide-react';

export const LearningEffectivenessPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchStudentEffectiveness();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const res = await refreshStudentEffectiveness();
    if (res.success && res.data) {
      setData(res.data);
    }
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading AI Learning Effectiveness Analytics...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-gray-500">Failed to load learning effectiveness data.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EffectivenessHeader onRefresh={handleRefresh} isRefreshing={refreshing} />

      <EffectivenessScore
        score={data.overallEffectivenessScore}
        confidence={data.confidence}
        completionRate={data.completionRatePct}
        improvementRate={data.improvementRatePct}
      />

      {/* Action Effectiveness Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
          Intervention Type Effectiveness Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.actionMetrics?.map((metric: any, idx: number) => (
            <ActionEffectivenessCard key={idx} metric={metric} />
          ))}
        </div>
      </div>

      {/* Concept Observed Associations */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
          Concept Improvement Associations
        </h3>
        <div className="space-y-3">
          {data.conceptAssociations?.map((assoc: any, idx: number) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs flex justify-between items-center">
              <div>
                <div className="font-bold text-gray-900 text-sm mb-0.5">{assoc.topic}</div>
                <div className="text-gray-600">{assoc.summaryText}</div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-[11px]">
                +{assoc.observedDelta}% Mastery
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
