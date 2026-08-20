import React from 'react';
import { Target, Award, Calendar } from 'lucide-react';

interface ExamHeaderProps {
  examName: string;
  board: string;
  classLevel: number;
  subject: string;
  targetScore: number;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  examName,
  board,
  classLevel,
  subject,
  targetScore,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-xl mb-6 border border-blue-700/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-300 text-sm font-semibold uppercase tracking-wider mb-1">
            <span>{board} Board</span>
            <span>•</span>
            <span>Class {classLevel}</span>
            <span>•</span>
            <span>{subject}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{examName}</h1>
        </div>

        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15">
          <Target className="w-6 h-6 text-yellow-400" />
          <div>
            <div className="text-xs text-gray-300">Target Score</div>
            <div className="text-lg font-bold text-yellow-300">{targetScore}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
