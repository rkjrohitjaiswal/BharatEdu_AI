import React from 'react';
import { BookOpen } from 'lucide-react';

interface ExamCoverageProps {
  coveragePct: number;
}

export const ExamCoverage: React.FC<ExamCoverageProps> = ({ coveragePct }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
        <BookOpen className="w-6 h-6" />
      </div>
      <div>
        <div className="text-xs text-gray-500 font-medium">Verified Syllabus Coverage</div>
        <div className="text-2xl font-black text-gray-900">{coveragePct}%</div>
        <div className="text-xs text-gray-400 mt-0.5">Grounding in official curriculum standards</div>
      </div>
    </div>
  );
};
