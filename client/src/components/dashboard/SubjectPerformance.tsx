import React from 'react';
import { Card } from '../Card';
import { SubjectPerformanceItem } from '../../types';
import { BookOpen } from 'lucide-react';

interface SubjectPerformanceProps {
  subjects: SubjectPerformanceItem[];
}

export const SubjectPerformance: React.FC<SubjectPerformanceProps> = ({ subjects }) => {
  return (
    <Card title="Subject Performance" subtitle="Mastery breakdown by subject">
      {subjects.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No Subject Data Available</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {subjects.map((subj) => (
            <div key={subj.subjectId} className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-900">{subj.name}</span>
                <span className="text-emerald-700 font-bold">{subj.masteryScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(subj.masteryScore, 3)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
