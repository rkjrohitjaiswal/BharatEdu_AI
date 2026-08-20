import React from 'react';

export interface StudyMaterialPriorityBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const StudyMaterialPriorityBadge: React.FC<StudyMaterialPriorityBadgeProps> = ({ difficulty }) => {
  const getBadgeStyle = () => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      case 'intermediate':
        return 'bg-indigo-500/10 text-indigo-700 border-indigo-200';
      default:
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold uppercase ${getBadgeStyle()}`}>
      {difficulty}
    </span>
  );
};
