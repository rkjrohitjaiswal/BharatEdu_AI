import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export interface LearningPathProgressProps {
  progressPercent: number;
  completedStages: number;
  totalStages: number;
  estimatedTotalMinutes: number;
  dailyMinutes: number;
}

export const LearningPathProgress: React.FC<LearningPathProgressProps> = ({
  progressPercent,
  completedStages,
  totalStages,
  estimatedTotalMinutes,
  dailyMinutes,
}) => {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900">Curriculum Progress</h3>
          <p className="text-xs text-slate-500 font-medium">
            {completedStages} of {totalStages} Stages Completed
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-indigo-600">{progressPercent}%</span>
        </div>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Milestones</span>
            <span className="text-xs font-bold text-slate-800">{completedStages}/{totalStages} Stages</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Budget</span>
            <span className="text-xs font-bold text-slate-800">{dailyMinutes} min/day cap</span>
          </div>
        </div>
      </div>
    </div>
  );
};
