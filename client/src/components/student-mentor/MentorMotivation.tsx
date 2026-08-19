import React from 'react';
import { Sparkles } from 'lucide-react';

export interface MentorMotivationProps {
  strategy: string;
  motivation: string;
}

export const MentorMotivation: React.FC<MentorMotivationProps> = ({ strategy, motivation }) => {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-md space-y-2">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-300" />
        <h4 className="font-bold text-xs uppercase tracking-wider text-purple-200">Study Strategy & Motivation</h4>
      </div>
      <p className="text-xs font-semibold text-purple-100 leading-snug">{strategy}</p>
      <p className="text-xs text-indigo-200 italic">"{motivation}"</p>
    </div>
  );
};
