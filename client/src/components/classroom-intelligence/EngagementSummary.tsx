import React from 'react';
import { Flame } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  performance: IClassroomIntelligenceClient['performance'];
}

export const EngagementSummary: React.FC<Props> = ({ performance }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <Flame className="w-5 h-5 text-emerald-400" />
        Classroom Engagement Signals
      </h3>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-slate-400">Consistency Index</div>
          <div className="text-lg font-bold text-white mt-1">{performance.averageConsistency}%</div>
        </div>
        <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-slate-400">Engagement Score</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">{performance.engagementScore}%</div>
        </div>
      </div>
    </div>
  );
};

export default EngagementSummary;
