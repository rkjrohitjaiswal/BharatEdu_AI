import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { ExamCountdown } from './ExamCountdown';
import { Calendar, GraduationCap, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExamCardProps {
  exam: any;
  onDelete?: (id: string) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onDelete }) => {
  const examId = exam._id || exam.id;
  const examDate = new Date(exam.examDate);
  const formattedDate = examDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  examDate.setHours(0, 0, 0, 0);
  const daysRemaining = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="hover:shadow-md transition-all border border-slate-200">
      <div className="space-y-3 text-xs p-1">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
                {exam.title}
              </h3>
            </div>
            <p className="text-slate-500 text-[11px] capitalize">
              {exam.examType?.replace('_', ' ')} {exam.board ? `(${exam.board})` : ''}
            </p>
          </div>

          <ExamCountdown daysRemaining={daysRemaining} />
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {exam.subjects?.map((sub: any, idx: number) => (
            <Badge key={idx} variant="purple">
              {sub.subjectName}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Exam Date: {formattedDate}
          </span>

          <div className="flex items-center gap-2">
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(examId)}
                icon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
              >
                Delete
              </Button>
            )}
            <Link to={`/exam-prep/${examId}/readiness`}>
              <Button size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Readiness & Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
