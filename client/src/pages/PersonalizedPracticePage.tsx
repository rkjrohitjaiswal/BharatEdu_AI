import React, { useEffect, useState } from 'react';
import { Target, Zap, Sparkles, BookOpen, AlertTriangle, ArrowRight, Award, ShieldCheck, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPersonalizedPracticeSession, fetchPersonalizedPracticeRecommendations } from '../services/api';
import { IPracticeRecommendation, PracticeMode } from '../types/personalized-practice';

export const PersonalizedPracticePage: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<IPracticeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingMode, setStartingMode] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchPersonalizedPracticeRecommendations();
    if (res.success && res.data) {
      setRecommendations(res.data);
    }
    setLoading(false);
  };

  const handleStartSession = async (mode: PracticeMode, conceptId?: string) => {
    setStartingMode(mode);
    const res = await createPersonalizedPracticeSession({ mode, questionCount: 5, conceptId });
    if (res.success && res.data?.sessionId) {
      navigate(`/personalized-practice/session/${res.data.sessionId}`);
    } else {
      setStartingMode(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            AI Adaptive Practice Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Personalized Practice Hub</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time adaptive question generation targeted to your weak concepts, Knowledge Graph prerequisites, and exam goals.
          </p>
        </div>
        <button
          onClick={() => handleStartSession('mixed')}
          disabled={startingMode !== null}
          className="py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Zap className="w-5 h-5" />
          <span>{startingMode ? 'Launching...' : 'Quick Adaptive Session (5 Qs)'}</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Recommendations & Modes */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            Recommended Practice Sessions
          </h2>

          {loading ? (
            <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-slate-400 animate-pulse">
              Loading adaptive practice recommendations...
            </div>
          ) : recommendations.length === 0 ? (
            <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
              <p className="text-slate-400">No practice recommendations available right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.recommendationId}
                  className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all hover:shadow-xl group"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          rec.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                          rec.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                        }`}>
                          {rec.priority} Priority
                        </span>
                        <span className="text-xs text-slate-400">• {rec.subject}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {rec.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleStartSession(rec.mode, rec.conceptId)}
                      disabled={startingMode !== null}
                      className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0"
                    >
                      <span>Start</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-300 text-sm mb-4">{rec.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <span>💡 {rec.reason}</span>
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {rec.questionCount} Questions ({rec.estimatedMinutes} mins)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Additional Practice Modes */}
          <div className="pt-4">
            <h3 className="text-lg font-bold text-white mb-4">Choose Custom Practice Mode</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { mode: 'weak_topic', label: 'Weak Topics', icon: AlertTriangle, color: 'text-amber-400' },
                { mode: 'exam', label: 'Exam Mode', icon: Flame, color: 'text-red-400' },
                { mode: 'revision', label: 'Smart Revision', icon: BookOpen, color: 'text-indigo-400' },
                { mode: 'mistake', label: 'Mistake Review', icon: ShieldCheck, color: 'text-rose-400' },
                { mode: 'career_skill', label: 'Career Skills', icon: Award, color: 'text-emerald-400' },
                { mode: 'mixed', label: 'Mixed Adaptive', icon: Zap, color: 'text-purple-400' },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.mode}
                    onClick={() => handleStartSession(m.mode as PracticeMode)}
                    disabled={startingMode !== null}
                    className="p-4 bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/40 rounded-xl text-left transition-all flex flex-col justify-between gap-3 group"
                  >
                    <Icon className={`w-6 h-6 ${m.color}`} />
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {m.label}
                      </div>
                      <div className="text-xs text-slate-400">Adaptive Qs</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Info & Stats */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Adaptive Intelligence</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                Questions automatically adjust from Easy to Hard based on your accuracy.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                Knowledge Graph ensures prerequisite gaps are resolved before complex topics.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                Hints provide progressive assistance without spoiling final answers.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedPracticePage;
