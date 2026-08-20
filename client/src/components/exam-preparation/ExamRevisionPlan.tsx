import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExamRevisionPlanProps {
  overdueConcepts: string[];
}

export const ExamRevisionPlan: React.FC<ExamRevisionPlanProps> = ({ overdueConcepts }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Smart Revision Integration</h3>
        </div>
        <Link to="/revision" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
          Open Revision Hub →
        </Link>
      </div>

      {overdueConcepts.length === 0 ? (
        <p className="text-xs text-gray-500">All concept revisions are up to date! Spaced repetition memory schedule is clear.</p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-amber-700 font-medium mb-2">
            The following concepts are overdue for revision to prevent memory decay before your exam:
          </p>
          {overdueConcepts.map((c, idx) => (
            <div key={idx} className="p-2.5 bg-amber-50 rounded-lg border border-amber-100 text-xs font-semibold text-amber-900">
              📌 {c.replace(/_/g, ' ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
