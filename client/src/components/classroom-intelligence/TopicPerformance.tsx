import React from 'react';
import { Target, AlertTriangle } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';

interface Props {
  topics: IClassroomIntelligenceClient['topics'];
}

export const TopicPerformance: React.FC<Props> = ({ topics }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <Target className="w-5 h-5 text-purple-400" />
        Class-wide Topic Analytics & Weak Topics
      </h3>

      <div className="space-y-3">
        {topics.map((t) => (
          <div key={t.topicId} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.subject}</span>
                <h4 className="text-sm font-bold text-white">{t.topicName}</h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                t.category === 'weak' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}>
                {t.category}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
              <span>Mastery: <strong className="text-white">{t.averageMastery}%</strong></span>
              <span>Coverage: <strong className="text-white">{t.studentCoverage}%</strong></span>
              <span>Mistakes: <strong className="text-rose-400">{t.mistakeFrequency}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicPerformance;
