import React from 'react';
import { Target, Activity, Flame, ShieldAlert } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  performance: IClassroomIntelligenceClient['performance'];
}

export const ClassPerformanceCards: React.FC<Props> = ({ performance }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-4">
        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-semibold uppercase">Exam Readiness</div>
          <div className="text-xl font-bold text-white">{performance.averageExamReadiness}%</div>
        </div>
      </div>

      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-4">
        <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-semibold uppercase">Learning Velocity</div>
          <div className="text-xl font-bold text-white">+{performance.learningVelocity} pts/wk</div>
        </div>
      </div>

      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-4">
        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-semibold uppercase">Completion Rate</div>
          <div className="text-xl font-bold text-white">{performance.averageCompletion}%</div>
        </div>
      </div>
    </div>
  );
};

export default ClassPerformanceCards;
