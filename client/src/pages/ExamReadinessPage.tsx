import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { SkeletonLoader } from '../components/SkeletonLoader';
import {
  fetchExamReadiness,
  fetchExamPlan,
  generateExamPlan,
  updateExamPlanTask,
  createMockExam,
} from '../services/api';
import { ExamReadinessScore } from '../components/exams/ExamReadinessScore';
import { ExamSubjectReadiness } from '../components/exams/ExamSubjectReadiness';
import { ExamPriorityTopics } from '../components/exams/ExamPriorityTopics';
import { ExamPreparationPlan } from '../components/exams/ExamPreparationPlan';
import { ExamRiskAlert } from '../components/exams/ExamRiskAlert';
import { ExamRecommendationCard } from '../components/exams/ExamRecommendationCard';
import { ArrowLeft, Play, RefreshCw } from 'lucide-react';

export const ExamReadinessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [readiness, setReadiness] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [mockLoading, setMockLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) loadReadinessData();
  }, [id]);

  const loadReadinessData = async () => {
    if (!id) return;
    setLoading(true);
    const [rRes, pRes] = await Promise.all([
      fetchExamReadiness(id),
      fetchExamPlan(id),
    ]);

    if (rRes.success && rRes.data) {
      setReadiness(rRes.data);
    }
    if (pRes.success && pRes.data) {
      setPlan(pRes.data);
    }
    setLoading(false);
  };

  const handleGeneratePlan = async () => {
    if (!id) return;
    setLoading(true);
    const res = await generateExamPlan(id, 60);
    if (res.success && res.data) {
      setPlan(res.data);
    }
    setLoading(false);
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    if (!id) return;
    const res = await updateExamPlanTask(id, taskId, completed);
    if (res.success && res.data) {
      setPlan(res.data);
    }
  };

  const handleStartMockExam = async () => {
    if (!id) return;
    setMockLoading(true);
    const res = await createMockExam(id);
    setMockLoading(false);
    if (res.success && res.data?.sessionId) {
      navigate(`/practice?sessionId=${res.data.sessionId}`);
    }
  };

  if (loading) return <SkeletonLoader />;

  if (!readiness) {
    return (
      <div className="py-12 text-center text-slate-500">
        Exam readiness data not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs max-w-5xl mx-auto">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => navigate('/exam-prep')} icon={<ArrowLeft className="w-3.5 h-3.5" />}>
          Back to Exams
        </Button>
      </div>

      <PageHeader
        title={`${readiness.title} - Readiness & Prep`}
        description={`Target exam date: ${new Date(readiness.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} (${readiness.daysRemaining} days remaining)`}
        actions={
          <Button onClick={handleStartMockExam} disabled={mockLoading} icon={<Play className="w-4 h-4" />}>
            {mockLoading ? 'Starting...' : 'Start Mock Exam'}
          </Button>
        }
      />

      <ExamRiskAlert daysCategory={readiness.daysCategory} daysRemaining={readiness.daysRemaining} />

      <ExamReadinessScore
        score={readiness.readinessScore}
        level={readiness.readinessLevel}
        breakdown={readiness.scoreBreakdown}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ExamPreparationPlan
            plan={plan}
            onGeneratePlan={handleGeneratePlan}
            onToggleTask={handleToggleTask}
          />

          <ExamPriorityTopics
            criticalTopics={readiness.criticalTopics}
            highPriorityTopics={readiness.highPriorityTopics}
          />
        </div>

        <div className="space-y-6">
          <ExamRecommendationCard
            explanation={readiness.explanation}
            recommendations={readiness.recommendations}
            aiEnhanced={readiness.aiEnhanced}
          />

          <ExamSubjectReadiness subjects={readiness.subjectReadiness} />
        </div>
      </div>
    </div>
  );
};
