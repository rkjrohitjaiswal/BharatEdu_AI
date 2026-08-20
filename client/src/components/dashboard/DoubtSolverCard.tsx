import React, { useEffect, useState } from 'react';
import { ExternalLink, HelpCircle, MessageSquare, Sparkles } from 'lucide-react';
import { fetchDoubtRecommendations } from '../../services/api';

export const DoubtSolverCard: React.FC = () => {
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoubtRecs();
  }, []);

  const loadDoubtRecs = async () => {
    setLoading(true);
    const res = await fetchDoubtRecommendations();
    if (res.success && res.data) {
      setRecommendation(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-black uppercase tracking-wider text-indigo-600">AI Doubt Solver & Tutor</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-[10px]">
          24/7 Contextual Assistance
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-black text-slate-900 leading-snug">
          Ask any question from {recommendation?.recommendedConcept || 'Mathematics'}
        </h4>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {recommendation?.recommendedQuestions?.[0] || 'Get instant step-by-step solutions, Socratic hints, and prerequisite explanations.'}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-500">Step-by-step & Socratic mode available</span>
        <a
          href="/doubts"
          className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs inline-flex items-center gap-1 transition"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Ask Doubt <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>
    </div>
  );
};
