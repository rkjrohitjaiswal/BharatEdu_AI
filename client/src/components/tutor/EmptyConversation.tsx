import React from 'react';
import { Bot, Lightbulb, Sparkles, BookOpen } from 'lucide-react';

interface EmptyConversationProps {
  onSelectPrompt: (prompt: string) => void;
}

export const EmptyConversation: React.FC<EmptyConversationProps> = ({ onSelectPrompt }) => {
  const suggestedPrompts = [
    'Explain photosynthesis simply.',
    'Help me understand quadratic equations.',
    "What is Newton's second law?",
    'Give me a practice question on probability.',
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[380px] p-6 text-center max-w-lg mx-auto space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md">
        <Bot className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-extrabold text-slate-900">Ask me anything you're learning</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          I can explain core concepts step-by-step, answer homework questions, and provide grounded educational sources based on NCERT guidelines.
        </p>
      </div>

      {/* UI Suggested Prompts */}
      <div className="w-full space-y-2 pt-2">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Suggested Starter Questions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(prompt)}
              className="p-3 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-xl text-xs text-slate-700 font-medium transition-all text-left flex items-start gap-2 shadow-2xs group"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
