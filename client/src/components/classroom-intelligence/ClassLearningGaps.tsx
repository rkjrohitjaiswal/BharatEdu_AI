import React from 'react';
import { AlertTriangle, GitBranch } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  gaps: IClassroomIntelligenceClient['gaps'];
}

export const ClassLearningGaps: React.FC<Props> = ({ gaps }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        Classroom Learning Gaps & Prerequisite Bottlenecks
      </h3>

      <div className="space-y-3">
        {gaps.map((g) => (
          <div key={g.gapId} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{g.type} gap</span>
                <h4 className="text-sm font-bold text-white">{g.conceptName}</h4>
              </div>
              <span className="text-xs font-bold text-rose-400">{g.studentCount} Students Affected</span>
            </div>
            {g.prerequisiteConcepts && g.prerequisiteConcepts.length > 0 && (
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                <span>Prerequisites: <strong className="text-purple-300">{g.prerequisiteConcepts.join(', ')}</strong></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassLearningGaps;
