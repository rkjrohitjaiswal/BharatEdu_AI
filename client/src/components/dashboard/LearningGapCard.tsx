import React, { useState } from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { LearningGapItem } from '../../types';
import { AlertTriangle, CheckCircle, CheckSquare } from 'lucide-react';
import { resolveLearningGap } from '../../services/api';

interface LearningGapCardProps {
  gaps: LearningGapItem[];
}

export const LearningGapCard: React.FC<LearningGapCardProps> = ({ gaps: initialGaps }) => {
  const [gapsList, setGapsList] = useState<LearningGapItem[]>(initialGaps);

  const activeGaps = gapsList.filter((g) => g.status === 'active' || g.status === 'improving');

  const handleResolveGap = async (gapId: string) => {
    // Optimistic UI update
    setGapsList((prev) => prev.map((g) => (g._id === gapId ? { ...g, status: 'resolved' as const } : g)));
    await resolveLearningGap(gapId);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <Badge variant="purple">Critical Severity</Badge>;
      case 'high':
        return <Badge variant="amber">High Severity</Badge>;
      case 'medium':
        return <Badge variant="blue">Medium Severity</Badge>;
      default:
        return <Badge variant="slate">Low Severity</Badge>;
    }
  };

  return (
    <Card title="Needs Attention" subtitle="Active learning gaps & misconception alerts">
      {activeGaps.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500 space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="font-semibold text-slate-700">All Clear!</p>
          <p className="text-slate-400">You're currently on track. Keep learning to build your mastery.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeGaps.map((gap) => {
            const topicName =
              typeof gap.topicId === 'object' && gap.topicId !== null
                ? gap.topicId.name
                : 'Curriculum Topic';

            return (
              <div
                key={gap._id}
                className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{topicName}</span>
                  </div>
                  {getSeverityBadge(gap.severity)}
                </div>

                <div className="flex items-center justify-between text-[11px] text-amber-800">
                  <span className="font-semibold uppercase">{gap.gapType.replace('_', ' ')}</span>
                  <span>Detected {new Date(gap.detectedAt).toLocaleDateString('en-IN')}</span>
                </div>

                {gap.evidence && (
                  <p className="text-amber-900 bg-white/60 p-2 rounded border border-amber-100 font-medium">
                    "{gap.evidence}"
                  </p>
                )}

                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700"
                    icon={<CheckSquare className="w-3.5 h-3.5 text-emerald-600" />}
                    onClick={() => handleResolveGap(gap._id)}
                  >
                    Mark Resolved
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
