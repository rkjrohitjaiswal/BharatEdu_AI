import React from 'react';
import { Card } from '../Card';
import { Target, ArrowUpRight } from 'lucide-react';

interface NextMilestonesProps {
  milestones: {
    title: string;
    target: number;
    current: number;
  }[];
}

export const NextMilestones: React.FC<NextMilestonesProps> = ({ milestones }) => {
  return (
    <Card title="Upcoming Milestones" subtitle="Next achievements within your reach">
      <div className="space-y-3 text-xs">
        {(!milestones || milestones.length === 0) ? (
          <p className="text-slate-500 py-2">Keep practicing to discover next milestones!</p>
        ) : (
          milestones.map((m, idx) => {
            const percent = Math.min(100, Math.round((m.current / m.target) * 100));
            return (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center text-slate-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-purple-600" /> {m.title}
                  </span>
                  <span className="text-slate-900">{m.current} / {m.target}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
