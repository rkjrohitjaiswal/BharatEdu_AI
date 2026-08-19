import React, { useEffect, useState } from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { fetchStudentMistakes } from '../../services/api';
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentMistakesCard: React.FC = () => {
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStudentMistakes(3).then((res) => {
      if (res.success && res.data) {
        setMistakes(res.data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <Card
      title="Recent Mistake Reviews"
      subtitle="AI explanations for incorrect practice answers"
      action={
        mistakes.length > 0 ? (
          <Link to="/mistakes">
            <Button size="sm" variant="outline" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All
            </Button>
          </Link>
        ) : undefined
      }
    >
      {loading ? (
        <div className="py-4 text-center text-xs text-slate-400">Loading recent mistakes...</div>
      ) : mistakes.length === 0 ? (
        <div className="text-center py-6 text-xs text-emerald-600 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="font-semibold text-slate-900">Zero Practice Mistakes!</p>
          <p className="text-slate-500">Your recent practice answers are all correct.</p>
        </div>
      ) : (
        <div className="space-y-2.5 text-xs">
          {mistakes.map((m, idx) => (
            <div
              key={m._id || m.id || idx}
              className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-900">{m.topicName}</span>
                <Badge variant="amber" size="sm">
                  {m.subjectName}
                </Badge>
              </div>

              <p className="text-slate-800 font-semibold text-[11px] truncate">"{m.questionText}"</p>

              <div className="flex justify-between items-center pt-1 text-[11px]">
                <span className="text-slate-500">
                  Your Answer: <strong className="text-red-700">{m.studentAnswer || 'N/A'}</strong>
                </span>
                <Link to="/mistakes" className="text-amber-700 hover:underline font-bold flex items-center gap-0.5">
                  Review <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
