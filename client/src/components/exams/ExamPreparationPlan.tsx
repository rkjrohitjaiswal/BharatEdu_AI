import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { ExamPlanTask } from './ExamPlanTask';
import { Calendar, RefreshCw } from 'lucide-react';

interface ExamPreparationPlanProps {
  plan: any;
  onGeneratePlan: () => Promise<void>;
  onToggleTask: (taskId: string, completed: boolean) => Promise<void>;
}

export const ExamPreparationPlan: React.FC<ExamPreparationPlanProps> = ({
  plan,
  onGeneratePlan,
  onToggleTask,
}) => {
  return (
    <Card
      title="Exam Preparation Plan"
      subtitle={`Bounded daily study plan (${plan?.availableDailyMinutes || 60} mins/day)`}
      action={
        <Button size="sm" variant="outline" onClick={onGeneratePlan} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Re-generate Plan
        </Button>
      }
    >
      <div className="space-y-4 text-xs">
        {(!plan || !plan.tasks || plan.tasks.length === 0) ? (
          <div className="text-center py-6 space-y-3">
            <p className="text-slate-500">No exam plan generated yet.</p>
            <Button size="sm" onClick={onGeneratePlan}>
              Generate Exam Preparation Plan
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-2.5 bg-purple-50 rounded-xl border border-purple-100">
              <span className="font-bold text-purple-950 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-600" /> Plan Completion: {plan.completionPercentage}%
              </span>
              <span className="text-purple-700 font-medium text-[11px]">
                {plan.tasks.filter((t: any) => t.completed).length} / {plan.tasks.length} Tasks Done
              </span>
            </div>

            <div className="space-y-2">
              {plan.tasks.map((task: any) => (
                <ExamPlanTask key={task.taskId} task={task} onToggleComplete={onToggleTask} />
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
