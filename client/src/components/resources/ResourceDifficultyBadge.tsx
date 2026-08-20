import React from 'react';

export interface ResourceDifficultyBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const ResourceDifficultyBadge: React.FC<ResourceDifficultyBadgeProps> = ({ difficulty }) => {
  const getBadgeClass = (d: string) => {
    switch (d) {
      case 'advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold capitalize rounded border ${getBadgeClass(difficulty)}`}>
      {difficulty}
    </span>
  );
};
