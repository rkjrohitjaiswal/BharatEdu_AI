import React from 'react';
import { Award } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  distribution: IClassroomIntelligenceClient['assessmentDistribution'];
  averageScore: number;
}

export const AssessmentPerformance: React.FC<Props> = ({ distribution, averageScore }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          Assessment Performance Summary
        </h3>
        <span className="text-sm font-bold text-purple-400">Avg: {averageScore}%</span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-rose-400 font-semibold">&lt;40%</div>
          <div className="text-sm font-bold text-white mt-1">{distribution.range0_40.count}</div>
        </div>
        <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-amber-400 font-semibold">41-60%</div>
          <div className="text-sm font-bold text-white mt-1">{distribution.range41_60.count}</div>
        </div>
        <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-indigo-400 font-semibold">61-80%</div>
          <div className="text-sm font-bold text-white mt-1">{distribution.range61_80.count}</div>
        </div>
        <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-emerald-400 font-semibold">81-100%</div>
          <div className="text-sm font-bold text-white mt-1">{distribution.range81_100.count}</div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPerformance;
