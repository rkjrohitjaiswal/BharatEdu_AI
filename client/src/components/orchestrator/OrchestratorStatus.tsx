import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

interface OrchestratorStatusProps {
  status: 'on_track' | 'needs_attention' | 'high_priority' | 'critical';
  topPriority: string;
  minutesAvailable: number;
}

export const OrchestratorStatus: React.FC<OrchestratorStatusProps> = ({ status, topPriority, minutesAvailable }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'critical':
        return { label: 'CRITICAL RECOVERY NEEDED', bg: 'bg-red-500/20 text-red-300 border-red-500/40', icon: ShieldAlert };
      case 'high_priority':
        return { label: 'HIGH PRIORITY ATTENTION', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: AlertTriangle };
      case 'needs_attention':
        return { label: 'NEEDS ATTENTION', bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', icon: AlertTriangle };
      default:
        return { label: 'ON TRACK', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: CheckCircle2 };
    }
  };

  const badge = getStatusBadge();
  const Icon = badge.icon;

  return (
    <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-xl border ${badge.bg}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Current Intelligence Status</div>
          <div className="text-sm font-extrabold text-white flex items-center space-x-2">
            <span>{badge.label}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-xs border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
        <div>
          <div className="text-slate-400 font-medium">Top Priority Topic</div>
          <div className="font-bold text-yellow-300">{topPriority}</div>
        </div>
        <div>
          <div className="text-slate-400 font-medium">Daily Budget</div>
          <div className="font-bold text-indigo-300">{minutesAvailable} Mins</div>
        </div>
      </div>
    </div>
  );
};
