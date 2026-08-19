import React from 'react';
import { Card } from '../Card';
import { BookOpen } from 'lucide-react';

interface SubjectProgressProps {
  subjects: {
    subjectId: string;
    subjectName: string;
    masteryScore: number;
    totalTopics: number;
    masteredTopics: number;
  }[];
}

export const SubjectProgress: React.FC<SubjectProgressProps> = ({ subjects }) => {
  return (
    <Card title="Subject Progress" subtitle="Mastery scores across your child's core curriculum">
      <div className="space-y-4 text-xs">
        {(subjects || []).map((sub) => (
          <div key={sub.subjectId} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                {sub.subjectName}
              </span>
              <span className="font-extrabold text-slate-900">{sub.masteryScore}%</span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  sub.masteryScore >= 75
                    ? 'bg-emerald-500'
                    : sub.masteryScore >= 60
                    ? 'bg-purple-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, sub.masteryScore))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
