import React from 'react';
import { BookOpen } from 'lucide-react';
import { Badge } from '../Badge';

export interface SubjectAnalyticsProps {
  subjects: any[];
}

export const SubjectAnalytics: React.FC<SubjectAnalyticsProps> = ({ subjects }) => {
  if (!subjects || subjects.length === 0) return null;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'critical':
        return 'red';
      case 'needs_attention':
        return 'amber';
      case 'strong':
        return 'emerald';
      default:
        return 'blue';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-indigo-600" />
        <span>Subject Performance & Trends</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((s, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">{s.subject}</h4>
              <Badge variant={getStatusVariant(s.status)} size="md">
                <span className="capitalize">{s.status?.replace('_', ' ')}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-white border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">Mastery</span>
                <span className="font-extrabold text-slate-900">{s.mastery}%</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">Accuracy</span>
                <span className="font-extrabold text-slate-900">{s.accuracy}%</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">Active Gaps</span>
                <span className="font-extrabold text-slate-900">{s.gapsCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
