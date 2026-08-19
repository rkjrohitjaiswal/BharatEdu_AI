import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { GoalProgressBar } from './GoalProgressBar';
import { Target, Calendar, Pause, Play, Trash2, CheckCircle2 } from 'lucide-react';

interface GoalCardProps {
  goal: any;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onPause, onResume, onDelete }) => {
  const goalId = goal._id || goal.id;
  const isCompleted = goal.status === 'completed';
  const isPaused = goal.status === 'paused';
  const formattedDate = new Date(goal.targetDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="hover:shadow-md transition-all border border-slate-200">
      <div className="space-y-3.5 text-xs p-1">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600 shrink-0" />
              {goal.title}
            </h3>
            {goal.description && <p className="text-slate-500 text-[11px]">{goal.description}</p>}
          </div>

          <Badge variant={isCompleted ? 'emerald' : isPaused ? 'slate' : 'purple'}>
            {goal.status}
          </Badge>
        </div>

        <GoalProgressBar
          progressPercent={goal.progressPercent}
          currentValue={goal.currentValue}
          targetValue={goal.targetValue}
          unit={goal.unit}
        />

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Target: {formattedDate}
          </span>

          <div className="flex items-center gap-1.5">
            {!isCompleted && (
              isPaused ? (
                <Button size="sm" variant="outline" onClick={() => onResume && onResume(goalId)} icon={<Play className="w-3 h-3" />}>
                  Resume
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => onPause && onPause(goalId)} icon={<Pause className="w-3 h-3" />}>
                  Pause
                </Button>
              )
            )}

            <Button size="sm" variant="outline" onClick={() => onDelete && onDelete(goalId)} icon={<Trash2 className="w-3 h-3 text-red-500" />}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
