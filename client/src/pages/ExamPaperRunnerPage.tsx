import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchCurrentExamQuestion,
  fetchExamPaper,
  finishExamPaper,
  markExamQuestionForReview,
  skipExamQuestion,
  startExamPaper,
  submitExamAnswer,
} from '../services/api';
import { IExamPaper, IExamPaperQuestionClient } from '../types/exam-paper';

export const ExamPaperRunnerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [paper, setPaper] = useState<IExamPaper | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<IExamPaperQuestionClient | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (id) initExam();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const initExam = async () => {
    setLoading(true);
    const res = await fetchExamPaper(id!);
    if (res.success && res.data) {
      setPaper(res.data);
      setTimeLeft((res.data.durationMinutes || 60) * 60);

      const startRes = await startExamPaper(id!);
      if (startRes.success && startRes.data?.currentQuestion) {
        setCurrentQuestion(startRes.data.currentQuestion);
      } else {
        const curRes = await fetchCurrentExamQuestion(id!);
        if (curRes.success && curRes.data) setCurrentQuestion(curRes.data);
      }
    }
    setLoading(false);
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !id) return;
    setSubmitting(true);
    const res = await submitExamAnswer(id, currentQuestion.questionId, selectedAnswer);
    setSubmitting(false);

    if (res.success && res.data?.nextQuestion) {
      setCurrentQuestion(res.data.nextQuestion);
      setSelectedAnswer('');
    } else {
      handleFinish();
    }
  };

  const handleSkip = async () => {
    if (!currentQuestion || !id) return;
    const res = await skipExamQuestion(id, currentQuestion.questionId);
    if (res.success && res.data?.nextQuestion) {
      setCurrentQuestion(res.data.nextQuestion);
      setSelectedAnswer('');
    }
  };

  const handleMarkReview = async () => {
    if (!currentQuestion || !id) return;
    const res = await markExamQuestionForReview(id, currentQuestion.questionId);
    if (res.success && res.data?.nextQuestion) {
      setCurrentQuestion(res.data.nextQuestion);
      setSelectedAnswer('');
    }
  };

  const handleFinish = async () => {
    if (!id) return;
    await finishExamPaper(id);
    navigate(`/exam-papers/${id}/results`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Initializing Exam Session...</div>;
  if (!paper || !currentQuestion) return <div className="p-12 text-center text-gray-500">Exam session not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Exam Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded">
                REALISTIC MOCK EXAM
              </span>
              <span className="text-xs text-gray-500">{paper.board} • {paper.subject}</span>
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 mt-1">{paper.title}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-xs text-gray-400 block uppercase font-bold">Time Remaining</span>
              <span className={`text-2xl font-black font-mono ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
                ⏱ {formatTime(timeLeft)}
              </span>
            </div>
            <button
              onClick={handleFinish}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-sm"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Exam Question Palette & Main Runner */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Interface */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Question {currentQuestion.sequence} of {paper.questionCount}
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                Marks: <strong className="text-gray-900">+{currentQuestion.marks}</strong> | Negative:{' '}
                <strong className="text-red-600">-{currentQuestion.negativeMarks}</strong>
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 leading-relaxed">{currentQuestion.questionText}</h2>

              {currentQuestion.options && currentQuestion.options.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {currentQuestion.options.map((option, idx) => (
                    <label
                      key={idx}
                      onClick={() => setSelectedAnswer(option)}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAnswer === option
                          ? 'border-red-600 bg-red-50 text-red-900 font-semibold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="exam-option"
                        checked={selectedAnswer === option}
                        onChange={() => setSelectedAnswer(option)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="pt-2">
                  <textarea
                    rows={4}
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    placeholder="Type your mathematical steps or code solution here..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <div className="flex space-x-3">
                <button
                  onClick={handleMarkReview}
                  className="px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-bold rounded-lg"
                >
                  Mark for Review
                </button>
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-bold rounded-lg"
                >
                  Skip Question
                </button>
              </div>

              <button
                onClick={handleSubmitAnswer}
                disabled={submitting}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-sm disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save & Next Question →'}
              </button>
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Question Palette</h3>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: paper.questionCount }).map((_, idx) => {
                const seq = idx + 1;
                const isCur = currentQuestion.sequence === seq;
                return (
                  <div
                    key={seq}
                    className={`h-10 rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${
                      isCur
                        ? 'border-red-600 bg-red-600 text-white ring-2 ring-red-300'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}
                  >
                    {seq}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                <span>Current Question</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                <span>Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
