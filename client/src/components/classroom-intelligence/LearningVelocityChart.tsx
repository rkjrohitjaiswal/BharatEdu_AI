import React from 'react';
import { Activity } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  performance: IClassroomIntelligenceClient['performance'];
}

export const LearningVelocityChart: React.FC<Props> = ({ performance }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-400" />
        Learning Velocity & Growth Trend
      </h3>

      <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Current Velocity Trend:</span>
          <span className="font-bold text-emerald-400 uppercase">Accelerating (+{performance.learningVelocity} pts/wk)</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full" style={{ width: `${Math.min(100, performance.learningVelocity * 10)}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default LearningVelocityChart;
