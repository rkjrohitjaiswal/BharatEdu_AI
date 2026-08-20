import React, { useEffect, useState } from 'react';
import { Award, Clock, ArrowRight, Sparkles, Flame, ShieldAlert, CheckCircle2, History, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createSimulatedMockExam, fetchMockExamRecommendations } from '../services/api';
import { IMockExamRecommendation } from '../types/mock-exam';

export const ExamSimulatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<IMockExamRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchMockExamRecommendations();
    if (res.success && res.data) {
      setRecommendations(res.data);
    }
    setLoading(false);
  };

  const handleStartExam = async (examType: string, title?: string) => {
    setStarting(examType);
    const res = await createSimulatedMockExam({ examType, title });
    if (res.success && res.data?.examId) {
      navigate(`/exam-simulator/${res.data.examId}/instructions`);
    } else {
      setStarting(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            AI Exam Simulator & Mock Test Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Mock Examination Hub</h1>
          <p className="text-slate-400 text-sm mt-1">
            Simulate real examination conditions with server-authoritative timers, negative marking, section controls, and AI diagnostics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/exam-simulator/history')}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all"
          >
            <History className="w-4 h-4" />
            <span>Exam History</span>
          </button>
          <button
            onClick={() => handleStartExam('full_length', 'Full-Length Grand Mock Test')}
            disabled={starting !== null}
            className="py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <Flame className="w-5 h-5" />
            <span>{starting ? 'Generating Mock...' : 'Start Full-Length Mock (180 mins)'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Recommendations & Modes */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Recommended Mock Exams
          </h2>

          {loading ? (
            <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-slate-400 animate-pulse">
              Loading AI exam recommendations...
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.recommendationId}
                  className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 transition-all hover:shadow-xl group"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          rec.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                          rec.priority === 'HIGH' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                          'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                        }`}>
                          {rec.priority} Priority
                        </span>
                        <span className="text-xs text-slate-400">• {rec.durationMinutes} mins</span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {rec.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleStartExam(rec.examType, rec.title)}
                      disabled={starting !== null}
                      className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0"
                    >
                      <span>Select</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-300 text-sm mb-4">{rec.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <span>💡 {rec.reason}</span>
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {rec.totalQuestions} Questions ({rec.totalMarks} Marks)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Exam Simulator Categories */}
          <div className="pt-4">
            <h3 className="text-lg font-bold text-white mb-4">Choose Exam Simulator Format</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { type: 'full_length', label: 'Full-Length Mock', desc: '3-Hour Grand Exam', color: 'text-purple-400' },
                { type: 'sectional', label: 'Sectional Test', desc: 'Subject Speed Test', color: 'text-indigo-400' },
                { type: 'adaptive_mock', label: 'Adaptive Weakness Mock', desc: 'Targeted Gap Test', color: 'text-amber-400' },
                { type: 'board_mock', label: 'Board Pattern Mock', desc: 'Official CBSE Blueprint', color: 'text-emerald-400' },
                { type: 'revision_test', label: 'Smart Revision Test', desc: 'Spaced Recall Test', color: 'text-rose-400' },
                { type: 'topic_test', label: 'Topic Speed Test', desc: '20-Min Topic Check', color: 'text-cyan-400' },
              ].map((m) => (
                <button
                  key={m.type}
                  onClick={() => handleStartExam(m.type, m.label)}
                  disabled={starting !== null}
                  className="p-4 bg-slate-900/40 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-800/40 rounded-xl text-left transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className={`text-sm font-bold ${m.color}`}>{m.label}</div>
                  <div>
                    <div className="text-xs text-slate-300">{m.desc}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Server Authoritative</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Rules & Integrity */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
              Exam Environment Rules
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Timer is strictly governed by server timestamp (`Date.now()`).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Negative marking (-0.25 / -0.5) is enforced automatically.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Answer key explanations are sealed until exam evaluation.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSimulatorPage;
