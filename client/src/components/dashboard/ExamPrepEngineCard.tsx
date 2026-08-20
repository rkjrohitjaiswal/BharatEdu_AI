import React, { useEffect, useState } from 'react';
import { fetchStudentExamPreparation } from '../../services/api';
import { Target, ArrowRight, Gauge, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExamPrepEngineCard: React.FC = () => {
  const [prepData, setPrepData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetchStudentExamPreparation();
    if (res.success && res.data) {
      setPrepData(res.data);
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

  const { readiness, profile, plan } = prepData || {};
  const score = readiness?.readinessScore || 68;
  const days = readiness?.daysRemaining || 30;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-700/50 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4 text-indigo-400" />
            <span>AI Exam Preparation Hub</span>
          </div>
          <span className="bg-white/10 text-indigo-200 text-xs px-2.5 py-1 rounded-full border border-white/10 font-bold">
            Feature 41
          </span>
        </div>

        <h3 className="text-xl font-extrabold tracking-tight text-white mb-1">
          {profile?.examName || 'Class 10 CBSE Board Exam'}
        </h3>
        <p className="text-xs text-indigo-200 mb-4">Target Score: {plan?.targetScore || 90}%</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex items-center space-x-3">
            <Gauge className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-indigo-200 font-medium">Readiness</div>
              <div className="text-lg font-black text-white">{score}%</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex items-center space-x-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] text-indigo-200 font-medium">Remaining</div>
              <div className="text-lg font-black text-white">{days} Days</div>
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/exam-preparation"
        className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
      >
        <span>Open Readiness Roadmap</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
