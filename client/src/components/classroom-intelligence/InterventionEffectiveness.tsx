import React from 'react';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

export const InterventionEffectiveness: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-400" />
        Intervention Effectiveness Tracking
      </h3>

      <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between font-bold">
          <span className="text-slate-200">Prerequisite Remediation - Fractions</span>
          <span className="text-emerald-400">Highly Effective</span>
        </div>
        <p className="text-slate-400">
          Performance improved after intervention: Mastery +20%, Risk -30 points.
        </p>
      </div>
    </div>
  );
};

export default InterventionEffectiveness;
