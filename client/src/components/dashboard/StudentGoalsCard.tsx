import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoalProgressBar } from '../goals/GoalProgressBar';

interface StudentGoalsCardProps {
  goals: any[];
}

export const StudentGoalsCard: React.FC<StudentGoalsCardProps> = ({ goals }) => {
  const activeGoals = (goals || []).filter((g) => g.status === 'active');
  const nearestGoal = activeGoals[0];

  return (
    <Card
      title="Learning Goals"
      subtitle="Active target goals & deadline progress"
      action={
        <Link to="/goals">
          <Button size="sm" variant="outline" icon={<ArrowRight className="w-3 h-3" />}>
            View Goals
          </Button>
        </Link>
      }
    >
      <div className="space-y-3 text-xs">
        {!nearestGoal ? (
          <p className="text-slate-500 py-2">No active goals. Set a target goal to stay focused!</p>
        ) : (
          <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl space-y-2">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-600" /> {nearestGoal.title}
              </span>
              <span className="text-purple-700 font-extrabold">{nearestGoal.progressPercent}%</span>
            </div>
            <GoalProgressBar
              progressPercent={nearestGoal.progressPercent}
              currentValue={nearestGoal.currentValue}
              targetValue={nearestGoal.targetValue}
              unit={nearestGoal.unit}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
