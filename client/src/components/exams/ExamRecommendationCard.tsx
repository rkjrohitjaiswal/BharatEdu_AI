import React from 'react';
import { Card } from '../Card';
import { Bot, Sparkles, CheckCircle2 } from 'lucide-react';

interface ExamRecommendationCardProps {
  explanation: string;
  recommendations: string[];
  aiEnhanced?: boolean;
}

export const ExamRecommendationCard: React.FC<ExamRecommendationCardProps> = ({
  explanation,
  recommendations,
  aiEnhanced,
}) => {
  return (
    <Card
      title="AI Exam Coach Guidance"
      subtitle="Actionable study recommendations tailored for your exam target"
    >
      <div className="space-y-3.5 text-xs">
        <div className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between font-bold text-slate-900">
            <span className="flex items-center gap-1.5 text-purple-700">
              <Bot className="w-4 h-4 text-purple-600" /> Readiness Analysis
            </span>
            {aiEnhanced && (
              <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Enhanced
              </span>
            )}
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px]">{explanation}</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-slate-800 text-[11px]">Recommended Next Actions:</h4>
          {recommendations?.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-700 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
