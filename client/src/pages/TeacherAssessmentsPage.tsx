import React, { useEffect, useState } from 'react';
import { fetchTeacherAssessmentEngineList, fetchTeacherAssessmentEngineAnalytics } from '../services/api';
import { IAssessmentClient, IAssessmentAnalyticsClient } from '../types/assessment-engine';
import { Link } from 'react-router-dom';
import { Award, Plus, BarChart3, Users, CheckCircle2 } from 'lucide-react';

export const TeacherAssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<IAssessmentClient[]>([]);
  const [analytics, setAnalytics] = useState<IAssessmentAnalyticsClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const resList = await fetchTeacherAssessmentEngineList();
    if (resList.success && resList.data) {
      setAssessments(resList.data);
      if (resList.data.length > 0) {
        const resAna = await fetchTeacherAssessmentEngineAnalytics(resList.data[0].assessmentId);
        if (resAna.success && resAna.data) setAnalytics(resAna.data);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading Teacher Assessment Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 md:p-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Teacher Assessment Management</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">AI Assessment & Diagnostic Engine</h1>
            <p className="text-xs text-slate-400">Create, validate, publish, and monitor curriculum-aligned assessment performance.</p>
          </div>

          <Link
            to="/teacher/assessments/create"
            className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-950/40"
          >
            <Plus className="w-4 h-4" /> Create AI Assessment
          </Link>
        </div>

        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-slate-400 font-semibold">Total Attempts</div>
              <div className="text-2xl font-black text-white">{analytics.totalAttempts}</div>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-slate-400 font-semibold">Class Average Score</div>
              <div className="text-2xl font-black text-purple-400">{analytics.averageScore}%</div>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-slate-400 font-semibold">Completion Rate</div>
              <div className="text-2xl font-black text-emerald-400">{analytics.completionRate}%</div>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-slate-400 font-semibold">Average Accuracy</div>
              <div className="text-2xl font-black text-indigo-400">{analytics.averageAccuracy}%</div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Classroom Assessments Catalog</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assessments.map((a) => (
              <div key={a.assessmentId} className="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                    {a.subject} • {a.assessmentType}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {a.status}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{a.title}</h4>
                <p className="text-slate-400 line-clamp-2">{a.description}</p>
                <div className="pt-2 flex items-center justify-between text-slate-400 text-[11px]">
                  <span>{a.totalQuestions} Qs • {a.durationMinutes} mins</span>
                  <span className="text-purple-300 font-bold">Source: {a.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssessmentsPage;
