import React from 'react';
import { Users, Award, TrendingUp, AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  data: IClassroomIntelligenceClient;
}

export const ClassroomOverview: React.FC<Props> = ({ data }) => {
  const { classIntelligence, performance } = data;

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <span>{classIntelligence.subject}</span>
            <span>•</span>
            <span>{classIntelligence.classLevel}</span>
            <span>•</span>
            <span>{classIntelligence.board}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">{classIntelligence.className}</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time AI Classroom Intelligence & Teacher Remediation Engine</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-300 text-xs font-bold flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{classIntelligence.activeStudentCount} Active Students</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
          <div className="text-2xl md:text-3xl font-black text-purple-400">{performance.averageMastery}%</div>
          <div className="text-xs text-slate-400 font-medium">Average Mastery</div>
        </div>
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
          <div className="text-2xl md:text-3xl font-black text-emerald-400">{performance.averagePracticeAccuracy}%</div>
          <div className="text-xs text-slate-400 font-medium">Practice Accuracy</div>
        </div>
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
          <div className="text-2xl md:text-3xl font-black text-amber-400">{performance.averageAssessmentScore}%</div>
          <div className="text-xs text-slate-400 font-medium">Assessment Score</div>
        </div>
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
          <div className="text-2xl md:text-3xl font-black text-rose-400">{performance.averageRisk}</div>
          <div className="text-xs text-slate-400 font-medium">Average Risk Index</div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomOverview;
