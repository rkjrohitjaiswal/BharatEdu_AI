import React from 'react';
import { IDailyActionPlanClient } from '../../types/learning-orchestrator';
import { PriorityActionCard } from './PriorityActionCard';
import { Sun, Sunset, Moon } from 'lucide-react';

interface DailyActionPlanProps {
  dailyPlan: IDailyActionPlanClient;
  onComplete?: (id: string) => void;
  onSkip?: (id: string) => void;
}

export const DailyActionPlan: React.FC<DailyActionPlanProps> = ({ dailyPlan, onComplete, onSkip }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base font-extrabold text-gray-900">Today's Schedule & Action Plan</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Scheduled {dailyPlan.totalScheduledMinutes} / {dailyPlan.totalAvailableMinutes} Mins available
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Morning */}
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase mb-3">
            <Sun className="w-4 h-4 text-amber-600" />
            <span>Morning Focus</span>
          </div>
          <div className="space-y-3">
            {dailyPlan.morning.map((act, idx) => (
              <PriorityActionCard key={idx} action={act} onComplete={onComplete} onSkip={onSkip} />
            ))}
          </div>
        </div>

        {/* Afternoon */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs uppercase mb-3">
            <Sunset className="w-4 h-4 text-blue-600" />
            <span>Afternoon Session</span>
          </div>
          <div className="space-y-3">
            {dailyPlan.afternoon.map((act, idx) => (
              <PriorityActionCard key={idx} action={act} onComplete={onComplete} onSkip={onSkip} />
            ))}
          </div>
        </div>

        {/* Evening */}
        <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center space-x-2 text-purple-800 font-bold text-xs uppercase mb-3">
            <Moon className="w-4 h-4 text-purple-600" />
            <span>Evening Review</span>
          </div>
          <div className="space-y-3">
            {dailyPlan.evening.map((act, idx) => (
              <PriorityActionCard key={idx} action={act} onComplete={onComplete} onSkip={onSkip} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
