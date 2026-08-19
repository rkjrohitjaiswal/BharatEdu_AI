import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Flame, Clock, Target, TrendingUp } from 'lucide-react';

interface ParentLearningOverviewProps {
  overallMastery: number;
  progressTrend: { trend: string; score: number };
  practiceAccuracy: number;
  practiceStreak: number;
  totalPracticeTimeMinutes: number;
}

export const ParentLearningOverview: React.FC<ParentLearningOverviewProps> = ({
  overallMastery,
  progressTrend,
  practiceAccuracy,
  practiceStreak,
  totalPracticeTimeMinutes,
}) => {
  return (
    <Card title="Learning Overview" subtitle="High-level learning progress indicators">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 space-y-1">
          <span className="text-purple-700 font-medium block">Overall Mastery</span>
          <span className="text-xl font-extrabold text-purple-950">{overallMastery}%</span>
        </div>

        <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 space-y-1">
          <span className="text-indigo-700 font-medium block">Accuracy Rate</span>
          <span className="text-xl font-extrabold text-indigo-950">{practiceAccuracy}%</span>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 space-y-1">
          <span className="text-amber-700 font-medium flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Streak
          </span>
          <span className="text-xl font-extrabold text-amber-950">{practiceStreak} Days</span>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1">
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-500" /> Practice Time
          </span>
          <span className="text-xl font-extrabold text-emerald-950">
            {Math.floor(totalPracticeTimeMinutes / 60)}h {totalPracticeTimeMinutes % 60}m
          </span>
        </div>
      </div>
    </Card>
  );
};
