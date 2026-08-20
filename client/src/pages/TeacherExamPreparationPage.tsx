import React, { useEffect, useState } from 'react';
import { fetchTeacherExamOverview } from '../services/api';
import { Users, Gauge, AlertCircle, Sparkles } from 'lucide-react';

export const TeacherExamPreparationPage: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    setLoading(true);
    const res = await fetchTeacherExamOverview();
    if (res.success && res.data) {
      setOverview(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading Class Exam Preparation Intelligence...</span>
      </div>
    );
  }

  const { classReadinessAvg = 72, totalStudents = 35, highRiskStudentsCount = 4 } = overview || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-extrabold">Teacher Exam Preparation Intelligence</h1>
        <p className="text-xs text-blue-200 mt-1">Class-wide exam readiness analytics and risk interventions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Average Class Readiness</div>
            <div className="text-2xl font-black text-gray-900">{classReadinessAvg}%</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Total Preparing Students</div>
            <div className="text-2xl font-black text-gray-900">{totalStudents}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">High Risk Students</div>
            <div className="text-2xl font-black text-red-600">{highRiskStudentsCount}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Class Weak Concepts & Focus Areas</h3>
        <div className="space-y-3">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-amber-900">Quadratic Equations (Algebra)</span>
              <div className="text-amber-700 mt-0.5">12 students struggling with word problem formulations.</div>
            </div>
            <button className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700">
              Assign Mock Test
            </button>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-amber-900">Light - Refraction & Lenses</span>
              <div className="text-amber-700 mt-0.5">9 students showing sign convention ray diagram errors.</div>
            </div>
            <button className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700">
              Assign Mock Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
