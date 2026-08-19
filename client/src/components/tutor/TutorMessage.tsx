import React, { useState } from 'react';
import { TutorMessageItem } from '../../types';
import { Bot, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { SourceCitation } from './SourceCitation';

interface TutorMessageProps {
  message: TutorMessageItem;
}

export const TutorMessage: React.FC<TutorMessageProps> = ({ message }) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex items-start gap-2.5 my-3">
      <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
        <Bot className="w-4 h-4" />
      </div>

      <div className="flex flex-col items-start max-w-[90%] sm:max-w-[80%] space-y-1">
        <div className="bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl rounded-tl-xs px-4 py-3.5 shadow-2xs text-xs sm:text-sm leading-relaxed space-y-3">
          {/* Main Answer Paragraphs */}
          <div className="whitespace-pre-wrap font-sans">{message.content}</div>

          {/* Source Citations */}
          {message.sources && message.sources.length > 0 && (
            <SourceCitation sources={message.sources} />
          )}

          {/* Feedback Controls */}
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Was this explanation helpful?</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFeedback('up')}
                className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                  feedback === 'up' ? 'text-emerald-600 font-bold' : 'text-slate-500'
                }`}
                title="Helpful"
              >
                {feedback === 'up' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ThumbsUp className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setFeedback('down')}
                className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                  feedback === 'down' ? 'text-red-600 font-bold' : 'text-slate-500'
                }`}
                title="Not helpful"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <span className="text-[10px] text-slate-400 px-1">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};
