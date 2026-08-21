import React, { useEffect, useState } from 'react';
import { fetchTeacherOrchestrator } from '../services/api';
import { Compass, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const TeacherOrchestratorPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchTeacherOrchestrator();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading Teacher Class Intelligence Orchestrator...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-extrabold">Teacher Classroom Orchestration Intelligence</h1>
        <p className="text-xs text-indigo-200 mt-1">Aggregated class blockers, critical risk alerts, and recommended interventions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400 font-bold uppercase">Active Class Students</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{data?.totalStudents || 32}</div>
        </div>
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm">
          <div className="text-xs text-amber-800 font-bold uppercase">High Priority Risk</div>
          <div className="text-2xl font-black text-amber-900 mt-1">{data?.highPriorityStudents || 5}</div>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm">
          <div className="text-xs text-red-800 font-bold uppercase">Critical Interventions</div>
          <div className="text-2xl font-black text-red-900 mt-1">{data?.criticalStudents || 2}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Classwide Blockers & Weak Concepts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="font-bold text-gray-900 text-sm mb-1">Primary Class Blocker</div>
            <div className="text-indigo-600 font-semibold">{data?.commonBlocker}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="font-bold text-gray-900 text-sm mb-1">Common Weak Concept</div>
            <div className="text-purple-600 font-semibold">{data?.commonWeakConcept}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
