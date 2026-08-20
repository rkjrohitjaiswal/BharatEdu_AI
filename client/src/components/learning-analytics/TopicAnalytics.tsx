import React from 'react';
import { Layers } from 'lucide-react';

export interface TopicAnalyticsProps {
  topics: any[];
}

export const TopicAnalytics: React.FC<TopicAnalyticsProps> = ({ topics }) => {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
        <Layers className="w-5 h-5 text-indigo-600" />
        <span>Topic Performance & Prioritized Recommendations</span>
      </h3>

      <div className="space-y-3">
        {topics.map((t, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs">{t.topicName}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">({t.subject})</span>
              </div>
              <span className="text-xs font-black text-indigo-600">{t.mastery}% Mastery</span>
            </div>

            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, t.mastery))}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 font-medium">💡 {t.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
