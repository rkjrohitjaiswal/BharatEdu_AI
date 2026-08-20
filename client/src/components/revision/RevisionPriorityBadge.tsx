import React from 'react';

export interface RevisionPriorityBadgeProps {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export const RevisionPriorityBadge: React.FC<RevisionPriorityBadgeProps> = ({ priority }) => {
  const getBadgeClass = (p: string) => {
    switch (p) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded border ${getBadgeClass(priority)}`}>
      {priority} Priority
    </span>
  );
};
