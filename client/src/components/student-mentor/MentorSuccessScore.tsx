import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

export interface MentorSuccessScoreProps {
  score: number;
  explanation: string;
}

export const MentorSuccessScore: React.FC<MentorSuccessScoreProps> = ({ score, explanation }) => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>Daily Success Score</span>
        </h3>
        <span className="text-2xl font-black text-indigo-600">{score}/100</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>

      <p className="text-xs text-slate-500 font-medium leading-relaxed flex items-start gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
        <span>{explanation}</span>
      </p>
    </div>
  );
};
