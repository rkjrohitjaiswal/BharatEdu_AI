import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { fetchStudentAchievements, fetchAchievementSummary } from '../services/api';
import { AchievementSummary } from '../components/goals/AchievementSummary';
import { AchievementGrid } from '../components/goals/AchievementGrid';
import { NextMilestones } from '../components/goals/NextMilestones';

export const AchievementsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    loadAchievementsData();
  }, []);

  const loadAchievementsData = async () => {
    setLoading(true);
    const [achRes, sumRes] = await Promise.all([
      fetchStudentAchievements(),
      fetchAchievementSummary(),
    ]);

    if (achRes.success && achRes.data) {
      setAchievements(achRes.data);
    }
    if (sumRes.success && sumRes.data) {
      setSummary(sumRes.data);
    }
    setLoading(false);
  };

  if (loading) return <SkeletonLoader />;

  return (
    <div className="space-y-6 text-xs max-w-5xl mx-auto">
      <PageHeader
        title="Student Achievements & Badges"
        description="Celebrate your hard work, practice consistency, and learning milestones."
      />

      {summary && <AchievementSummary summary={summary} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Earned Badges & Medals" subtitle="Real accomplishments from your study activity">
            <AchievementGrid achievements={achievements} />
          </Card>
        </div>

        <div className="space-y-6">
          {summary?.nextMilestones && <NextMilestones milestones={summary.nextMilestones} />}
        </div>
      </div>
    </div>
  );
};
