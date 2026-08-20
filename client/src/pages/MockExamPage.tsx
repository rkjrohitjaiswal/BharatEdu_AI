import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, Clock, Flame, ShieldAlert } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { autosaveMockExam, fetchMockExamQuestion, submitMockExam, submitMockExamAnswer } from '../services/api';
import { IMockExamQuestionClient, IMockExamTimerClient } from '../types/mock-exam';

export const MockExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [questionData, setQuestionData] = useState<IMockExamQuestionClient | null>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(50);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isMarkedReview, setIsMarkedReview] = useState(false);
  const [timer, setTimer] = useState<IMockExamTimerClient | null>(null);
  const [visitedQuestions, setVisitedQuestions] = useState<number[]>([1]);
  const [markedForReviewList, setMarkedForReviewList] = useState<number[]>([]);
  const [answersMap, setAnswersMap] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (examId) {
      loadQuestion(currentIndex);
    }
  }, [examId, currentIndex]);

  const loadQuestion = async (qNum: number) => {
    if (!examId) return;
    setLoading(true);
    const res = await fetchMockExamQuestion(examId, qNum);
    if (res.success && res.data) {
      setQuestionData(res.data.question);
      setCurrentIndex(res.data.currentIndex);
      setTotalQuestions(res.data.totalQuestions);
      setSelectedOption(res.data.savedAnswer || answersMap[qNum] || '');
      setIsMarkedReview(res.data.isMarkedForReview || false);
      setTimer(res.data.timer);

      if (!visitedQuestions.includes(qNum)) {
        setVisitedQuestions((prev) => [...prev, qNum]);
      }
    }
    setLoading(false);
  };

  const handleSelectOption = async (opt: string) => {
    setSelectedOption(opt);
    setAnswersMap((prev) => ({ ...prev, [currentIndex]: opt }));
    if (examId) {
      await submitMockExamAnswer(examId, { questionNumber: currentIndex, selectedAnswer: opt });
    }
  };

  const handleToggleReview = () => {
    const nextMarked = !isMarkedReview;
    setIsMarkedReview(nextMarked);
    if (nextMarked) {
      setMarkedForReviewList((prev) => (prev.includes(currentIndex) ? prev : [...prev, currentIndex]));
    } else {
      setMarkedForReviewList((prev) => prev.filter((i) => i !== currentIndex));
    }
    if (examId) {
      autosaveMockExam(examId, { markedForReview: markedForReviewList });
    }
  };

  const handleNavigate = (qNum: number) => {
    if (qNum >= 1 && qNum <= totalQuestions) {
      setCurrentIndex(qNum);
    }
  };

  const handleFinalSubmit = async () => {
    if (!examId || submitting) return;
    setSubmitting(true);
    const res = await submitMockExam(examId);
    if (res.success) {
      navigate(`/exam-simulator/${examId}/result`);
    } else {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading && !questionData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading exam question...</p>
        </div>
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-slate-300">Question not found.</p>
          <button
            onClick={() => navigate('/exam-simulator')}
            className="py-2.5 px-5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl"
          >
            Back to Simulator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-6">
      {/* Top Exam Header */}
      <div className="max-w-6xl mx-auto w-full mb-4 flex items-center justify-between bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 uppercase tracking-wider">
            Question {currentIndex} of {totalQuestions}
          </span>
          <span className="text-xs text-slate-400 font-medium">Marks: +{questionData.marks} | -{questionData.negativeMarks}</span>
        </div>

        {timer && (
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-300 font-mono font-bold text-sm">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Time Left: {formatTimer(timer.timeRemainingSeconds)}</span>
          </div>
        )}

        <button
          onClick={() => setShowSubmitModal(true)}
          className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          Submit Exam
        </button>
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 my-auto">
        {/* Main Question Card */}
        <div className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
              Section: {questionData.sectionId} • Concept: {questionData.conceptId}
            </span>
            <button
              onClick={handleToggleReview}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isMarkedReview
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isMarkedReview ? 'Marked for Review' : 'Mark for Review'}</span>
            </button>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed">
            {questionData.question}
          </h2>

          {/* Options */}
          {questionData.options && questionData.options.length > 0 && (
            <div className="space-y-3">
              {questionData.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-white font-medium shadow-md shadow-purple-500/10'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/30'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => handleNavigate(currentIndex - 1)}
              disabled={currentIndex === 1}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => handleNavigate(currentIndex + 1)}
              disabled={currentIndex === totalQuestions}
              className="py-2.5 px-5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Question Palette</h3>

          <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto pr-1">
            {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((qNum) => {
              const isCurrent = qNum === currentIndex;
              const isAnswered = !!answersMap[qNum];
              const isMarked = markedForReviewList.includes(qNum);
              const isVisited = visitedQuestions.includes(qNum);

              return (
                <button
                  key={qNum}
                  onClick={() => handleNavigate(qNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center border transition-all ${
                    isCurrent
                      ? 'ring-2 ring-purple-400 bg-purple-600 text-white border-purple-400'
                      : isMarked
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : isAnswered
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : isVisited
                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                      : 'bg-slate-950/40 text-slate-500 border-slate-800'
                  }`}
                >
                  {qNum}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-500/30 border border-emerald-500"></span>
              <span>Answered ({Object.keys(answersMap).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-500/30 border border-amber-500"></span>
              <span>Marked for Review ({markedForReviewList.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-slate-950 border border-slate-800"></span>
              <span>Unvisited ({totalQuestions - visitedQuestions.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 text-center shadow-2xl">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 w-14 h-14 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Submit Examination?</h3>
              <p className="text-slate-400 text-sm mt-2">
                You have answered {Object.keys(answersMap).length} out of {totalQuestions} questions. Are you sure you want to finish?
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="py-2.5 px-5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-sm"
              >
                Continue Exam
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30"
              >
                {submitting ? 'Submitting...' : 'Yes, Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockExamPage;
