import React from 'react';
import { IExamDayClient } from '../../types/exam-preparation';
import { Calendar, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExamTodayPlanProps {
  todayPlan: IExamDayClient;
}

export const ExamTodayPlan: React.FC<ExamTodayPlanProps> = ({ todayPlan }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Today's Personalized Study Roadmap</h3>
        </div>
        <span className="text-xs text-gray-500 font-medium">Budget: {todayPlan.totalMinutes} Mins</span>
      </div>

      <div className="space-y-3">
        {todayPlan.tasks.map((task, idx) => (
          <div key={idx} className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900">{task.topic}</span>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {task.activityType.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">{task.reason}</div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-gray-500">{task.durationMinutes} mins</span>
              <Link
                to={task.actionUrl}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 flex items-center space-x-1"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Start</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
