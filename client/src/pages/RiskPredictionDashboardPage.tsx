import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RefreshCw, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchParentStudentRiskSummary, fetchStudentRiskProfile, fetchTeacherRiskAnalytics } from '../services/api';
import { StudentRiskView } from '../components/risk/StudentRiskView';
import { TeacherRiskView } from '../components/risk/TeacherRiskView';
import { ParentRiskView } from '../components/risk/ParentRiskView';

export const RiskPredictionDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { studentId } = useParams<{ studentId?: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadRiskProfile = async () => {
    setLoading(true);
    setError('');
    try {
      if (user?.role === 'teacher') {
        const res = await fetchTeacherRiskAnalytics();
        if (res.success) setData(res.data);
        else setError(res.message || 'Failed to load teacher class risk analytics');
      } else if (user?.role === 'parent') {
        if (!studentId) {
          setError('No student specified for parent risk report');
          setLoading(false);
          return;
        }
        const res = await fetchParentStudentRiskSummary(studentId);
        if (res.success) setData(res.data);
        else setError(res.message || 'Failed to load parent student risk summary');
      } else {
        const res = await fetchStudentRiskProfile();
        if (res.success) setData(res.data);
        else setError(res.message || 'Failed to load student risk profile');
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading risk prediction dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRiskProfile();
  }, [user?.role, studentId]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Early-Warning & Risk Prediction</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Authoritative risk scores (0–100), explainable factors, and recommended recovery actions.
            </p>
          </div>
        </div>

        <button
          onClick={loadRiskProfile}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Evaluate Risk</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Evaluating early-warning risk indicators...</div>
      ) : user?.role === 'teacher' ? (
        <TeacherRiskView data={data} />
      ) : user?.role === 'parent' ? (
        <ParentRiskView data={data} />
      ) : (
        <StudentRiskView data={data} />
      )}
    </div>
  );
};
export default RiskPredictionDashboardPage;
