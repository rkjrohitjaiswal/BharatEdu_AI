import React from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  Bot,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { RiskIndicatorBadge } from './RiskIndicatorBadge';

export interface StudentAnalyticsViewProps {
  data: any;
}

export const StudentAnalyticsView: React.FC<StudentAnalyticsViewProps> = ({ data }) => {
  if (!data) return null;

  const {
    overallMastery = 0,
    practiceAccuracy = 0,
    studyTimeMinutes = 0,
    learningGaps = {},
    studyPlanAdherence = {},
    goalsAndAchievements = {},
    examReadinessProgression = [],
    careerSkillProgression = [],
    riskIndicators = { riskLevel: 'low', riskFactors: [] },
    weeklySummary = { text: '', aiEnhanced: false },
    subjectMastery = [],
  } = data;

  return (
    <div className="space-y-6">
      {/* AI Weekly Summary Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-lg text-white">AI Weekly Learning Summary</h3>
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

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Mastery</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{overallMastery}%</div>
          <p className="text-xs text-slate-500 mt-1">Weighted topic mastery across subjects</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Practice Accuracy</span>
            <BrainCircuit className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{practiceAccuracy}%</div>
          <p className="text-xs text-slate-500 mt-1">Adaptive practice questions accuracy</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gap Resolution</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{learningGaps.resolutionRate || 100}%</div>
          <p className="text-xs text-slate-500 mt-1">
            {learningGaps.resolved || 0} resolved / {learningGaps.active || 0} active gap(s)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Plan Adherence</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{studyPlanAdherence.adherencePercentage || 0}%</div>
          <p className="text-xs text-slate-500 mt-1">
            {studyPlanAdherence.completedTasks || 0} of {studyPlanAdherence.totalTasks || 0} tasks completed
          </p>
        </div>
      </div>

      {/* Early-Warning & Risk Indicators Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-700" />
          <span>Early Warning & Learning Risk Indicators</span>
        </h3>
        <RiskIndicatorBadge riskLevel={riskIndicators.riskLevel} riskFactors={riskIndicators.riskFactors} />
      </div>

      {/* Subject Breakdown & Exam Readiness Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Mastery */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <span>Subject Mastery Breakdown</span>
          </h3>
          <div className="space-y-3">
            {subjectMastery.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No subject data available yet.</p>
            ) : (
              subjectMastery.map((sb: any) => (
                <div key={sb.subjectId} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{sb.subjectName}</span>
                    <span>{sb.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${sb.score}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Exam Readiness */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Exam Readiness Progression</span>
          </h3>
          <div className="space-y-3">
            {examReadinessProgression.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No upcoming exams set yet.</p>
            ) : (
              examReadinessProgression.map((e: any) => (
                <div key={e.examId} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{e.title}</h4>
                    <p className="text-xs text-slate-500">{e.daysLeft} day(s) remaining</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 text-sm">{e.readinessScore}%</div>
                    <span className="text-[10px] uppercase font-semibold text-emerald-700">{e.readinessLevel}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
