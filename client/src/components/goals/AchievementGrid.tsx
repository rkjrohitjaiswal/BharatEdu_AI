import React from 'react';
import { AchievementCard } from './AchievementCard';

interface AchievementGridProps {
  achievements: any[];
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({ achievements }) => {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-xs">
        No achievements earned yet. Complete practice sessions and learning goals to unlock badges!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((ach) => (
        <AchievementCard key={ach._id || ach.id || ach.achievementType} achievement={ach} />
      ))}
    </div>
  );
};
