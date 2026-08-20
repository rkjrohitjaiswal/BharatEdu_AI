import React from 'react';

export interface ResourceProgressProps {
  percent: number;
}

export const ResourceProgress: React.FC<ResourceProgressProps> = ({ percent }) => {
  const bounded = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
      <div
        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
        style={{ width: `${bounded}%` }}
      />
    </div>
  );
};
