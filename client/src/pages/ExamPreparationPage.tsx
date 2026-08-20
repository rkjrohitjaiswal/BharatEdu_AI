import React, { useEffect, useState } from 'react';
import { fetchStudentExamPreparation, generateStudentExamMock } from '../services/api';
import { ExamHeader } from '../components/exam-preparation/ExamHeader';
import { ExamCountdown } from '../components/exam-preparation/ExamCountdown';
import { ExamReadinessMeter } from '../components/exam-preparation/ExamReadinessMeter';
import { ExamProgress } from '../components/exam-preparation/ExamProgress';
import { ExamCoverage } from '../components/exam-preparation/ExamCoverage';
import { ExamPriorityList } from '../components/exam-preparation/ExamPriorityList';
import { ExamTodayPlan } from '../components/exam-preparation/ExamTodayPlan';
import { ExamWeeklyPlan } from '../components/exam-preparation/ExamWeeklyPlan';
import { ExamRiskCard } from '../components/exam-preparation/ExamRiskCard';
import { ExamGapAnalysis } from '../components/exam-preparation/ExamGapAnalysis';
import { MockExamCard } from '../components/exam-preparation/MockExamCard';
import { MockExamHistory } from '../components/exam-preparation/MockExamHistory';
import { ExamStrategyCard } from '../components/exam-preparation/ExamStrategyCard';
import { ExamImprovementPlan } from '../components/exam-preparation/ExamImprovementPlan';
import { ExamRevisionPlan } from '../components/exam-preparation/ExamRevisionPlan';
import { ExamResourceRecommendations } from '../components/exam-preparation/ExamResourceRecommendations';
import { ExamAIInsight } from '../components/exam-preparation/ExamAIInsight';
import { ExamEmptyState } from '../components/exam-preparation/ExamEmptyState';
import { useNavigate } from 'react-router-dom';

export const ExamPreparationPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadExamData();
  }, []);

  const loadExamData = async () => {
    setLoading(true);
    const res = await fetchStudentExamPreparation();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  const handleStartMock = async () => {
    const res = await generateStudentExamMock('sectional', 'Mathematics');
    if (res.success && res.data?.assessmentId) {
      navigate(`/assessments/${res.data.assessmentId}`);
    } else {
      navigate('/assessments');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading AI Exam Preparation Dashboard...</span>
      </div>
    );
  }

  if (!data || !data.plan) {
    return <ExamEmptyState onSetupPlan={loadExamData} />;
  }

  const { plan, profile, readiness, priorities, todayPlan, weeklyPlan, gaps, risks, prediction, coach } = data;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <ExamHeader
        examName={profile.examName}
        board={profile.board}
        classLevel={profile.classLevel}
        subject={profile.subject}
        targetScore={plan.targetScore}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExamCountdown daysRemaining={readiness.daysRemaining} examDateStr={new Date(plan.targetExamDate).toLocaleDateString()} />
        <ExamReadinessMeter score={readiness.readinessScore} status={readiness.status} />
        <ExamCoverage coveragePct={readiness.topicCoveragePct} />
      </div>

      {coach && <ExamAIInsight coach={coach} />}

      <ExamProgress
        conceptMasteryPct={readiness.conceptMasteryPct}
        topicCoveragePct={readiness.topicCoveragePct}
        practiceAccuracyPct={readiness.practiceAccuracyPct}
        mockPerformancePct={readiness.mockPerformancePct}
      />

      <MockExamCard
        mockType="sectional"
        targetTopics={['Quadratic Equations', 'Polynomials']}
        durationMinutes={45}
        totalQuestions={15}
        reason="Targeted sectional simulation to evaluate time allocation and core concept accuracy."
        onStartMock={handleStartMock}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExamTodayPlan todayPlan={todayPlan} />
        <ExamPriorityList priorities={priorities} />
      </div>

      <ExamRiskCard risks={risks} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExamGapAnalysis gaps={gaps} />
        <ExamImprovementPlan prediction={prediction} />
      </div>

      <ExamWeeklyPlan weeklyPlan={weeklyPlan} />

      <ExamStrategyCard
        strategy={{
          questionOrdering: [
            'Phase 1: Attempt direct high-confidence MCQs.',
            'Phase 2: Solve mandatory numerical and formula-based short questions.',
            'Phase 3: Tackle complex case-based long answers.',
          ],
          sectionTimeAllocation: {
            'Section A (MCQs)': 45,
            'Section B (Short Answer)': 60,
            'Section C (Long Answer)': 60,
            'Final Revision': 15,
          },
          skipStrategy: 'If a question takes >2.5 minutes without progress, flag it and move forward immediately.',
          reviewStrategy: 'Prioritize reviewing flagged high-confidence questions first.',
          confidenceManagement: 'Re-verify questions flagged with low confidence during final 15 mins.',
          finalCheckMinutes: 15,
        }}
      />

      <ExamRevisionPlan overdueConcepts={['math_quadratic']} />

      <ExamResourceRecommendations
        resources={[
          {
            resourceId: 'res_ncert_ch4',
            title: 'NCERT Class 10 Chapter 4: Quadratic Equations',
            type: 'Official Textbook Chapter',
            officialSourceUrl: 'https://ncert.nic.in',
            publisher: 'NCERT Official',
          },
        ]}
      />

      <MockExamHistory history={[]} />
    </div>
  );
};
