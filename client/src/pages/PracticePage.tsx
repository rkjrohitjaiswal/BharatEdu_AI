import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { SkeletonLoader } from '../components/SkeletonLoader';
import {
  fetchPracticeRecommendations,
  createPracticeSession,
  submitPracticeAnswer,
  fetchSubjects,
  fetchTopics,
} from '../services/api';
import {
  PracticeRecommendationItem,
  PracticeSessionItem,
  PracticeQuestionItem,
  Subject,
  Topic,
} from '../types';
import {
  Target,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Zap,
  BookOpen,
  Award,
  RefreshCw,
} from 'lucide-react';

export const PracticePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<PracticeRecommendationItem[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  // Selection state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

  // Active Session state
  const [session, setSession] = useState<PracticeSessionItem | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestionItem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);
  const [sessionSummary, setSessionSummary] = useState<any>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    const [recsRes, subjRes, topRes] = await Promise.all([
      fetchPracticeRecommendations(),
      fetchSubjects(),
      fetchTopics(),
    ]);

    if (recsRes.success && recsRes.data) setRecommendations(recsRes.data);
    if (subjRes.success && subjRes.data) setSubjects(subjRes.data);
    if (topRes.success && topRes.data) setTopics(topRes.data);
    setLoading(false);
  };

  const handleStartPractice = async (topicId?: string, subjectId?: string) => {
    setLoading(true);
    setEvalResult(null);
    setSessionSummary(null);
    setSelectedAnswer('');

    const res = await createPracticeSession({
      subjectId: subjectId || selectedSubjectId || undefined,
      topicId: topicId || selectedTopicId || undefined,
      questionCount: 5,
    });

    if (res.success && res.data) {
      setSession(res.data.session);
      setCurrentQuestion(res.data.currentQuestion);
    }
    setLoading(false);
  };

  const handleSubmitAnswer = async () => {
    if (!session || !currentQuestion || !selectedAnswer || submitting) return;

    setSubmitting(true);
    const res = await submitPracticeAnswer(session._id, {
      questionIndex: session.currentQuestionIndex,
      answer: selectedAnswer,
      timeSpentSeconds: 20,
    });

    if (res.success && res.data) {
      setEvalResult(res.data);
      if (res.data.sessionProgress.isCompleted) {
        setSessionSummary({
          score: res.data.sessionProgress.currentScore,
          completedQuestions: res.data.sessionProgress.completedQuestions,
          totalQuestions: res.data.sessionProgress.totalQuestions,
        });
      }
    }
    setSubmitting(false);
  };

  const handleNextQuestion = () => {
    if (!evalResult) return;
    if (evalResult.nextQuestion) {
      setCurrentQuestion(evalResult.nextQuestion);
      setSelectedAnswer('');
      setEvalResult(null);
      if (session) {
        setSession({
          ...session,
          currentQuestionIndex: session.currentQuestionIndex + 1,
          completedQuestions: evalResult.sessionProgress.completedQuestions,
          difficulty: evalResult.sessionProgress.difficulty as any,
        });
      }
    } else {
      // Session finished
      setSession(null);
      setCurrentQuestion(null);
    }
  };

  const getDifficultyBadge = (diff?: string) => {
    switch (diff) {
      case 'hard':
        return <Badge variant="purple">Hard</Badge>;
      case 'medium':
        return <Badge variant="blue">Medium</Badge>;
      default:
        return <Badge variant="emerald">Easy</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <SkeletonLoader />
      </div>
    );
  }

  // Active Question View
  if (session && currentQuestion) {
    const isAnswered = !!evalResult;

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Progress */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Question {session.completedQuestions + (isAnswered ? 0 : 1)} of {session.totalQuestions}
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {typeof session.topicId === 'object' ? session.topicId.name : 'Adaptive Practice'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {getDifficultyBadge(evalResult?.sessionProgress?.difficulty || session.difficulty)}
            <Badge variant="amber">Score: {evalResult?.sessionProgress?.currentScore ?? session.score}%</Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{
              width: `${((session.completedQuestions + (isAnswered ? 1 : 0)) / session.totalQuestions) * 100}%`,
            }}
          />
        </div>

        {/* Question Card */}
        <Card>
          <div className="space-y-6">
            <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
              {currentQuestion.questionText}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {(currentQuestion.options || []).map((option, idx) => {
                const isSelected = selectedAnswer === option;
                let optionStyle = 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50';

                if (isAnswered) {
                  if (option === evalResult.correctAnswer) {
                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                  } else if (isSelected && !evalResult.isCorrect) {
                    optionStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-semibold';
                  } else {
                    optionStyle = 'border-slate-200 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20 text-emerald-950 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered || submitting}
                    onClick={() => setSelectedAnswer(option)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && option === evalResult.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && isSelected && !evalResult.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Mistake Review Block */}
            {isAnswered && (
              <div
                className={`p-4 rounded-xl border space-y-3 text-sm ${
                  evalResult.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {evalResult.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-600" />
                  )}
                  <span>{evalResult.isCorrect ? 'Correct!' : "❌ Let's Review This Concept"}</span>
                </div>

                <p className="text-xs leading-relaxed">{evalResult.feedback}</p>

                {!evalResult.isCorrect && (
                  <div className="pt-2 border-t border-amber-200/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900">Correct Answer:</span>
                      <span className="font-bold text-emerald-700">{evalResult.correctAnswer}</span>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <Link to="/tutor">
                        <Button size="sm" variant="outline" icon={<BookOpen className="w-3.5 h-3.5 text-purple-600" />}>
                          Ask AI Tutor
                        </Button>
                      </Link>
                      <Link to="/mistakes">
                        <Button size="sm" variant="outline">
                          View Mistake Log
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit / Next Button */}
            <div className="flex justify-end pt-2">
              {!isAnswered ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer || submitting}
                  className="w-full sm:w-auto"
                >
                  {submitting ? 'Evaluating...' : 'Submit Answer'}
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="w-full sm:w-auto" icon={<ArrowRight className="w-4 h-4" />}>
                  {evalResult.sessionProgress?.isCompleted ? 'View Results' : 'Next Question'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Session Results View
  if (sessionSummary) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 text-center space-y-6">
        <Card className="p-8 space-y-6">
          <Award className="w-16 h-16 text-amber-500 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Practice Session Completed!</h2>
            <p className="text-sm text-slate-500 mt-1">Great effort! Your topic mastery and learning profile have been updated.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-2xl font-bold text-emerald-600">{sessionSummary.score}%</p>
              <p className="text-xs text-slate-500 font-medium">Session Score</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-2xl font-bold text-slate-800">
                {sessionSummary.completedQuestions}/{sessionSummary.totalQuestions}
              </p>
              <p className="text-xs text-slate-500 font-medium">Questions Completed</p>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Button variant="outline" onClick={() => setSessionSummary(null)} icon={<RefreshCw className="w-4 h-4" />}>
              Practice Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Recommendations Dashboard View
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Adaptive Practice Engine</h1>
        <p className="text-sm text-slate-500 mt-1">
          Personalized practice recommendations based on your real learning gaps and topic mastery.
        </p>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>Recommended For You Right Now</span>
        </div>

        {recommendations.length === 0 ? (
          <Card className="text-center py-8 text-slate-500 text-sm">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p>No active recommendations right now. Select a topic below to begin!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3 hover:border-emerald-500 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                      {rec.subjectName}
                    </span>
                    {getDifficultyBadge(rec.recommendedDifficulty)}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{rec.topicName}</h3>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                    "{rec.reason}"
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    {rec.estimatedQuestions} adaptive questions
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleStartPractice(rec.topicId)}
                    icon={<Zap className="w-3.5 h-3.5" />}
                  >
                    Start Practice
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Topic Selection Wizard */}
      <Card title="Practice Any Topic" subtitle="Select a subject and topic to start an instant practice session">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedTopicId('');
              }}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topic</label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">Auto-Select Best Topic</option>
              {topics
                .filter((t) => !selectedSubjectId || String(typeof t.subjectId === 'object' ? t.subjectId._id : t.subjectId) === selectedSubjectId)
                .map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={() => handleStartPractice()} icon={<Target className="w-4 h-4" />}>
            Launch Custom Practice
          </Button>
        </div>
      </Card>
    </div>
  );
};
