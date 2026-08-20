import React from 'react';
import { Gauge } from 'lucide-react';

interface ExamReadinessMeterProps {
  score: number;
  status: 'critical' | 'needs_improvement' | 'on_track' | 'exam_ready';
}

export const ExamReadinessMeter: React.FC<ExamReadinessMeterProps> = ({ score, status }) => {
  const getBadge = () => {
    switch (status) {
      case 'critical':
        return { text: 'Critical Attention', bg: 'bg-red-100 text-red-700' };
      case 'needs_improvement':
        return { text: 'Needs Improvement', bg: 'bg-amber-100 text-amber-700' };
      case 'on_track':
        return { text: 'On Track', bg: 'bg-blue-100 text-blue-700' };
      case 'exam_ready':
        return { text: 'Exam Ready', bg: 'bg-emerald-100 text-emerald-700' };
    }
  };

  const badge = getBadge();

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
        <Gauge className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 font-medium">Exam Readiness Score</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge.bg}`}>{badge.text}</span>
        </div>
        <div className="text-2xl font-black text-gray-900">{score}%</div>
        <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              score < 40 ? 'bg-red-500' : score < 65 ? 'bg-amber-500' : score < 85 ? 'bg-blue-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
};
