import React from 'react';
import { TrendingUp } from 'lucide-react';

export const InterventionOutcomeCard: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-400" /> Intervention Outcome Comparison
      </h3>
      <p className="text-xs text-slate-300">
        Performance improved after the intervention: Mastery +20%, Risk Index -30 points.
      </p>
    </div>
  );
};

export default InterventionOutcomeCard;
