import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { BookOpen } from 'lucide-react';

interface ExamSubjectReadinessProps {
  subjects: any[];
}

export const ExamSubjectReadiness: React.FC<ExamSubjectReadinessProps> = ({ subjects }) => {
  return (
    <Card title="Subject Readiness Breakdown" subtitle="Subject-level mastery and preparation progress">
      <div className="space-y-3 text-xs">
        {(!subjects || subjects.length === 0) ? (
          <p className="text-slate-500 py-2">No subjects configured for this exam.</p>
        ) : (
          subjects.map((sub, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <BookOpen className="w-4 h-4 text-purple-600" /> {sub.subjectName}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant={sub.readinessScore >= 75 ? 'emerald' : sub.readinessScore >= 50 ? 'purple' : 'red'}>
                    {sub.readinessScore}% Ready
                  </Badge>
                </div>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    sub.readinessScore >= 75 ? 'bg-emerald-500' : sub.readinessScore >= 50 ? 'bg-purple-600' : 'bg-red-500'
                  }`}
                  style={{ width: `${sub.readinessScore}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Avg Mastery: {sub.masteryAverage}%</span>
                <span>Weak Topics: {sub.weakTopicsCount}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
