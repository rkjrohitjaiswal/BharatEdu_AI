import React, { useEffect, useState } from 'react';
import { BarChart2, Users, Target, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAssessmentAnalytics } from '../services/api';
import { IAssessmentAnalyticsClient } from '../types/assessment';

export const AssessmentAnalyticsPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<IAssessmentAnalyticsClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assessmentId) {
      loadData();
    }
  }, [assessmentId]);

  const loadData = async () => {
    if (!assessmentId) return;
    setLoading(true);
    const res = await fetchAssessmentAnalytics(assessmentId);
    if (res.success && res.data) {
      setAnalytics(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading assessment analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-slate-400">Analytics unavailable.</p>
          <button
            onClick={() => navigate('/teacher/assessments')}
            className="py-2.5 px-5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl text-xs"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/teacher/assessments')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Teacher Assessments
            </button>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-purple-400" />
              {analytics.title} Analytics
            </h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center">
            <div className="text-2xl font-black text-purple-400">{analytics.totalSubmissions}</div>
            <div className="text-xs text-slate-400 font-medium">Submissions</div>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center">
            <div className="text-2xl font-black text-emerald-400">{analytics.classAverage}%</div>
            <div className="text-xs text-slate-400 font-medium">Class Average</div>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center">
            <div className="text-2xl font-black text-amber-400">{analytics.medianScore}</div>
            <div className="text-xs text-slate-400 font-medium">Median Score</div>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center">
            <div className="text-2xl font-black text-indigo-400">{analytics.completionRate}%</div>
            <div className="text-xs text-slate-400 font-medium">Completion Rate</div>
          </div>
        </div>

        {/* Question Performance */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Question Performance & Quality Alerts
          </h3>
          <div className="space-y-3">
            {analytics.questionPerformance.map((q, i) => (
              <div key={i} className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-200">Question #{q.questionNumber}</span>
                  <span className={q.successRate >= 60 ? 'text-emerald-400' : 'text-rose-400'}>
                    Success Rate: {q.successRate}% (Avg: {q.averageScore}/{q.maxMarks})
                  </span>
                </div>
                {q.flaggedQualityIssue && (
                  <div className="text-amber-400 flex items-center gap-1 font-medium mt-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{q.flaggedQualityIssue}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentAnalyticsPage;
