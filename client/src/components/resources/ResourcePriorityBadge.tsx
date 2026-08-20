import React from 'react';

interface Props {
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export const ResourcePriorityBadge: React.FC<Props> = ({ priority }) => {
  const badgeStyles = {
    critical: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    high: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    medium: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    low: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
  };

  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeStyles[priority] || badgeStyles.medium}`}>
      {priority} Priority
    </span>
  );
};

export default ResourcePriorityBadge;
