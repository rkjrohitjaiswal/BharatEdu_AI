import React from 'react';
import { Calendar } from 'lucide-react';
import { StudyTaskCard } from './StudyTaskCard';

export interface TodayScheduleProps {
  tasks: any[];
  onCompleteTask: (taskId: string) => void;
  completingTaskId: string | null;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({ tasks, onCompleteTask, completingTaskId }) => {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
        <Calendar className="w-5 h-5 text-indigo-600" />
        <span>Today's Adaptive Schedule ({tasks.length} Tasks)</span>
      </h3>

      <div className="space-y-3">
        {tasks.map((task) => (
          <StudyTaskCard
            key={task.taskId}
            task={task}
            onComplete={onCompleteTask}
            completing={completingTaskId === task.taskId}
          />
        ))}
      </div>
    </div>
  );
};
