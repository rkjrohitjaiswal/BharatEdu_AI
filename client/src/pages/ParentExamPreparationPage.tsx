import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchParentChildExamPreparation } from '../services/api';
import { ExamHeader } from '../components/exam-preparation/ExamHeader';
import { ExamCountdown } from '../components/exam-preparation/ExamCountdown';
import { ExamReadinessMeter } from '../components/exam-preparation/ExamReadinessMeter';
import { ExamProgress } from '../components/exam-preparation/ExamProgress';
import { ExamAIInsight } from '../components/exam-preparation/ExamAIInsight';
import { ShieldCheck } from 'lucide-react';

export const ParentExamPreparationPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) loadChildData();
  }, [studentId]);

  const loadChildData = async () => {
    setLoading(true);
    const res = await fetchParentChildExamPreparation(studentId || 'student_1');
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading Child Exam Preparation Progress...</span>
      </div>
    );
  }

  const { plan, profile } = data || {};
  const readinessScore = plan?.currentReadinessScore || 68;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-teal-900 via-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Parent Portal Access • Verified Student Link</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold">Child Exam Readiness Journey</h1>
      </div>

      <ExamHeader
        examName={profile?.examName || 'Class 10 CBSE Board Exam'}
        board={profile?.board || 'CBSE'}
        classLevel={profile?.classLevel || 10}
        subject={profile?.subject || 'Mathematics'}
        targetScore={plan?.targetScore || 90}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExamCountdown daysRemaining={30} examDateStr={new Date(plan?.targetExamDate || Date.now() + 30 * 86400000).toLocaleDateString()} />
        <ExamReadinessMeter score={readinessScore} status={readinessScore < 40 ? 'critical' : readinessScore < 65 ? 'needs_improvement' : 'on_track'} />
      </div>

      <ExamAIInsight
        coach={{
          headline: 'Steady progress maintained for Class 10 Board Exam',
          guidance: 'Your child is maintaining a solid preparation pace. Daily practice routine is consistently completed.',
          whyItMatters: 'Consistent study habits significantly reduce exam stress and build confidence.',
          timeAllocationAdvice: 'Encourage 90 minutes of focused practice during the evening study window.',
        }}
      />

      <ExamProgress
        conceptMasteryPct={72}
        topicCoveragePct={80}
        practiceAccuracyPct={70}
        mockPerformancePct={68}
      />
    </div>
  );
};
