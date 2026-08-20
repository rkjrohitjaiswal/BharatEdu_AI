import React from 'react';
import { BookOpen } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  subjects: IClassroomIntelligenceClient['subjects'];
}

export const SubjectPerformance: React.FC<Props> = ({ subjects }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-indigo-400" />
        Subject-wise Performance Ranking
      </h3>

      <div className="space-y-3">
        {subjects.map((s, i) => (
          <div key={i} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">{s.subject}</div>
              <div className="text-xs text-slate-400">Accuracy: {s.averagePracticeAccuracy}% • Velocity: +{s.learningVelocity}</div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                s.status === 'strongest' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                s.status === 'stable' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {s.status.replace(/_/g, ' ')}
              </span>
              <div className="text-xs font-bold text-purple-400 mt-1">{s.averageMastery}% Mastery</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectPerformance;
