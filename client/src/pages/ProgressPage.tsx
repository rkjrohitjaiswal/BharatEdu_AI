import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { fetchStudentDashboard } from '../services/api';
import { StudentDashboardData } from '../types';
import { AlertTriangle, BookOpen, CheckCircle2 } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStudentDashboard().then((res) => {
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  const subjectPerformance = dashboardData?.subjectPerformance || [];
  const learningGaps = (dashboardData?.learningGaps || []).filter((g) => g.status === 'active');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Progress & Insights"
        description="Track your academic performance, subject mastery, and active learning gaps."
        badge={<Badge variant="purple">Analytics Engine</Badge>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Subject Mastery Breakdown" subtitle="Live student performance by subject">
          {subjectPerformance.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No Subject Data Recorded</p>
              <p className="text-slate-400">Complete practice sessions to see your subject progress here.</p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {subjectPerformance.map((sp) => (
                <div key={sp.subjectId || sp.name}>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-900">{sp.name}</span>
                    <span className={sp.masteryScore >= 80 ? 'text-emerald-600' : sp.masteryScore >= 50 ? 'text-sky-600' : 'text-amber-600'}>
                      {sp.masteryScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        sp.masteryScore >= 80 ? 'bg-emerald-500' : sp.masteryScore >= 50 ? 'bg-sky-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, sp.masteryScore))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Active Learning Gap Alerts" subtitle="Concepts identified by AI engine needing practice">
          {learningGaps.length === 0 ? (
            <div className="text-center py-6 text-xs text-emerald-600 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-900">Zero Active Gaps!</p>
              <p className="text-slate-500">Your conceptual progress is on track across all practiced topics.</p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {learningGaps.map((gap) => {
                const topicName = typeof gap.topicId === 'object' && gap.topicId !== null ? gap.topicId.name : 'Curriculum Topic';
                return (
                  <div
                    key={gap._id}
                    className={`p-3 rounded-lg border space-y-1 ${
                      gap.severity === 'critical' || gap.severity === 'high'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-sky-50 border-sky-200 text-sky-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{topicName}</span>
                      </div>
                      <Badge variant={gap.severity === 'critical' || gap.severity === 'high' ? 'amber' : 'blue'} size="sm">
                        {gap.severity}
                      </Badge>
                    </div>
                    <p className="text-[11px] opacity-90">{gap.evidence || 'Practice recommended.'}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
