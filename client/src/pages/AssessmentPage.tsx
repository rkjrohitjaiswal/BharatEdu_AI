import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchStudentAssessmentEngineList,
  fetchStudentAssessmentEngineDetail,
  startAssessmentEngineAttempt,
  recordQuestionEngineAnswer,
  submitAssessmentEngineAttempt,
  fetchAssessmentEngineResult,
  fetchAssessmentEngineRecommendations,
} from '../services/api';
import { IAssessmentClient, IAssessmentQuestionClient, IAssessmentResultClient } from '../types/assessment-engine';
import { AssessmentHeader } from '../components/assessment/AssessmentHeader';
import { AssessmentTimer } from '../components/assessment/AssessmentTimer';
import { AssessmentProgress } from '../components/assessment/AssessmentProgress';
import { QuestionCard } from '../components/assessment/QuestionCard';
import { QuestionOptions } from '../components/assessment/QuestionOptions';
import { QuestionNavigator } from '../components/assessment/QuestionNavigator';
import { QuestionFlagButton } from '../components/assessment/QuestionFlagButton';
import { QuestionConfidence } from '../components/assessment/QuestionConfidence';
import { AssessmentNavigation } from '../components/assessment/AssessmentNavigation';
import { AssessmentSubmitDialog } from '../components/assessment/AssessmentSubmitDialog';
import { AssessmentResult } from '../components/assessment/AssessmentResult';
import { AssessmentReview } from '../components/assessment/AssessmentReview';
import { AssessmentEmptyState } from '../components/assessment/AssessmentEmptyState';
import { Award, ArrowLeft } from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();

  // List view state if no assessmentId parameter
  const [assessments, setAssessments] = useState<IAssessmentClient[]>([]);

  // Assessment Runner State
  const [assessment, setAssessment] = useState<IAssessmentClient | null>(null);
  const [questions, setQuestions] = useState<IAssessmentQuestionClient[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [confidence, setConfidence] = useState<Record<string, 'low' | 'medium' | 'high'>>({});
  const [attemptId, setAttemptId] = useState<string>('');

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [result, setResult] = useState<IAssessmentResultClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assessmentId) {
      loadAssessment(assessmentId);
    } else {
      loadList();
    }
  }, [assessmentId]);

  const loadList = async () => {
    setLoading(true);
    const res = await fetchStudentAssessmentEngineList();
    if (res.success && res.data) {
      setAssessments(res.data);
    }
    setLoading(false);
  };

  const loadAssessment = async (id: string) => {
    setLoading(true);
    const res = await fetchStudentAssessmentEngineDetail(id);
    if (res.success && res.data) {
      setAssessment(res.data.assessment);
      setQuestions(res.data.questions || []);

      const startRes = await startAssessmentEngineAttempt(id);
      if (startRes.success && startRes.data) {
        setAttemptId(startRes.data.attemptId);
      }
    }
    setLoading(false);
  };

  const handleSelectAnswer = (ans: any) => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].questionId;
    setAnswers((prev) => ({ ...prev, [qId]: ans }));
    if (assessmentId && attemptId) {
      recordQuestionEngineAnswer(assessmentId, qId, attemptId, ans, 30);
    }
  };

  const handleToggleFlag = () => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].questionId;
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleConfidenceChange = (conf: 'low' | 'medium' | 'high') => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].questionId;
    setConfidence((prev) => ({ ...prev, [qId]: conf }));
  };

  const handleConfirmSubmit = async () => {
    if (!assessmentId) return;
    setIsSubmitOpen(false);
    setLoading(true);

    const respList = questions.map((q) => ({
      questionId: q.questionId,
      answer: answers[q.questionId],
      timeSpentSeconds: 30,
    }));

    const res = await submitAssessmentEngineAttempt(assessmentId, attemptId, respList);
    if (res.success && res.data) {
      setResult(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading Assessment Engine...</p>
        </div>
      </div>
    );
  }

  // View List Mode
  if (!assessmentId) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>AI Personalized Assessment System</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Curriculum & Adaptive Diagnostic Tests</h1>
            <p className="text-xs text-slate-400">Take server-evaluated diagnostic tests matched to your mastery level and learning gaps.</p>
          </div>

          {assessments.length === 0 ? (
            <AssessmentEmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map((a) => (
                <div key={a.assessmentId} className="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/30">
                      {a.subject} • {a.assessmentType}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{a.durationMinutes} mins</span>
                  </div>
                  <h3 className="font-bold text-white text-base">{a.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{a.description}</p>
                  <div className="pt-2 flex justify-end">
                    <Link
                      to={`/assessments/${a.assessmentId}`}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg"
                    >
                      Start Test →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Result Mode
  if (result) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Link to="/assessments" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Assessment List
          </Link>
          <AssessmentResult result={result} />
          <AssessmentReview
            questions={questions}
            responses={questions.map((q) => ({
              questionId: q.questionId,
              answer: answers[q.questionId],
              isCorrect: String(answers[q.questionId]).trim().toLowerCase() === String((q as any).correctAnswer || '').trim().toLowerCase(),
            }))}
          />
        </div>
      </div>
    );
  }

  // Test Execution Mode
  const currentQuestion = questions[currentIndex];
  if (!assessment || !currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 text-center space-y-4">
        <h2 className="text-xl font-bold">Assessment Not Found</h2>
        <Link to="/assessments" className="text-purple-400 font-bold hover:underline">
          ← Return to Assessments
        </Link>
      </div>
    );
  }

  const answeredIndices = questions.map((q, idx) => (answers[q.questionId] !== undefined ? idx : -1)).filter((i) => i >= 0);
  const flaggedIndices = questions.map((q, idx) => (flagged[q.questionId] ? idx : -1)).filter((i) => i >= 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/assessments" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Exit Test
          </Link>
          <AssessmentTimer durationMinutes={assessment.durationMinutes} onTimeUp={handleConfirmSubmit} />
        </div>

        <AssessmentHeader assessment={assessment} />
        <AssessmentProgress current={currentIndex} total={questions.length} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <QuestionCard question={currentQuestion} />
            <QuestionOptions
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.questionId]}
              onSelect={handleSelectAnswer}
            />

            <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <QuestionFlagButton
                isFlagged={!!flagged[currentQuestion.questionId]}
                onToggle={handleToggleFlag}
              />
              <QuestionConfidence
                confidence={confidence[currentQuestion.questionId] || 'medium'}
                onChange={handleConfidenceChange}
              />
            </div>

            <AssessmentNavigation
              currentIndex={currentIndex}
              total={questions.length}
              onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              onNext={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              onSubmit={() => setIsSubmitOpen(true)}
            />
          </div>

          <div className="space-y-6">
            <QuestionNavigator
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answeredIndices={answeredIndices}
              flaggedIndices={flaggedIndices}
              onSelectIndex={(idx) => setCurrentIndex(idx)}
            />
          </div>
        </div>

        <AssessmentSubmitDialog
          isOpen={isSubmitOpen}
          answeredCount={answeredIndices.length}
          totalQuestions={questions.length}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setIsSubmitOpen(false)}
        />
      </div>
    </div>
  );
};

export default AssessmentPage;
