import React from 'react';
import { Award, Zap } from 'lucide-react';

export interface LearningLevelCardProps {
  level: string;
  score: number;
}

export const LearningLevelCard: React.FC<LearningLevelCardProps> = ({ level, score }) => {
  const getLevelColor = (l: string) => {
    switch (l.toLowerCase()) {
      case 'mastery':
        return 'from-emerald-500 to-teal-700 text-white';
      case 'advanced':
        return 'from-purple-600 to-indigo-700 text-white';
      case 'intermediate':
        return 'from-indigo-600 to-blue-700 text-white';
      case 'developing':
        return 'from-amber-500 to-orange-600 text-white';
      default:
        return 'from-slate-700 to-slate-800 text-white';
    }
  };

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-r ${getLevelColor(level)} shadow-lg flex items-center justify-between`}>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold opacity-90">
          <Award className="w-4 h-4" />
          <span>Curriculum Mastery Level</span>
        </div>
        <h3 className="text-xl font-black capitalize tracking-tight">{level} Level</h3>
        <p className="text-xs opacity-80">Authoritative Readiness Score: {score}/100</p>
      </div>

      <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
        <div className="flex items-center justify-center gap-1 text-yellow-300">
          <Zap className="w-4 h-4 fill-yellow-300" />
          <span className="font-extrabold text-lg">{score}</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest block opacity-75 font-semibold">Readiness</span>
      </div>
    </div>
  );
};
