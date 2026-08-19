import React from 'react';
import { Card } from '../Card';
import { Award, Flame, Target, CheckCircle2 } from 'lucide-react';

interface AchievementSummaryProps {
  summary: {
    totalAchievements: number;
    currentStreak: number;
    goalsCompleted: number;
    categoriesCount?: Record<string, number>;
  };
}

export const AchievementSummary: React.FC<AchievementSummaryProps> = ({ summary }) => {
  return (
    <Card title="Achievements & Milestones" subtitle="Recognizing your real learning accomplishments">
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 space-y-1">
          <span className="text-purple-700 font-medium flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-purple-600" /> Badges
          </span>
          <span className="text-xl font-extrabold text-purple-950">{summary.totalAchievements}</span>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 space-y-1">
          <span className="text-amber-700 font-medium flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Streak
          </span>
          <span className="text-xl font-extrabold text-amber-950">{summary.currentStreak} Days</span>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1">
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Goals Done
          </span>
          <span className="text-xl font-extrabold text-emerald-950">{summary.goalsCompleted}</span>
        </div>
      </div>
    </Card>
  );
};
