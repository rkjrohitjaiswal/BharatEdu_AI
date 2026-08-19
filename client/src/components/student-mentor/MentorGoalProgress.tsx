import React from 'react';
import { Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface MentorGoalProgressProps {
  goals: any[];
}

export const MentorGoalProgress: React.FC<MentorGoalProgressProps> = ({ goals }) => {
  if (!goals || goals.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-600" />
          <span>Active Learning Goals</span>
        </h4>
        <Link to="/goals" className="text-xs font-semibold text-indigo-600 hover:underline">
          View All
        </Link>
      </div>

      <div className="space-y-2">
        {goals.map((g, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">{g.title}</span>
              <span className="font-bold text-indigo-600">{g.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, g.progress))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
