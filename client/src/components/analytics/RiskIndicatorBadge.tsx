import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Badge } from '../Badge';

export interface RiskIndicatorBadgeProps {
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskFactors?: string[];
}

export const RiskIndicatorBadge: React.FC<RiskIndicatorBadgeProps> = ({
  riskLevel,
  riskFactors = [],
}) => {
  const getBadgeConfig = () => {
    switch (riskLevel) {
      case 'critical':
        return { variant: 'red' as const, label: 'Critical Risk', icon: AlertOctagon };
      case 'high':
        return { variant: 'amber' as const, label: 'High Risk', icon: ShieldAlert };
      case 'moderate':
        return { variant: 'blue' as const, label: 'Moderate Risk', icon: AlertTriangle };
      default:
        return { variant: 'emerald' as const, label: 'Low Risk (On Track)', icon: CheckCircle };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Badge variant={config.variant} size="md">
          <Icon className="w-3.5 h-3.5 mr-1 inline" />
          <span>{config.label}</span>
        </Badge>
      </div>

      {riskFactors.length > 0 && (
        <ul className="mt-1 space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          {riskFactors.map((rf, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-amber-500 font-bold">•</span>
              <span>{rf}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
