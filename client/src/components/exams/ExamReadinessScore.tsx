import React from 'react';
import { Card } from '../Card';
import { ExamReadinessGauge } from './ExamReadinessGauge';
import { HelpCircle } from 'lucide-react';

interface ExamReadinessScoreProps {
  score: number;
  level: string;
  breakdown: {
    masteryContribution: number;
    practiceAccuracyContribution: number;
    confidenceContribution: number;
    consistencyContribution: number;
    gapHealthContribution: number;
    studyPlanContribution: number;
  };
}

export const ExamReadinessScore: React.FC<ExamReadinessScoreProps> = ({ score, level, breakdown }) => {
  return (
    <Card title="Exam Readiness Score" subtitle="Weighted readiness calculation derived from your learning data">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-1">
          <ExamReadinessGauge score={score} level={level} />
        </div>

        <div className="md:col-span-2 space-y-3 text-xs">
          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-purple-600" /> Why this score?
          </h4>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5">
              <span className="text-slate-500 block text-[10px]">Topic Mastery (40%)</span>
              <span className="font-bold text-slate-900">{breakdown?.masteryContribution || 0} pts</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5">
              <span className="text-slate-500 block text-[10px]">Practice Accuracy (20%)</span>
              <span className="font-bold text-slate-900">{breakdown?.practiceAccuracyContribution || 0} pts</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5">
              <span className="text-slate-500 block text-[10px]">Confidence Level (15%)</span>
              <span className="font-bold text-slate-900">{breakdown?.confidenceContribution || 0} pts</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5">
              <span className="text-slate-500 block text-[10px]">Study Consistency (10%)</span>
              <span className="font-bold text-slate-900">{breakdown?.consistencyContribution || 0} pts</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5">
              <span className="text-slate-500 block text-[10px]">Learning Gap Health (10%)</span>
              <span className="font-bold text-slate-900">{breakdown?.gapHealthContribution || 0} pts</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5">
              <span className="text-slate-500 block text-[10px]">Study Plan Tasks (5%)</span>
              <span className="font-bold text-slate-900">{breakdown?.studyPlanContribution || 0} pts</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
