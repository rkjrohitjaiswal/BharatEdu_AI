import React from 'react';
import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '../Badge';

export interface ParentRiskViewProps {
  data: any;
}

export const ParentRiskView: React.FC<ParentRiskViewProps> = ({ data }) => {
  if (!data) return null;

  const {
    studentName = 'Student',
    riskLevel = 'low',
    riskTrend = 'stable',
    summaryText = { text: '', aiEnhanced: false },
    recommendedSupportActions = [],
  } = data;

  const getLevelBadgeVariant = (lvl: string) => {
    switch (lvl) {
      case 'critical':
        return 'red';
      case 'high':
        return 'amber';
      case 'moderate':
        return 'blue';
      default:
        return 'emerald';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-lg text-white">Parent Risk Report: {studentName}</h3>
              {summaryText.aiEnhanced && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  AI Enhanced
                </span>
              )}
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">{summaryText.text}</p>
          </div>
        </div>
      </div>

      {/* Status Overview Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-900 text-base">Current Learning Status</h3>
            <Badge variant={getLevelBadgeVariant(riskLevel)} size="md">
              <span className="capitalize">{riskLevel} Risk</span>
            </Badge>
          </div>
          <span className="text-xs font-semibold text-slate-500 capitalize">Trend: {riskTrend}</span>
        </div>
      </div>

      {/* Recommended Family Support Actions */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>Recommended Family Support Actions</span>
        </h3>

        <div className="space-y-2">
          {recommendedSupportActions.map((act: string, idx: number) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
              🌱 {act}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
