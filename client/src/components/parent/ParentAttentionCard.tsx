import React from 'react';
import { Card } from '../Card';
import { AlertTriangle, HelpCircle } from 'lucide-react';

interface ParentAttentionCardProps {
  activeGapsSummary: {
    subjectName: string;
    gapCount: number;
    description: string;
  }[];
}

export const ParentAttentionCard: React.FC<ParentAttentionCardProps> = ({ activeGapsSummary }) => {
  return (
    <Card title="Needs Attention" subtitle="Topics requiring additional practice or guidance">
      <div className="space-y-3 text-xs">
        {(!activeGapsSummary || activeGapsSummary.length === 0) ? (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
            Great news! No critical learning gaps are currently active.
          </div>
        ) : (
          activeGapsSummary.map((gap, idx) => (
            <div
              key={idx}
              className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl flex items-start gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-bold text-amber-950">{gap.subjectName}</h4>
                <p className="text-amber-800 text-[11px]">{gap.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
