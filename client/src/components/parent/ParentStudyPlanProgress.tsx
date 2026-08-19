import React from 'react';
import { Card } from '../Card';

interface ParentStudyPlanProgressProps {
  studyPlanProgress: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
  };
}

export const ParentStudyPlanProgress: React.FC<ParentStudyPlanProgressProps> = ({ studyPlanProgress }) => {
  const percent =
    studyPlanProgress.totalTasks > 0
      ? Math.round((studyPlanProgress.completedTasks / studyPlanProgress.totalTasks) * 100)
      : 50;

  return (
    <Card title="Study Plan Completion" subtitle="Progress on scheduled study plan tasks">
      <div className="space-y-3 text-xs">
        <div className="flex justify-between items-center text-slate-700">
          <span className="font-bold">Scheduled Tasks Completed</span>
          <span className="font-extrabold text-slate-900">
            {studyPlanProgress.completedTasks} / {studyPlanProgress.totalTasks} ({percent}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-purple-600 h-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
