import React from 'react';
import { Card } from '../Card';
import { CheckCircle2, Calendar } from 'lucide-react';

interface ParentPracticeActivityProps {
  recentActivity: {
    title: string;
    timestamp: string;
    status: string;
  }[];
}

export const ParentPracticeActivity: React.FC<ParentPracticeActivityProps> = ({ recentActivity }) => {
  return (
    <Card title="Recent Practice Activity" subtitle="History of completed practice sessions">
      <div className="space-y-2 text-xs">
        {(!recentActivity || recentActivity.length === 0) ? (
          <p className="text-slate-500 text-center py-2">No recent practice sessions recorded.</p>
        ) : (
          recentActivity.map((act, idx) => (
            <div
              key={idx}
              className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">{act.title}</span>
              </div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {act.timestamp}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
