import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { Card } from '../components/Card';
import { fetchParentStudentOverview } from '../services/api';
import { SubjectProgress } from '../components/parent/SubjectProgress';
import { LearningTrendCard } from '../components/parent/LearningTrendCard';
import { ParentAttentionCard } from '../components/parent/ParentAttentionCard';
import { StudyActivityCard } from '../components/parent/StudyActivityCard';
import { ParentScholarshipCard } from '../components/parent/ParentScholarshipCard';

export const ParentStudentOverviewPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (studentId) {
      loadOverview(studentId);
    }
  }, [studentId]);

  const loadOverview = async (id: string) => {
    setLoading(true);
    const res = await fetchParentStudentOverview(id);
    if (res.success && res.data) {
      setOverviewData(res.data);
    } else {
      setError(res.message || 'Failed to load student progress overview.');
    }
    setLoading(false);
  };

  if (loading) return <SkeletonLoader />;

  if (error) {
    return (
      <Card title="Error Loading Student Overview">
        <div className="py-6 text-center text-amber-800 bg-amber-50 rounded-xl border border-amber-200">
          {error}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 text-xs max-w-6xl mx-auto">
      <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-1">
        <h2 className="text-xl font-bold">{overviewData?.student?.name} — Student Learning Progress</h2>
        <p className="text-slate-400 text-xs">Class {overviewData?.student?.classLevel || 8} • Detailed Progress Overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LearningTrendCard
            progressTrend={overviewData?.progressTrend}
            aiSummary={overviewData?.aiLearningSummary}
          />
          <SubjectProgress subjects={overviewData?.subjectPerformance} />
          <StudyActivityCard
            recentActivity={overviewData?.recentActivity}
            studyPlanProgress={overviewData?.studyPlanProgress}
          />
        </div>
        <div className="space-y-6">
          <ParentAttentionCard activeGapsSummary={overviewData?.activeGapsSummary} />
          <ParentScholarshipCard opportunitiesCount={overviewData?.scholarshipOpportunitiesCount || 3} />
        </div>
      </div>
    </div>
  );
};
