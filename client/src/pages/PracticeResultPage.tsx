import React, { useEffect, useState } from 'react';
import { ArrowRight, Award, BookOpen, CheckCircle2, Clock, RotateCcw, Sparkles, Target, Zap } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPersonalizedSessionResult } from '../services/api';
import { IPracticeSessionSummary } from '../types/personalized-practice';

export const PracticeResultPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<IPracticeSessionSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      loadResult();
    }
  }, [sessionId]);

  const loadResult = async () => {
    if (!sessionId) return;
    setLoading(true);
    const res = await fetchPersonalizedSessionResult(sessionId);
    if (res.success && res.data) {
      setSummary(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Computing session summary and mastery analysis...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-slate-300">Session summary not found.</p>
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Celebration Card */}
        <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-indigo-500/30 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="inline-flex p-3 bg-indigo-500/20 border border-indigo-500/40 rounded-2xl text-indigo-300 mb-4">
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Practice Session Complete!</h1>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Great job! Your response patterns have been processed by the Adaptive Mastery Engine.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-indigo-400">{summary.accuracyPercentage}%</div>
              <div className="text-xs text-slate-400 font-medium">Accuracy</div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-emerald-400">{summary.correctAnswers}/{summary.totalQuestions}</div>
              <div className="text-xs text-slate-400 font-medium">Correct Qs</div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-amber-400">{summary.hintsUsedCount}</div>
              <div className="text-xs text-slate-400 font-medium">Hints Used</div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-purple-400">{summary.totalTimeSeconds}s</div>
              <div className="text-xs text-slate-400 font-medium">Time Taken</div>
            </div>
          </div>
        </div>

        {/* Breakdown & AI Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Concepts Practiced
            </h3>
            <div className="flex flex-wrap gap-2">
              {summary.conceptsPracticed.map((c, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300 text-xs font-semibold">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Next Best Action
            </h3>
            {summary.recommendedResourceId ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                <span>Recommended Learning Resource: NCERT Class 10 Algebra</span>
                <button
                  onClick={() => navigate('/resources')}
                  className="py-1 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg shrink-0 ml-2"
                >
                  View
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Excellent mastery! Keep up the momentum with revision.</p>
            )}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            onClick={() => navigate('/personalized-practice')}
            className="w-full sm:w-auto py-3 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Another Practice Session</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeResultPage;
