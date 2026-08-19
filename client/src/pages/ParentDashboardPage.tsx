import React, { useEffect, useState } from 'react';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { fetchParentStudents, fetchParentStudentOverview } from '../services/api';
import { ParentWelcome } from '../components/parent/ParentWelcome';
import { SubjectProgress } from '../components/parent/SubjectProgress';
import { LearningTrendCard } from '../components/parent/LearningTrendCard';
import { ParentAttentionCard } from '../components/parent/ParentAttentionCard';
import { StudyActivityCard } from '../components/parent/StudyActivityCard';
import { ParentScholarshipCard } from '../components/parent/ParentScholarshipCard';
import { ParentInterventionAlerts } from '../components/parent/ParentInterventionAlerts';
import { Users, ShieldCheck, RefreshCw } from 'lucide-react';

export const ParentDashboardPage: React.FC<{ user: any }> = ({ user }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [linkedStudents, setLinkedStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [overviewData, setOverviewData] = useState<any>(null);

  useEffect(() => {
    loadParentDashboard();
  }, []);

  const loadParentDashboard = async () => {
    setLoading(true);
    setError('');
    const res = await fetchParentStudents();
    if (res.success && res.data && res.data.length > 0) {
      setLinkedStudents(res.data);
      const firstStudent = res.data[0].student;
      const firstId = String(firstStudent?._id || firstStudent?.id || firstStudent);
      setSelectedStudentId(firstId);
      await loadOverview(firstId);
    } else if (res.success && res.data && res.data.length === 0) {
      setLinkedStudents([]);
      setLoading(false);
    } else {
      setError(res.message || 'Failed to load parent dashboard data.');
      setLoading(false);
    }
  };

  const loadOverview = async (studentId: string) => {
    const res = await fetchParentStudentOverview(studentId);
    if (res.success && res.data) {
      setOverviewData(res.data);
    } else {
      setError(res.message || 'Failed to load student overview data.');
    }
    setLoading(false);
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setLoading(true);
    loadOverview(studentId);
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="space-y-6 text-xs max-w-4xl mx-auto py-8">
        <Card title="Parent Learning Dashboard Error">
          <div className="py-8 text-center space-y-4">
            <p className="text-amber-800 font-semibold">{error}</p>
            <Button onClick={loadParentDashboard} icon={<RefreshCw className="w-4 h-4" />}>
              Retry Loading Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (linkedStudents.length === 0) {
    return (
      <div className="space-y-6 text-xs max-w-4xl mx-auto py-8">
        {/* Privacy Message Banner */}
        <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2.5 text-indigo-950 font-medium">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>This dashboard shows learning progress for students linked to your account.</span>
        </div>

        <Card title="Parent Learning Dashboard" subtitle="Connect to your child's student account">
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Linked Students Found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                To view your child's progress report, ask your child to generate an invitation code from their
                student account.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs max-w-6xl mx-auto">
      {/* Privacy Notice Banner */}
      <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2.5 text-indigo-950 font-medium">
        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>This dashboard shows learning progress for students linked to your account.</span>
      </div>

      {/* Welcome Banner & Student Selector */}
      <ParentWelcome
        parentUser={user}
        linkedStudents={linkedStudents}
        selectedStudentId={selectedStudentId}
        onSelectStudent={handleSelectStudent}
        overviewData={overviewData}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Learning Summary */}
          <LearningTrendCard
            progressTrend={overviewData?.progressTrend}
            aiSummary={overviewData?.aiLearningSummary}
          />

          {/* Subject Mastery Progress */}
          <SubjectProgress subjects={overviewData?.subjectPerformance} />

          {/* Recent Study Activity & Task Progress */}
          <StudyActivityCard
            recentActivity={overviewData?.recentActivity}
            studyPlanProgress={overviewData?.studyPlanProgress}
          />
        </div>

        {/* Right 1 Column */}
        <div className="space-y-6">
          {/* Active Teacher Interventions Card */}
          <ParentInterventionAlerts
            activeTeacherInterventions={overviewData?.activeTeacherInterventions}
          />

          {/* Needs Attention Card */}
          <ParentAttentionCard activeGapsSummary={overviewData?.activeGapsSummary} />

          {/* Scholarship Opportunities Card */}
          <ParentScholarshipCard opportunitiesCount={overviewData?.scholarshipOpportunitiesCount || 3} />
        </div>
      </div>
    </div>
  );
};
