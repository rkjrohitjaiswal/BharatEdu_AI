import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchParentChildOrchestrator } from '../services/api';
import { ShieldCheck, Compass } from 'lucide-react';
import { DailyActionPlan } from '../components/orchestrator/DailyActionPlan';
import { NextBestAction } from '../components/orchestrator/NextBestAction';

export const ParentOrchestratorPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) loadChildPlan();
  }, [studentId]);

  const loadChildPlan = async () => {
    setLoading(true);
    const res = await fetchParentChildOrchestrator(studentId || 'student_1');
    if (res.success && res.data) {
      setPlan(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading Child Orchestrator Plan...</span>
      </div>
    );
  }

  if (!plan) {
    return <div className="p-8 text-center text-gray-500">Failed to load child orchestrator plan.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-teal-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Parent Portal Access • Verified Student Link</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold">Child Unified Learning Action Plan</h1>
      </div>

      {plan.nextBestAction && <NextBestAction action={plan.nextBestAction} />}

      {plan.dailyPlan && <DailyActionPlan dailyPlan={plan.dailyPlan} />}
    </div>
  );
};
