import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { GraduationCap, Plus } from 'lucide-react';

interface ExamEmptyStateProps {
  onOpenCreate: () => void;
}

export const ExamEmptyState: React.FC<ExamEmptyStateProps> = ({ onOpenCreate }) => {
  return (
    <Card title="Exam Preparation & Readiness" subtitle="Track upcoming exams and readiness scores">
      <div className="py-12 text-center space-y-4 text-xs">
        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">No Upcoming Exam Targets Set</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Set an upcoming exam date to calculate your readiness score and generate a custom study plan.
          </p>
        </div>
        <Button onClick={onOpenCreate} icon={<Plus className="w-4 h-4" />}>
          Set Your First Exam Target
        </Button>
      </div>
    </Card>
  );
};
