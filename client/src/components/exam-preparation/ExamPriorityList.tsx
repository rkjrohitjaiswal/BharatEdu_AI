import React from 'react';
import { IExamPriorityClient } from '../../types/exam-preparation';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExamPriorityListProps {
  priorities: IExamPriorityClient[];
}

export const ExamPriorityList: React.FC<ExamPriorityListProps> = ({ priorities }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Top Priority Concepts</h3>
        <span className="text-xs text-gray-500 font-medium">Ranked by Knowledge Graph & Exam Weightage</span>
      </div>

      <div className="space-y-3">
        {priorities.map((p, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${
              p.isPrerequisiteGap
                ? 'bg-red-50/50 border-red-200'
                : p.isHighRisk
                ? 'bg-amber-50/50 border-amber-200'
                : 'bg-gray-50 border-gray-100'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {p.isPrerequisiteGap ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">{p.topic}</span>
                  <span className="text-xs text-gray-500">• {p.subject}</span>
                  {p.isPrerequisiteGap && (
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Prerequisite Gap
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 mt-1">{p.reason}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <div className="text-xs text-gray-500">Weightage</div>
                <div className="text-sm font-bold text-gray-900">{p.weightage}%</div>
              </div>
              <Link
                to={`/practice?conceptId=${p.conceptId}`}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 flex items-center space-x-1"
              >
                <span>Study Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
