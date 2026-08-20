import React from 'react';

export interface RevisionPriorityBadgeProps {
  priority: string;
}

export const RevisionPriorityBadge: React.FC<RevisionPriorityBadgeProps> = ({ priority }) => {
  const p = priority.toLowerCase();

  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  if (p === 'critical') style = 'bg-red-50 text-red-700 border-red-200';
  else if (p === 'high') style = 'bg-amber-50 text-amber-700 border-amber-200';
  else if (p === 'medium') style = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  else if (p === 'low') style = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  return (
    <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border ${style}`}>
      {priority} Priority
    </span>
  );
};
