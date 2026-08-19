import React from 'react';
import { Award, BookOpen, GraduationCap, Heart, LineChart, ShieldCheck } from 'lucide-react';
import { Badge } from '../Badge';

export interface ParentLearningSummaryProps {
  snapshot: any;
}

export const ParentLearningSummary: React.FC<ParentLearningSummaryProps> = ({ snapshot }) => {
  if (!snapshot) return null;

  const {
    studentName = 'Your Child',
    overallMastery = 0,
    riskLevel = 'low',
    riskTrend = 'stable',
    practiceAccuracy = 0,
    studyConsistency = 0,
    examReadiness,
    examCountdownDays,
    achievements = [],
    scholarships = [],
    strengths = [],
    areasRequiringAttention = [],
  } = snapshot;

  const getLevelVariant = (lvl: string) => {
    switch (lvl) {
      case 'critical':
        return 'red';
      case 'high':
        return 'amber';
      case 'moderate':
        return 'blue';
      default:
        return 'emerald';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{studentName}</h2>
            <span className="text-xs text-slate-500 font-medium">Home Learning & Progress Report</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={getLevelVariant(riskLevel)} size="md">
              <span className="capitalize">{riskLevel} Risk</span>
            </Badge>
            <span className="text-xs font-semibold text-slate-500 capitalize">Trend: {riskTrend}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" /> Overall Mastery
            </span>
            <div className="text-xl font-extrabold text-slate-900">{overallMastery}%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <LineChart className="w-3.5 h-3.5 text-emerald-600" /> Practice Accuracy
            </span>
            <div className="text-xl font-extrabold text-slate-900">{practiceAccuracy}%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Study Routine
            </span>
            <div className="text-xl font-extrabold text-slate-900">{studyConsistency}%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-purple-600" /> Exam Prep
            </span>
            <div className="text-xl font-extrabold text-slate-900">
              {examReadiness !== undefined ? `${examReadiness}%` : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Attention Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
          <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-600" />
            <span>Positive Strengths & Progress</span>
          </h4>
          <ul className="text-xs text-emerald-800 space-y-1 font-medium">
            {strengths.map((s: string, idx: number) => (
              <li key={idx}>✨ {s}</li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
          <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Worth Reviewing Together</span>
          </h4>
          <ul className="text-xs text-amber-800 space-y-1 font-medium">
            {areasRequiringAttention.map((a: string, idx: number) => (
              <li key={idx}>🌱 {a}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
