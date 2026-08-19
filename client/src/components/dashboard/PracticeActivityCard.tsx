import React, { useEffect, useState } from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { fetchPracticeHistorySummary } from '../../services/api';
import { History, BrainCircuit, Target, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PracticeActivityCard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPracticeHistorySummary().then((res) => {
      if (res.success && res.data) {
        setSummary(res.data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <Card
      title="Practice Activity & History"
      subtitle="Historical accuracy & timeline overview"
      action={
        <Link to="/practice-history">
          <Button size="sm" variant="outline" icon={<ArrowRight className="w-3.5 h-3.5" />}>
            View History
          </Button>
        </Link>
      }
    >
      {loading ? (
        <div className="py-4 text-center text-xs text-slate-400">Loading practice statistics...</div>
      ) : !summary || summary.totalSessions === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500 space-y-2">
          <History className="w-8 h-8 text-purple-300 mx-auto" />
          <p className="font-semibold text-slate-700">No Practice Activity Yet</p>
          <p className="text-slate-400">Start an adaptive practice session to begin building your streak.</p>
          <Link to="/practice">
            <Button size="sm" variant="outline">Start Practice</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-xl space-y-0.5">
              <span className="text-[10px] text-purple-700 font-semibold uppercase">Sessions</span>
              <p className="text-lg font-bold text-purple-900">{summary.totalSessions}</p>
            </div>

            <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl space-y-0.5">
              <span className="text-[10px] text-emerald-700 font-semibold uppercase">Accuracy</span>
              <p className="text-lg font-bold text-emerald-900">{summary.overallAccuracy}%</p>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl space-y-0.5">
              <span className="text-[10px] text-amber-700 font-semibold uppercase">Streak</span>
              <p className="text-lg font-bold text-amber-900 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {summary.currentPracticeStreak}d
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-[11px]">
            <span className="text-slate-600">Total Practice Time: <strong>{summary.totalPracticeMinutes} mins</strong></span>
            <span className="text-slate-600">Questions Solved: <strong>{summary.totalQuestions}</strong></span>
          </div>
        </div>
      )}
    </Card>
  );
};
