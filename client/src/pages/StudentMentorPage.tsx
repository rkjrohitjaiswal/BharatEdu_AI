import React, { useEffect, useState } from 'react';
import { Bot, RefreshCw } from 'lucide-react';
import {
  fetchStudentMentorAdvice,
  fetchStudentMentorPlan,
  fetchStudentMentorSummary,
  fetchStudentMentorToday,
} from '../services/api';
import { MentorWelcome } from '../components/student-mentor/MentorWelcome';
import { MentorSuccessScore } from '../components/student-mentor/MentorSuccessScore';
import { MentorTodayPlan } from '../components/student-mentor/MentorTodayPlan';
import { MentorPriorityCard } from '../components/student-mentor/MentorPriorityCard';
import { MentorProgressSummary } from '../components/student-mentor/MentorProgressSummary';
import { MentorGoalProgress } from '../components/student-mentor/MentorGoalProgress';
import { MentorRiskSummary } from '../components/student-mentor/MentorRiskSummary';
import { MentorExamSummary } from '../components/student-mentor/MentorExamSummary';
import { MentorMotivation } from '../components/student-mentor/MentorMotivation';

export const StudentMentorPage: React.FC = () => {
  const [snapshot, setSnapshot] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [advice, setAdvice] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [todayRes, planRes, adviceRes, summaryRes] = await Promise.all([
        fetchStudentMentorToday(),
        fetchStudentMentorPlan(),
        fetchStudentMentorAdvice(),
        fetchStudentMentorSummary(),
      ]);

      if (todayRes.success) setSnapshot(todayRes.data);
      else setError(todayRes.message || 'Failed to load today\'s mentor data');

      if (planRes.success) setPlan(planRes.data);
      if (adviceRes.success) setAdvice(adviceRes.data);
      if (summaryRes.success) setSummary(summaryRes.data);
    } catch (err: any) {
      setError(err?.message || 'Error loading mentor companion data');
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
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Success Mentor</h1>
            <p className="text-xs text-slate-500 mt-0.5">Your Personal Daily Learning Companion</p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Companion</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading your daily mentor companion...</div>
      ) : (
        <div className="space-y-6">
          <MentorWelcome
            greeting={advice?.greeting || `Good morning, ${snapshot?.studentName || 'Student'} 👋`}
            topPriorityMessage={advice?.topPriorityMessage || 'Your biggest priority today is focused practice.'}
            encouragingMessage={advice?.encouragingMessage || summary?.encouragingMessage || 'Keep up the great work!'}
            aiGenerated={advice?.aiGenerated}
          />

          {summary?.nextRecommendedAction && (
            <MentorPriorityCard task={summary.nextRecommendedAction} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MentorProgressSummary snapshot={snapshot} />
              <MentorTodayPlan plan={plan} />
            </div>

            <div className="space-y-6">
              <MentorSuccessScore
                score={summary?.successScore || 0}
                explanation="Score derived from planned tasks completed, practice accuracy, adherence, and goals progress."
              />
              <MentorRiskSummary
                riskLevel={snapshot?.riskLevel}
                recoveryActions={snapshot?.recoveryActions || []}
              />
              <MentorExamSummary examStatus={snapshot?.examStatus} />
              <MentorGoalProgress goals={snapshot?.activeGoals} />
              <MentorMotivation
                strategy={advice?.studyStrategy || 'Start with a 10-minute mistake review, followed by adaptive practice.'}
                motivation={advice?.motivationalGuidance || 'Consistency is key. Every small step adds up to long-term success.'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMentorPage;
