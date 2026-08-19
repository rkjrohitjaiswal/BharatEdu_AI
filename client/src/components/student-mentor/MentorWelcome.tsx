import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export interface MentorWelcomeProps {
  greeting: string;
  topPriorityMessage: string;
  encouragingMessage: string;
  aiGenerated?: boolean;
}

export const MentorWelcome: React.FC<MentorWelcomeProps> = ({
  greeting,
  topPriorityMessage,
  encouragingMessage,
  aiGenerated,
}) => {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">{greeting}</h2>
            <span className="text-xs text-indigo-200 font-medium">Your AI Personal Learning Companion</span>
          </div>
        </div>

        {aiGenerated && (
          <span className="px-2.5 py-1 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> AI-powered Mentor
          </span>
        )}
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-800">
        <p className="text-sm font-semibold text-indigo-100 leading-relaxed">{topPriorityMessage}</p>
        <p className="text-xs text-slate-300 leading-normal">{encouragingMessage}</p>
      </div>
    </div>
  );
};
