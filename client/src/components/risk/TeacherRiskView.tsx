import React from 'react';
import { AlertOctagon, AlertTriangle, ShieldAlert, Sparkles, Users } from 'lucide-react';
import { RiskScoreMeter } from './RiskScoreMeter';

export interface TeacherRiskViewProps {
  data: any;
}

export const TeacherRiskView: React.FC<TeacherRiskViewProps> = ({ data }) => {
  if (!data) return null;

  const {
    totalStudents = 0,
    atRiskCount = 0,
    criticalCount = 0,
    highCount = 0,
    atRiskStudents = [],
    classSummary = { text: '', aiEnhanced: false },
  } = data;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 p-6 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-lg text-white">Class Risk Overview & Early Warnings</h3>
              {classSummary.aiEnhanced && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  AI Enhanced
                </span>
              )}
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">{classSummary.text}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Enrolled</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalStudents}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">At Risk Count</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{atRiskCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Risk</span>
            <AlertOctagon className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{criticalCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">High Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{highCount}</div>
        </div>
      </div>

      {/* At Risk Students List */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-600" />
          <span>At-Risk Students Roster ({atRiskStudents.length})</span>
        </h3>

        <div className="space-y-4">
          {atRiskStudents.length === 0 ? (
            <p className="text-xs text-emerald-700 font-medium">All students are currently operating at low/moderate risk.</p>
          ) : (
            atRiskStudents.map((st: any) => (
              <div key={st.studentId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 text-sm">{st.studentName}</h4>
                  <span className="text-xs font-bold text-slate-700">Risk Score: {st.riskScore}/100</span>
                </div>

                <RiskScoreMeter score={st.riskScore} level={st.riskLevel} trend={st.riskTrend} />

                {st.contributingFactors?.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Factors:</span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {st.contributingFactors.map((cf: string, idx: number) => (
                        <li key={idx}>• {cf}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
