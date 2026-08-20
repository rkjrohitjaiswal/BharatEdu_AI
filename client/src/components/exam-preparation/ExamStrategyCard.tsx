import React from 'react';
import { Compass } from 'lucide-react';

interface ExamStrategyCardProps {
  strategy: {
    questionOrdering: string[];
    sectionTimeAllocation: Record<string, number>;
    skipStrategy: string;
    reviewStrategy: string;
    confidenceManagement: string;
    finalCheckMinutes: number;
  };
}

export const ExamStrategyCard: React.FC<ExamStrategyCardProps> = ({ strategy }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Compass className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Exam Execution Strategy</h3>
      </div>

      <div className="space-y-4 text-xs text-gray-700">
        <div>
          <div className="font-bold text-gray-900 mb-1">Question Attempt Ordering</div>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {strategy.questionOrdering.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-bold text-gray-900 mb-1">Recommended Section Time Allocations</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(strategy.sectionTimeAllocation).map(([sec, mins], idx) => (
              <div key={idx} className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center">
                <div className="text-[10px] text-gray-500 font-medium">{sec}</div>
                <div className="font-bold text-gray-900 text-sm mt-0.5">{mins} mins</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
          <div className="font-bold text-indigo-900 mb-0.5">Skip & Time Saver Rule</div>
          <div>{strategy.skipStrategy}</div>
        </div>
      </div>
    </div>
  );
};
