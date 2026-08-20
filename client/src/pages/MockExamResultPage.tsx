import React, { useEffect, useState } from 'react';
import { ArrowRight, Award, CheckCircle2, Clock, RotateCcw, ShieldAlert, Sparkles, Target, Zap } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMockExamResult } from '../services/api';
import { IMockExamResultClient } from '../types/mock-exam';

export const MockExamResultPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<IMockExamResultClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (examId) {
      loadResult();
    }
  }, [examId]);

  const loadResult = async () => {
    if (!examId) return;
    setLoading(true);
    const res = await fetchMockExamResult(examId);
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
          <p className="text-slate-400">Processing exam evaluation & AI analytics...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-slate-300">Exam result not found.</p>
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Celebration Header */}
        <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="inline-flex p-3 bg-purple-500/20 border border-purple-500/40 rounded-2xl text-purple-300 mb-4">
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Exam Evaluation Report</h1>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Server-authoritative scoring & multi-dimensional AI performance diagnostics.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-purple-400">{result.totalScore} / {result.totalMarks}</div>
              <div className="text-xs text-slate-400 font-medium">Total Score</div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-emerald-400">{result.percentage}%</div>
              <div className="text-xs text-slate-400 font-medium">Percentage</div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-amber-400">{result.accuracy}%</div>
              <div className="text-xs text-slate-400 font-medium">Accuracy</div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-indigo-400">{result.percentileEstimate}%ile</div>
              <div className="text-xs text-slate-400 font-medium">Percentile Est.</div>
            </div>
          </div>
        </div>

        {/* Concept Performance & Time Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Concept Mastery Breakdown
            </h3>
            <div className="space-y-2">
              {result.conceptPerformance.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-xs">
                  <span className="font-semibold text-slate-200">{c.conceptId}</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${
                    c.accuracy >= 75 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {c.accuracy}% ({c.correct}/{c.total})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              AI Recommendations
            </h3>
            <div className="space-y-3">
              {result.recommendedActions.map((act, i) => (
                <div key={i} className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-amber-300">{act.title}</div>
                  <div className="text-slate-300">{act.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            onClick={() => navigate('/exam-simulator')}
            className="w-full sm:w-auto py-3 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Take Another Mock Exam</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto py-3 px-6 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockExamResultPage;
