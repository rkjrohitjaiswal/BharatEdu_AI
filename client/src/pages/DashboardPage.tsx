import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchStudentDashboard } from '../services/api';
import { StudentDashboardData } from '../types';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { StudentWelcome } from '../components/dashboard/StudentWelcome';
import { LearningCoachCard } from '../components/dashboard/LearningCoachCard';
import { LearningOverview } from '../components/dashboard/LearningOverview';
import { MasteryCard } from '../components/dashboard/MasteryCard';
import { SubjectPerformance } from '../components/dashboard/SubjectPerformance';
import { LearningGapCard } from '../components/dashboard/LearningGapCard';
import { RecommendedTopics } from '../components/dashboard/RecommendedTopics';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { StudyPlanCard } from '../components/dashboard/StudyPlanCard';
import { StudentInterventionsCard } from '../components/dashboard/StudentInterventionsCard';
import { PracticeActivityCard } from '../components/dashboard/PracticeActivityCard';
import { ScholarshipPreview } from '../components/dashboard/ScholarshipPreview';
import { ScholarshipAlertsCard } from '../components/dashboard/ScholarshipAlertsCard';
import { RecentMistakesCard } from '../components/dashboard/RecentMistakesCard';
import { StudentGoalsCard } from '../components/dashboard/StudentGoalsCard';
import { AchievementSummaryCard } from '../components/dashboard/AchievementSummaryCard';
import { ExamPreparationCard } from '../components/dashboard/ExamPreparationCard';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/Button';
import { StudentMentorCard } from '../components/dashboard/StudentMentorCard';
import { LearningAnalyticsCard } from '../components/dashboard/LearningAnalyticsCard';
import { StudyPlannerCard } from '../components/dashboard/StudyPlannerCard';
import { RecommendedResourcesCard } from '../components/dashboard/RecommendedResourcesCard';
import { RevisionCard } from '../components/dashboard/RevisionCard';
import { KnowledgeGraphCard } from '../components/dashboard/KnowledgeGraphCard';
import { AdaptiveAssessmentCard } from '../components/dashboard/AdaptiveAssessmentCard';
import { ResourceHubCard } from '../components/dashboard/ResourceHubCard';
import { ResourceRecommendationCard } from '../components/dashboard/ResourceRecommendationCard';
import { SmartRevisionCard } from '../components/dashboard/SmartRevisionCard';
import { LearningPathCard } from '../components/dashboard/LearningPathCard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchStudentDashboard();
      if (res.success && res.data) {
        setDashboardData(res.data);
      } else {
        setError(res.message || 'Failed to load student dashboard data.');
      }
    } catch (err) {
      setError('An unexpected error occurred loading your learning dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error || !dashboardData) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Dashboard Unavailable</h3>
        <p className="text-xs text-slate-500">{error || 'Could not retrieve your dashboard data.'}</p>
        <Button onClick={loadDashboard} icon={<RefreshCw className="w-4 h-4" />}>
          Retry Dashboard
        </Button>
      </div>
    );
  }

  const {
    studentProfile,
    learningProfile,
    stats,
    mastery,
    learningGaps,
    recentActivity,
    studyPlan,
    scholarshipMatches,
    subjectPerformance,
  } = dashboardData;

  const recommendedTopics = (learningProfile?.recommendedTopics || []).filter(
    (t) => typeof t === 'object' && t !== null
  );

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header */}
      <StudentWelcome user={user} profile={studentProfile} />

      {/* AI Success Mentor Compact Card */}
      <StudentMentorCard />

      {/* Learning Analytics Compact Card */}
      <LearningAnalyticsCard />

      {/* AI Study Planner Compact Card */}
      <StudyPlannerCard />

      {/* Recommended Resources Compact Card */}
      <RecommendedResourcesCard />

      {/* Smart Revision Compact Card */}
      <SmartRevisionCard />

      {/* Knowledge Graph / Learning Map Compact Card */}
      <KnowledgeGraphCard />

      {/* Adaptive Assessment Compact Card */}
      <AdaptiveAssessmentCard />

      {/* Smart Resource Hub Compact Card */}
      <ResourceHubCard />

      {/* AI Learning Path Compact Card */}
      <LearningPathCard />

      {/* 2. Key Metrics Stats Overview */}
      <LearningOverview
        profile={studentProfile}
        learningProfile={learningProfile}
        stats={stats}
      />

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Learning Coach & Daily Recommendations */}
          <LearningCoachCard />

          {/* AI Resource Recommendations Card */}
          <ResourceRecommendationCard />

          {/* Overall Learning Mastery */}
          <MasteryCard learningProfile={learningProfile} />

          {/* Recommended Next Topics ("What should I learn next?") */}
          <RecommendedTopics topics={recommendedTopics} />

          {/* Active Learning Gaps ("Needs Attention") */}
          <LearningGapCard gaps={learningGaps} />

          {/* AI-Powered Recent Mistake Reviews */}
          <RecentMistakesCard />
        </div>

        {/* Right Column (Sidebar Analytics & Widgets) */}
        <div className="space-y-6">
          {/* Active Teacher Remediation Assignments */}
          <StudentInterventionsCard />

          {/* Today's Interactive Study Plan */}
          <StudyPlanCard studyPlan={studyPlan} />

          {/* Student Goals Progress Card */}
          <StudentGoalsCard goals={dashboardData?.goals || []} />

          {/* Exam Preparation & Readiness Card */}
          <ExamPreparationCard exams={dashboardData?.exams || []} />

          {/* Achievements Summary Card */}
          <AchievementSummaryCard summary={dashboardData?.achievementSummary || { totalAchievements: 1, currentStreak: stats?.currentStreak || 1, goalsCompleted: 0 }} />

          {/* Practice Activity & History Card */}
          <PracticeActivityCard />

          {/* Subject Performance Breakdown */}
          <SubjectPerformance subjects={subjectPerformance} />

          {/* Scholarship Deadline & Opportunity Alerts */}
          <ScholarshipAlertsCard />

          {/* Scholarship Opportunities Preview */}
          <ScholarshipPreview matches={scholarshipMatches} />

          {/* Human-Readable Recent Activity Feed */}
          <RecentActivity events={recentActivity} />
        </div>
      </div>
    </div>
  );
};
