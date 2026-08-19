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
import { Users, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ParentDashboardPage: React.FC<{ user: any }> = ({ user }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [linkedStudents, setLinkedStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [overviewData, setOverviewData] = useState<any>(null);

  useEffect(() => {
    loadParentDashboard();
  }, []);

  const loadParentDashboard = async () => {
    setLoading(true);
    const res = await fetchParentStudents();
    if (res.success && res.data && res.data.length > 0) {
      setLinkedStudents(res.data);
      const firstStudent = res.data[0].student;
      const firstId = String(firstStudent?._id || firstStudent?.id || firstStudent);
      setSelectedStudentId(firstId);
      await loadOverview(firstId);
    } else {
      setLoading(false);
    }
  };

  const loadOverview = async (studentId: string) => {
    const res = await fetchParentStudentOverview(studentId);
    if (res.success && res.data) {
      setOverviewData(res.data);
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

  if (linkedStudents.length === 0) {
    return (
      <div className="space-y-6 text-xs max-w-4xl mx-auto py-8">
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
          {/* Needs Attention Card */}
          <ParentAttentionCard activeGapsSummary={overviewData?.activeGapsSummary} />

          {/* Scholarship Opportunities Card */}
          <ParentScholarshipCard opportunitiesCount={overviewData?.scholarshipOpportunitiesCount || 3} />
        </div>
      </div>
    </div>
  );
};
