import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AchievementSummaryCardProps {
  summary: any;
}

export const AchievementSummaryCard: React.FC<AchievementSummaryCardProps> = ({ summary }) => {
  const recent = summary?.recentAchievements?.[0];

  return (
    <Card
      title="Achievements & Badges"
      subtitle="Milestones earned through real learning"
      action={
        <Link to="/achievements">
          <Button size="sm" variant="outline" icon={<ArrowRight className="w-3 h-3" />}>
            View Achievements
          </Button>
        </Link>
      }
    >
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-lg">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-950 block text-sm">
                {summary?.totalAchievements || 0} Badges Earned
              </span>
              <span className="text-amber-800 text-[11px]">
                {recent ? `Latest: ${recent.title}` : 'Keep practicing to unlock badges!'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
