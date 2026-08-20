import React from 'react';
import { Clock } from 'lucide-react';

interface ExamCountdownProps {
  daysRemaining: number;
  examDateStr?: string;
}

export const ExamCountdown: React.FC<ExamCountdownProps> = ({ daysRemaining, examDateStr }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
        <Clock className="w-6 h-6" />
      </div>
      <div>
        <div className="text-xs text-gray-500 font-medium">Time Remaining to Exam</div>
        <div className="text-2xl font-black text-gray-900">{daysRemaining} Days</div>
        {examDateStr && <div className="text-xs text-gray-400 mt-0.5">Target Exam Date: {examDateStr}</div>}
      </div>
    </div>
  );
};
