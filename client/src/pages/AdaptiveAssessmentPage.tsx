import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  completeAdaptiveAssessment,
  createAdaptiveAssessment,
  fetchAssessmentSummary,
  fetchNextAssessmentQuestion,
  submitAssessmentAnswer,
} from '../services/api';
import { AdaptiveDifficultyIndicator } from '../components/assessment/AdaptiveDifficultyIndicator';
import { AnswerFeedback } from '../components/assessment/AnswerFeedback';
import { AssessmentEmptyState } from '../components/assessment/AssessmentEmptyState';
import { AssessmentHeader } from '../components/assessment/AssessmentHeader';
import { AssessmentSummary } from '../components/assessment/AssessmentSummary';
import { HintPanel } from '../components/assessment/HintPanel';
import { PrerequisiteNotice } from '../components/assessment/PrerequisiteNotice';
import { QuestionCard } from '../components/assessment/QuestionCard';
import { QuestionProgress } from '../components/assessment/QuestionProgress';

export const AdaptiveAssessmentPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<any | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<any | null>(null);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const initAssessment = async (targetId?: string) => {
    setLoading(true);
    setError('');
    setFeedback(null);
    setSummary(null);
    setSelectedAnswer('');

    try {
      const res = await createAdaptiveAssessment(targetId, 'adaptive_practice', 5);
      if (res.success && res.data) {
        setAssessment(res.data);
        await loadNextQuestion(res.data.assessmentId);
      } else {
        setError(res.message || 'Failed to create assessment');
      }
    } catch (err: any) {
      setError(err?.message || 'Error initializing assessment');
    } finally {
      setLoading(false);
    }
  };

  const loadNextQuestion = async (assessmentId: string) => {
    setFeedback(null);
    setSelectedAnswer('');
    try {
      const res = await fetchNextAssessmentQuestion(assessmentId);
      if (res.success && res.data) {
        if (res.data.isCompleted) {
          await loadSummary(assessmentId);
        } else {
          setCurrentQuestion(res.data.question);
          if (res.data.assessment) setAssessment(res.data.assessment);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Error fetching question');
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || !assessment || !currentQuestion) return;
    setSubmitting(true);
    try {
      const res = await submitAssessmentAnswer(
        assessment.assessmentId,
        currentQuestion.questionId,
        selectedAnswer
      );
      if (res.success && res.data) {
        setFeedback(res.data);
      } else {
        setError(res.message || 'Failed to submit answer');
      }
    } catch (err: any) {
      setError(err?.message || 'Error submitting answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (feedback?.isAssessmentCompleted && assessment) {
      await loadSummary(assessment.assessmentId);
    } else if (assessment) {
      await loadNextQuestion(assessment.assessmentId);
    }
  };

  const loadSummary = async (assessmentId: string) => {
    try {
      const res = await fetchAssessmentSummary(assessmentId);
      if (res.success && res.data) {
        setSummary(res.data);
        setCurrentQuestion(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading assessment summary');
    }
  };

  useEffect(() => {
    const stateAssessmentId = (location.state as any)?.assessmentId;
    if (stateAssessmentId) {
      loadNextQuestion(stateAssessmentId).finally(() => setLoading(false));
    } else {
      initAssessment();
    }
  }, [user?.id]);

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {error && <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs font-semibold">{error}</div>}

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm font-medium">Initializing adaptive assessment engine...</div>
      ) : summary ? (
        <AssessmentSummary summary={summary} onRestart={() => initAssessment()} />
      ) : assessment && currentQuestion ? (
        <div className="space-y-6">
          <AssessmentHeader
            conceptName={assessment.targetConceptName || assessment.targetConceptId}
            subject={assessment.subject || 'Mathematics'}
            assessmentType={assessment.assessmentType || 'adaptive_practice'}
          />

          <QuestionProgress
            current={assessment.completedQuestions + 1}
            total={assessment.questionCount}
          />

          <PrerequisiteNotice notice={assessment.prerequisiteNotice} />

          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={setSelectedAnswer}
            disabled={Boolean(feedback)}
          />

          {!feedback && (
            <div className="flex items-center justify-between gap-3">
              <HintPanel hint={currentQuestion.hint} />

              <button
                type="button"
                disabled={!selectedAnswer || submitting}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Answer'}
              </button>
            </div>
          )}

          {feedback && <AnswerFeedback feedback={feedback} onNext={handleNext} />}
        </div>
      ) : (
        <AssessmentEmptyState onStart={() => initAssessment()} />
      )}
    </div>
  );
};

export default AdaptiveAssessmentPage;
