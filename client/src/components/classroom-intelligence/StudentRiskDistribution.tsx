import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  distribution: IClassroomIntelligenceClient['riskDistribution'];
}

export const StudentRiskDistribution: React.FC<Props> = ({ distribution }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-rose-400" />
        Student Risk Distribution
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-xs text-emerald-400 font-semibold">Low Risk</div>
          <div className="text-xl font-bold text-white mt-1">{distribution.low.count} ({distribution.low.percentage}%)</div>
        </div>
        <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-xs text-amber-400 font-semibold">Moderate Risk</div>
          <div className="text-xl font-bold text-white mt-1">{distribution.moderate.count} ({distribution.moderate.percentage}%)</div>
        </div>
        <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-xs text-orange-400 font-semibold">High Risk</div>
          <div className="text-xl font-bold text-white mt-1">{distribution.high.count} ({distribution.high.percentage}%)</div>
        </div>
        <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="text-xs text-rose-400 font-semibold">Critical Risk</div>
          <div className="text-xl font-bold text-white mt-1">{distribution.critical.count} ({distribution.critical.percentage}%)</div>
        </div>
      </div>
    </div>
  );
};

export default StudentRiskDistribution;
