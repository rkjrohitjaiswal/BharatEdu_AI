import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Bot, Sparkles, HeartHandshake } from 'lucide-react';

interface LearningTrendCardProps {
  progressTrend: {
    trend: string;
    score: number;
    explanation: string;
  };
  aiSummary: {
    summary: string;
    encouragement: string;
    suggestions: string[];
    aiEnhanced: boolean;
  };
}

export const LearningTrendCard: React.FC<LearningTrendCardProps> = ({ progressTrend, aiSummary }) => {
  return (
    <Card
      title="AI Learning Summary & Guidance"
      subtitle="Parent-friendly progress synthesis"
      action={
        <Badge variant="purple">{aiSummary?.aiEnhanced ? 'AI Enhanced' : 'Deterministic Engine'}</Badge>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-xl border border-purple-100 space-y-2">
          <div className="flex items-center gap-2 text-purple-950 font-bold">
            <Bot className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Progress Synthesis</span>
          </div>
          <p className="text-slate-800 leading-relaxed">{aiSummary?.summary}</p>
        </div>

        {aiSummary?.encouragement && (
          <div className="flex items-start gap-2 text-purple-900 bg-purple-50/70 p-3 rounded-lg border border-purple-100 italic">
            <HeartHandshake className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>"{aiSummary.encouragement}"</span>
          </div>
        )}

        {aiSummary?.suggestions && aiSummary.suggestions.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
              PRACTICAL PARENT SUGGESTIONS
            </span>
            <ul className="space-y-1.5 pl-1">
              {aiSummary.suggestions.map((sug, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};
