import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, HelpCircle, Lightbulb, ShieldAlert, Sparkles, XCircle, Zap } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPersonalizedSessionQuestion, requestPersonalizedSessionHint, submitPersonalizedSessionAnswer } from '../services/api';
import { IPracticeQuestionClient } from '../types/personalized-practice';

export const PracticeSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [questionData, setQuestionData] = useState<IPracticeQuestionClient | null>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [currentDifficulty, setCurrentDifficulty] = useState('medium');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<any | null>(null);
  const [hintText, setHintText] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    if (sessionId) {
      loadQuestion();
    }
  }, [sessionId]);

  const loadQuestion = async () => {
    if (!sessionId) return;
    setLoading(true);
    setSelectedOption('');
    setSubmittedFeedback(null);
    setHintText(null);
    setHintLevel(0);

    const res = await fetchPersonalizedSessionQuestion(sessionId);
    if (res.success && res.data) {
      setQuestionData(res.data.question);
      setCurrentIndex(res.data.currentIndex);
      setTotalQuestions(res.data.totalQuestions);
      setCurrentDifficulty(res.data.currentDifficulty);
    }
    setLoading(false);
  };

  const handleRequestHint = async () => {
    if (!sessionId) return;
    const nextLevel = hintLevel + 1;
    const res = await requestPersonalizedSessionHint(sessionId, nextLevel);
    if (res.success && res.data) {
      setHintText(res.data.hintText);
      setHintLevel(res.data.hintLevel);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!sessionId || !selectedOption || submitting) return;
    setSubmitting(true);
    const elapsedSeconds = Math.max(5, Math.round((Date.now() - startTime) / 1000));

    const res = await submitPersonalizedSessionAnswer(sessionId, {
      selectedAnswer: selectedOption,
      responseTimeSeconds: elapsedSeconds,
    });

    if (res.success && res.data) {
      setSubmittedFeedback(res.data);
    }
    setSubmitting(false);
  };

  const handleNext = () => {
    if (submittedFeedback?.isSessionComplete) {
      navigate(`/personalized-practice/session/${sessionId}/result`);
    } else {
      loadQuestion();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Fetching adaptive practice question...</p>
        </div>
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-slate-300">Unable to load practice question.</p>
          <button
            onClick={() => navigate('/personalized-practice')}
            className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl"
          >
            Back to Practice Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 flex flex-col justify-between">
      {/* Header Bar */}
      <div className="max-w-4xl mx-auto w-full mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 uppercase tracking-wider">
            Q {currentIndex} of {totalQuestions}
          </span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
            currentDifficulty === 'hard' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
            currentDifficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          }`}>
            Difficulty: {currentDifficulty}
          </span>
        </div>
        <button
          onClick={() => navigate('/personalized-practice')}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          Exit Session
        </button>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="space-y-2">
          <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            Concept: {questionData.conceptId}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
            {questionData.question}
          </h2>
        </div>

        {/* Options */}
        {questionData.options && questionData.options.length > 0 && (
          <div className="space-y-3">
            {questionData.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              return (
                <button
                  key={idx}
                  onClick={() => !submittedFeedback && setSelectedOption(opt)}
                  disabled={!!submittedFeedback}
                  className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/30'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
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

        {/* Hint Panel */}
        {hintText && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm flex items-start gap-3">
            <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider text-xs block mb-1">Hint Level {hintLevel}</span>
              {hintText}
            </div>
          </div>
        )}

        {/* Submitted Feedback & Explanation */}
        {submittedFeedback && (
          <div className={`p-6 rounded-2xl border ${
            submittedFeedback.isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          } space-y-4`}>
            <div className="flex items-center gap-2 font-bold text-lg">
              {submittedFeedback.isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>Correct Answer! Well done.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-rose-400" />
                  <span>Incorrect. Correct Answer: {submittedFeedback.explanation?.correctAnswer}</span>
                </>
              )}
            </div>

            <p className="text-sm opacity-90 leading-relaxed">
              {submittedFeedback.explanation?.explanation}
            </p>

            {submittedFeedback.explanation?.solutionSteps && (
              <div className="space-y-2 pt-2 border-t border-slate-800/40">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Solution Steps:</span>
                <ol className="list-decimal list-inside text-xs space-y-1 text-slate-300">
                  {submittedFeedback.explanation.solutionSteps.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {!submittedFeedback ? (
            <>
              <button
                onClick={handleRequestHint}
                className="py-2.5 px-4 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Request Hint</span>
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption || submitting}
                className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <span>{submitting ? 'Submitting...' : 'Submit Answer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              className="ml-auto py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>{submittedFeedback.isSessionComplete ? 'View Session Result' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 mt-6">
        BharatEdu AI • Adaptive Mastery Practice Engine
      </div>
    </div>
  );
};

export default PracticeSessionPage;
