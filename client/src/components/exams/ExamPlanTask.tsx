import React from 'react';
import { Badge } from '../Badge';
import { CheckCircle2, Circle, Clock, BookOpen, BrainCircuit, AlertTriangle, Play, HelpCircle } from 'lucide-react';

interface ExamPlanTaskProps {
  task: any;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
}

export const ExamPlanTask: React.FC<ExamPlanTaskProps> = ({ task, onToggleComplete }) => {
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'learn':
        return <BookOpen className="w-4 h-4 text-sky-600" />;
      case 'revise':
        return <HelpCircle className="w-4 h-4 text-indigo-600" />;
      case 'practice':
        return <BrainCircuit className="w-4 h-4 text-purple-600" />;
      case 'mistake_review':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'mock_test':
        return <Play className="w-4 h-4 text-emerald-600" />;
      case 'quick_recall':
      default:
        return <Clock className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div
      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
        task.completed
          ? 'bg-slate-50 border-slate-200 opacity-60'
          : 'bg-white border-slate-200 hover:border-purple-200 shadow-xs'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <button
          onClick={() => onToggleComplete && onToggleComplete(task.taskId, !task.completed)}
          className="mt-0.5 text-slate-400 hover:text-purple-600 cursor-pointer shrink-0"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            {getTaskIcon(task.taskType)}
            <span className={`font-bold text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
              {task.title}
            </span>
          </div>
          <p className="text-slate-500 text-[11px]">{task.reason}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 text-[11px]">
        <span className="text-slate-500 flex items-center gap-1 font-medium">
          <Clock className="w-3 h-3 text-slate-400" /> {task.estimatedMinutes}m
        </span>
        <Badge variant={task.priority === 'critical' ? 'red' : task.priority === 'high' ? 'amber' : 'purple'}>
          Day {task.scheduledDay}
        </Badge>
      </div>
    </div>
  );
};
