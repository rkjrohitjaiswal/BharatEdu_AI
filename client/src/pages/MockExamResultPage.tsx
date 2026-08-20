import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAssessmentEngineResult } from '../services/api';
import { AssessmentScoreCard } from '../components/assessment/AssessmentScoreCard';
import { AssessmentConceptBreakdown } from '../components/assessment/AssessmentConceptBreakdown';
import { AssessmentRecommendations } from '../components/assessment/AssessmentRecommendations';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export const MockExamResultPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assessmentId) loadResult();
  }, [assessmentId]);

  const loadResult = async () => {
    setLoading(true);
    const res = await fetchAssessmentEngineResult(assessmentId!);
    if (res.success && res.data) {
      setResult(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Evaluating Mock Exam Results...</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-8 text-center text-gray-500">
        Result not available for this mock exam.
      </div>
    );
  }

  const { totalMarks = 100, obtainedMarks = 0, percentage = 0, conceptPerformance, recommendedActions } = result;
  const attemptObj = result.attempt || result;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link to="/exam-preparation" className="inline-flex items-center space-x-2 text-indigo-600 font-bold text-xs hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Exam Preparation Dashboard</span>
      </Link>

      <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-xl flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckCircle className="w-4 h-4" />
            <span>Mock Simulation Complete</span>
          </div>
          <h1 className="text-2xl font-black">Mock Assessment Result</h1>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-emerald-300">{percentage}%</div>
          <div className="text-xs text-emerald-200">{obtainedMarks} / {totalMarks} Marks</div>
        </div>
      </div>

      <AssessmentScoreCard attempt={attemptObj} />

      {conceptPerformance && <AssessmentConceptBreakdown breakdown={conceptPerformance} />}

      {recommendedActions && <AssessmentRecommendations actions={recommendedActions} />}
    </div>
  );
};
