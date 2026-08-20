import React from 'react';
import { Target } from 'lucide-react';

export interface PlannerPriorityCardProps {
  topPriority: string;
}

export const PlannerPriorityCard: React.FC<PlannerPriorityCardProps> = ({ topPriority }) => {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-sm flex items-center gap-3">
      <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 shrink-0">
        <Target className="w-6 h-6" />
      </div>
      <div>
        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Today's Top Priority</span>
        <h3 className="font-extrabold text-base text-white">{topPriority}</h3>
      </div>
    </div>
  );
};
