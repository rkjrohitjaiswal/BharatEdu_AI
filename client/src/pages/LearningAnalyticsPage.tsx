import React, { useEffect, useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import {
  fetchStudentAnalyticsAdvice,
  fetchStudentAnalyticsOverview,
  fetchStudentAnalyticsPractice,
  fetchStudentAnalyticsSubjects,
  fetchStudentAnalyticsTopics,
  fetchStudentAnalyticsWeekly,
} from '../services/api';
import { AnalyticsOverview } from '../components/learning-analytics/AnalyticsOverview';
import { ProgressTrendCard } from '../components/learning-analytics/ProgressTrendCard';
import { SubjectAnalytics } from '../components/learning-analytics/SubjectAnalytics';
import { TopicAnalytics } from '../components/learning-analytics/TopicAnalytics';
import { PracticeAnalytics } from '../components/learning-analytics/PracticeAnalytics';
import { ConsistencyScore } from '../components/learning-analytics/ConsistencyScore';
import { LearningGapProgress } from '../components/learning-analytics/LearningGapProgress';
import { GoalAnalytics } from '../components/learning-analytics/GoalAnalytics';
import { ExamReadinessTrend } from '../components/learning-analytics/ExamReadinessTrend';
import { RiskTrend } from '../components/learning-analytics/RiskTrend';
import { WeeklyLearningReport } from '../components/learning-analytics/WeeklyLearningReport';
import { AnalyticsAIInsight } from '../components/learning-analytics/AnalyticsAIInsight';

export const LearningAnalyticsPage: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [practice, setPractice] = useState<any>(null);
  const [weekly, setWeekly] = useState<any>(null);
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [ovRes, subRes, topRes, pracRes, weekRes, advRes] = await Promise.all([
        fetchStudentAnalyticsOverview(),
        fetchStudentAnalyticsSubjects(),
        fetchStudentAnalyticsTopics(),
        fetchStudentAnalyticsPractice(),
        fetchStudentAnalyticsWeekly(),
        fetchStudentAnalyticsAdvice(),
      ]);

      if (ovRes.success) setOverview(ovRes.data);
      else setError(ovRes.message || 'Failed to load analytics overview');

      if (subRes.success) setSubjects(subRes.data?.subjects || []);
      if (topRes.success) setTopics(topRes.data?.topics || []);
      if (pracRes.success) setPractice(pracRes.data?.practice);
      if (weekRes.success) setWeekly(weekRes.data);
      if (advRes.success) setAdvice(advRes.data);
    } catch (err: any) {
      setError(err?.message || 'Error loading student learning analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Learning Analytics</h1>
            <p className="text-xs text-slate-500 mt-0.5">Authoritative progress insights and performance trends</p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition"
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
        <div className="p-12 text-center text-slate-500 text-sm">Loading learning analytics & performance trends...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProgressTrendCard
              trend={overview?.overallProgress?.masteryTrend || 'insufficient_data'}
              title="Overall Mastery Trend"
              masteryScore={overview?.overallProgress?.currentMastery}
            />
            <ConsistencyScore consistency={overview?.consistency} />
          </div>

          <AnalyticsOverview overview={overview?.overallProgress} />

          <SubjectAnalytics subjects={subjects} />

          <TopicAnalytics topics={topics} />

          <PracticeAnalytics practice={practice} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LearningGapProgress gapProgress={weekly?.learningGapProgress} />
            <GoalAnalytics goalAnalytics={weekly?.goalAnalytics} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExamReadinessTrend examReadiness={weekly?.examReadinessTrend} />
            <RiskTrend riskAnalytics={overview?.riskAnalytics} />
          </div>

          <WeeklyLearningReport report={weekly?.weeklyReport} />

          <AnalyticsAIInsight advice={advice} />
        </div>
      )}
    </div>
  );
};

export default LearningAnalyticsPage;
