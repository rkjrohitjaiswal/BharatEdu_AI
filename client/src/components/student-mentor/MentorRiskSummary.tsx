import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Badge } from '../Badge';

export interface MentorRiskSummaryProps {
  riskLevel: string;
  recoveryActions: string[];
}

export const MentorRiskSummary: React.FC<MentorRiskSummaryProps> = ({ riskLevel, recoveryActions }) => {
  if (!riskLevel || riskLevel === 'low') return null;

  const getVariant = (lvl: string) => {
    switch (lvl) {
      case 'critical':
        return 'red';
      case 'high':
        return 'amber';
      default:
        return 'blue';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-red-950 text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>Academic Risk Indicator</span>
        </h4>
        <Badge variant={getVariant(riskLevel)} size="md">
          <span className="capitalize">{riskLevel} Risk</span>
        </Badge>
      </div>

      <div className="space-y-1">
        <span className="text-xs font-semibold text-red-900 block">Recommended Recovery Steps:</span>
        <ul className="text-xs text-red-800 space-y-1 font-medium pl-4 list-disc">
          {recoveryActions.slice(0, 3).map((act, idx) => (
            <li key={idx}>{act}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
