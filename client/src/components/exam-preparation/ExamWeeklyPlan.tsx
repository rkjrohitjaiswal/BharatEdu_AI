import React from 'react';
import { IExamWeekClient } from '../../types/exam-preparation';
import { CalendarRange } from 'lucide-react';

interface ExamWeeklyPlanProps {
  weeklyPlan: IExamWeekClient;
}

export const ExamWeeklyPlan: React.FC<ExamWeeklyPlanProps> = ({ weeklyPlan }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <CalendarRange className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{weeklyPlan.title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weeklyPlan.days.map((day, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm text-gray-900">{day.dayTitle}</span>
              <span className="text-[10px] font-semibold text-gray-500">{day.date}</span>
            </div>
            <div className="space-y-2">
              {day.tasks.map((task, tidx) => (
                <div key={tidx} className="text-xs bg-white p-2.5 rounded-lg border border-gray-100">
                  <div className="font-semibold text-gray-800">{task.topic}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{task.activityType} • {task.durationMinutes} mins</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
