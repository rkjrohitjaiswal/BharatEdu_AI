import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ExamCountdown } from '../exams/ExamCountdown';

interface ExamPreparationCardProps {
  exams: any[];
}

export const ExamPreparationCard: React.FC<ExamPreparationCardProps> = ({ exams }) => {
  const nextExam = exams?.[0];

  let daysRemaining = 0;
  if (nextExam) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(nextExam.examDate);
    examDate.setHours(0, 0, 0, 0);
    daysRemaining = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <Card
      title="Exam Preparation & Readiness"
      subtitle="Upcoming exam countdown & study readiness"
      action={
        <Link to="/exam-prep">
          <Button size="sm" variant="outline" icon={<ArrowRight className="w-3 h-3" />}>
            View Exam Prep
          </Button>
        </Link>
      }
    >
      <div className="space-y-3 text-xs">
        {!nextExam ? (
          <p className="text-slate-500 py-2">No upcoming exam targets set. Create an exam target to track readiness!</p>
        ) : (
          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <GraduationCap className="w-4 h-4 text-purple-600" /> {nextExam.title}
              </span>
              <ExamCountdown daysRemaining={daysRemaining} />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-600 border-t border-purple-100 pt-2">
              <span>Target Score: {nextExam.targetScore || 85}%</span>
              <Link to={`/exam-prep/${nextExam._id || nextExam.id}/readiness`}>
                <span className="font-bold text-purple-700 hover:underline flex items-center gap-1">
                  View Readiness <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
