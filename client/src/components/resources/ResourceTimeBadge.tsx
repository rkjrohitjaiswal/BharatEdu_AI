import React from 'react';
import { Clock } from 'lucide-react';

export interface ResourceTimeBadgeProps {
  estimatedMinutes: number;
}

export const ResourceTimeBadge: React.FC<ResourceTimeBadgeProps> = ({ estimatedMinutes }) => {
  return (
    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
      <Clock className="w-3.5 h-3.5 text-slate-400" /> {estimatedMinutes} min
    </span>
  );
};
