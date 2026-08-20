import React from 'react';
import { HelpCircle } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  misconceptions: IClassroomIntelligenceClient['misconceptions'];
}

export const ClassMisconceptions: React.FC<Props> = ({ misconceptions }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-rose-400" />
        Classroom Misconception Aggregation
      </h3>

      <div className="space-y-3">
        {misconceptions.map((m) => (
          <div key={m.misconceptionId} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">{m.tag}</span>
              <span className="text-slate-400">{m.studentCount} Instances</span>
            </div>
            <p className="text-slate-400">{m.description}</p>
            <div className="text-[10px] text-purple-400 font-semibold uppercase pt-1">
              Sources: {m.sources.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassMisconceptions;
