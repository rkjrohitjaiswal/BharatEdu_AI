import React from 'react';
import { AlertOctagon, AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle2, Minus, ShieldAlert } from 'lucide-react';
import { Badge } from '../Badge';

export interface RiskScoreMeterProps {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'critical';
  trend?: 'improving' | 'stable' | 'worsening';
}

export const RiskScoreMeter: React.FC<RiskScoreMeterProps> = ({ score, level, trend = 'stable' }) => {
  const getLevelConfig = () => {
    switch (level) {
      case 'critical':
        return { variant: 'red' as const, color: 'text-red-600', bg: 'bg-red-600', icon: AlertOctagon };
      case 'high':
        return { variant: 'amber' as const, color: 'text-amber-600', bg: 'bg-amber-500', icon: ShieldAlert };
      case 'moderate':
        return { variant: 'blue' as const, color: 'text-blue-600', bg: 'bg-blue-500', icon: AlertTriangle };
      default:
        return { variant: 'emerald' as const, color: 'text-emerald-600', bg: 'bg-emerald-500', icon: CheckCircle2 };
    }
  };

  const getTrendBadge = () => {
    if (trend === 'improving') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Improving Trend</span>
        </span>
      );
    }
    if (trend === 'worsening') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>Worsening Trend</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
        <Minus className="w-3.5 h-3.5" />
        <span>Stable Trend</span>
      </span>
    );
  };

  const config = getLevelConfig();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={config.variant} size="md">
            <span className="capitalize">{level} Risk</span>
          </Badge>
          {getTrendBadge()}
        </div>
        <div className={`text-2xl font-black ${config.color}`}>{score}/100</div>
      </div>

      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${config.bg} rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
