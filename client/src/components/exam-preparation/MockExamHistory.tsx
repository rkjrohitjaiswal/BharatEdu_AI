import React from 'react';
import { History } from 'lucide-react';

interface MockExamHistoryProps {
  history: Array<{ title: string; scorePct: number; date: string; status: string }>;
}

export const MockExamHistory: React.FC<MockExamHistoryProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6 text-center text-xs text-gray-500">
        No completed mock exam simulations yet. Attempt your first mock exam above!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <History className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Mock Exam Simulation History</h3>
      </div>

      <div className="space-y-3">
        {history.map((h, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-gray-900">{h.title}</span>
              <div className="text-[10px] text-gray-500">{h.date}</div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-black text-indigo-600 text-sm">{h.scorePct}%</span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                {h.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
