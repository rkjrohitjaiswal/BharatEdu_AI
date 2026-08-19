import React from 'react';
import { AlertTriangle, Award, BarChart3, CheckCircle2, Sparkles, TrendingUp, Users } from 'lucide-react';
import { RiskIndicatorBadge } from './RiskIndicatorBadge';

export interface TeacherAnalyticsViewProps {
  data: any;
}

export const TeacherAnalyticsView: React.FC<TeacherAnalyticsViewProps> = ({ data }) => {
  if (!data) return null;

  const {
    totalStudents = 0,
    averageMastery = 0,
    averageAccuracy = 0,
    improvingStudents = [],
    strugglingStudents = [],
    interventionEffectiveness = {},
    weeklySummary = { text: '', aiEnhanced: false },
  } = data;

  return (
    <div className="space-y-6">
      {/* AI Summary Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 p-6 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-lg text-white">Class Intelligence Summary</h3>
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
            <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalStudents}</div>
          <p className="text-xs text-slate-500 mt-1">Enrolled in active class rosters</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Class Avg Mastery</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{averageMastery}%</div>
          <p className="text-xs text-slate-500 mt-1">Class-wide average topic mastery</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Class Practice Acc.</span>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{averageAccuracy}%</div>
          <p className="text-xs text-slate-500 mt-1">Class-wide average practice score</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Intervention Success</span>
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{interventionEffectiveness.effectivenessRate || 100}%</div>
          <p className="text-xs text-slate-500 mt-1">
            {interventionEffectiveness.completed || 0} of {interventionEffectiveness.totalAssigned || 0} completed
          </p>
        </div>
      </div>

      {/* Struggling Students vs Improving Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Struggling Students */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Students Needing Intervention ({strugglingStudents.length})</span>
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {strugglingStudents.length === 0 ? (
              <p className="text-xs text-emerald-700 font-medium">All students are currently on track!</p>
            ) : (
              strugglingStudents.map((st: any) => (
                <div key={st.studentId} className="p-3.5 rounded-xl border border-red-100 bg-red-50/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900 text-sm">{st.name}</span>
                    <span className="text-xs font-bold text-red-700">{st.mastery}% Mastery</span>
                  </div>
                  <RiskIndicatorBadge riskLevel={st.riskLevel} riskFactors={st.riskFactors} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Improving Students */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>Top Performing & Improving ({improvingStudents.length})</span>
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {improvingStudents.map((st: any) => (
              <div key={st.studentId} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{st.name}</h4>
                  <p className="text-xs text-emerald-600 font-medium">Strong progress momentum</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 text-sm">{st.mastery}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
