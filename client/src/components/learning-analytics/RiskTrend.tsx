import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Badge } from '../Badge';

export interface RiskTrendProps {
  riskAnalytics: any;
}

export const RiskTrend: React.FC<RiskTrendProps> = ({ riskAnalytics }) => {
  if (!riskAnalytics) return null;

  const { riskLevel = 'low', riskTrend = 'stable', recoveryActions = [] } = riskAnalytics;

  const getVariant = (lvl: string) => {
    switch (lvl) {
      case 'critical':
        return 'red';
      case 'high':
        return 'amber';
      case 'moderate':
        return 'blue';
      default:
        return 'emerald';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <span>Risk Status & Progression</span>
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant={getVariant(riskLevel)} size="md">
            <span className="capitalize">{riskLevel} Risk</span>
          </Badge>
          <span className="text-xs font-semibold text-slate-500 capitalize">Trend: {riskTrend}</span>
        </div>
      </div>

      {recoveryActions.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Recommended Action:</span>
          <p className="text-xs text-slate-700 font-medium">🌱 {recoveryActions[0]}</p>
        </div>
      )}
    </div>
  );
};
