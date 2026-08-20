import React from 'react';

export interface ResourcePriorityBadgeProps {
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export const ResourcePriorityBadge: React.FC<ResourcePriorityBadgeProps> = ({ priority }) => {
  const getBadgeStyle = () => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'high':
        return 'bg-amber-500/10 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-indigo-500/10 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold uppercase ${getBadgeStyle()}`}>
      {priority} Priority
    </span>
  );
};
