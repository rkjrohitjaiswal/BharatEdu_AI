import React from 'react';
import { Award, BookOpen, Clock, HeartHandshake, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { RiskIndicatorBadge } from './RiskIndicatorBadge';

export interface ParentAnalyticsViewProps {
  data: any;
}

export const ParentAnalyticsView: React.FC<ParentAnalyticsViewProps> = ({ data }) => {
  if (!data) return null;

  const {
    studentName = 'Student',
    overallMastery = 0,
    studyTimeMinutes = 0,
    activeGapsCount = 0,
    goalProgressPercentage = 0,
    riskLevel = 'low',
    highlights = [],
    weeklySummary = { text: '', aiEnhanced: false },
  } = data;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-lg text-white">Parent Progress Report: {studentName}</h3>
              {weeklySummary.aiEnhanced && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  AI Enhanced
                </span>
              )}
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">{weeklySummary.text}</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Mastery</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{overallMastery}%</div>
          <p className="text-xs text-slate-500 mt-1">Topic mastery progress</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Study Time</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{studyTimeMinutes} min</div>
          <p className="text-xs text-slate-500 mt-1">Total active practice time</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Learning Gaps</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{activeGapsCount}</div>
          <p className="text-xs text-slate-500 mt-1">Topics needing additional review</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Goal Progress</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{goalProgressPercentage}%</div>
          <p className="text-xs text-slate-500 mt-1">Learning goals achievement rate</p>
        </div>
      </div>

      {/* Safety & Highlights */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Learning Status & Highlights</span>
          </h3>
          <RiskIndicatorBadge riskLevel={riskLevel} />
        </div>

        <div className="space-y-2">
          {highlights.map((h: string, idx: number) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
              ✨ {h}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
