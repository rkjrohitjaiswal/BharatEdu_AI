import React from 'react';
import { BarChart2 } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  distribution: IClassroomIntelligenceClient['masteryDistribution'];
}

export const MasteryDistribution: React.FC<Props> = ({ distribution }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-purple-400" />
        Mastery Distribution
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-xs text-rose-400 font-semibold">0 – 25%</div>
          <div className="text-xl font-bold text-white mt-1">{distribution.range0_25.count} ({distribution.range0_25.percentage}%)</div>
        </div>
        <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-xs text-amber-400 font-semibold">26 – 50%</div>
          <div className="text-xl font-bold text-white mt-1">{distribution.range26_50.count} ({distribution.range26_50.percentage}%)</div>
        </div>
        <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-xs text-indigo-400 font-semibold">51 – 75%</div>
          <div className="text-xl font-bold text-white mt-1">{distribution.range51_75.count} ({distribution.range51_75.percentage}%)</div>
        </div>
        <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-xs text-emerald-400 font-semibold">76 – 100%</div>
          <div className="text-xl font-bold text-white mt-1">{distribution.range76_100.count} ({distribution.range76_100.percentage}%)</div>
        </div>
      </div>
    </div>
  );
};

export default MasteryDistribution;
