import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart3, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchParentStudentAnalytics, fetchStudentAnalytics, fetchTeacherAnalytics } from '../services/api';
import { StudentAnalyticsView } from '../components/analytics/StudentAnalyticsView';
import { TeacherAnalyticsView } from '../components/analytics/TeacherAnalyticsView';
import { ParentAnalyticsView } from '../components/analytics/ParentAnalyticsView';

import { LearningAnalyticsPage } from './LearningAnalyticsPage';

export const AnalyticsDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { studentId } = useParams<{ studentId?: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  if (user?.role === 'student') {
    return <LearningAnalyticsPage />;
  }

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      if (user?.role === 'teacher') {
        const res = await fetchTeacherAnalytics();
        if (res.success) setData(res.data);
        else setError(res.message || 'Failed to load teacher analytics');
      } else if (user?.role === 'parent') {
        if (!studentId) {
          setError('No student specified for parent analytics report');
          setLoading(false);
          return;
        }
        const res = await fetchParentStudentAnalytics(studentId);
        if (res.success) setData(res.data);
        else setError(res.message || 'Failed to load parent student analytics');
      } else {
        const res = await fetchStudentAnalytics();
        if (res.success) setData(res.data);
        else setError(res.message || 'Failed to load student analytics');
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading analytics dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [user?.role, studentId]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Learning Analytics & Insights</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic progress metrics, early warning risk indicators, and AI weekly summaries.
            </p>
          </div>
        </div>

        <button
          onClick={loadAnalytics}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Generating real-time learning analytics...</div>
      ) : user?.role === 'teacher' ? (
        <TeacherAnalyticsView data={data} />
      ) : user?.role === 'parent' ? (
        <ParentAnalyticsView data={data} />
      ) : (
        <StudentAnalyticsView data={data} />
      )}
    </div>
  );
};
export default AnalyticsDashboardPage;
