import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Target, Plus } from 'lucide-react';

interface GoalEmptyStateProps {
  onOpenCreate: () => void;
}

export const GoalEmptyState: React.FC<GoalEmptyStateProps> = ({ onOpenCreate }) => {
  return (
    <Card title="Your Learning Goals" subtitle="Set personalized goals to guide your practice">
      <div className="py-12 text-center space-y-4 text-xs">
        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
          <Target className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">No Active Learning Goals</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Set target dates and question goals to boost your learning momentum.
          </p>
        </div>
        <Button onClick={onOpenCreate} icon={<Plus className="w-4 h-4" />}>
          Create Your First Goal
        </Button>
      </div>
    </Card>
  );
};
