import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { RiskScoreMeter } from './RiskScoreMeter';

export interface StudentRiskViewProps {
  data: any;
}

export const StudentRiskView: React.FC<StudentRiskViewProps> = ({ data }) => {
  const navigate = useNavigate();
  if (!data) return null;

  const {
    riskScore = 0,
    riskLevel = 'low',
    riskTrend = 'stable',
    contributingFactors = [],
    recommendedActions = [],
    metricsBreakdown = {},
    aiExplanation = { text: '', aiEnhanced: false },
  } = data;

  return (
    <div className="space-y-6">
      {/* AI Explanation Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 p-6 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-lg text-white">AI Early-Warning Risk Assessment</h3>
              {aiExplanation.aiEnhanced && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  AI Enhanced
                </span>
              )}
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">{aiExplanation.text}</p>
          </div>
        </div>
      </div>

      {/* Meter & Factors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Score Meter */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-700" />
            <span>Academic Risk Meter</span>
          </h3>
          <RiskScoreMeter score={riskScore} level={riskLevel} trend={riskTrend} />

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Overall Mastery</span>
              <span className="font-bold text-slate-900 text-sm">{metricsBreakdown.overallMastery || 0}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Practice Accuracy</span>
              <span className="font-bold text-slate-900 text-sm">{metricsBreakdown.practiceAccuracy || 0}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Active Gaps</span>
              <span className="font-bold text-slate-900 text-sm">{metricsBreakdown.activeGapsCount || 0}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Plan Adherence</span>
              <span className="font-bold text-slate-900 text-sm">{metricsBreakdown.planAdherencePercentage || 0}%</span>
            </div>
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Explainable Risk Factors</span>
          </h3>

          <div className="space-y-2.5">
            {contributingFactors.map((cf: string, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-slate-800 flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span className="leading-relaxed">{cf}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Recovery Actions */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Recommended Recovery Actions</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedActions.map((act: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900 text-sm">{act.title}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800">
                    {act.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
              </div>

              {act.actionUrl && (
                <button
                  onClick={() => navigate(act.actionUrl)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 pt-2 border-t border-slate-200/60"
                >
                  <span>Start Action</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
