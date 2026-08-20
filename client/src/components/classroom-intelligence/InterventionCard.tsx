import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  title: string;
  type: string;
  status: string;
}

export const InterventionCard: React.FC<Props> = ({ title, type, status }) => {
  return (
    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-purple-400 font-semibold uppercase">{type}</span>
        <span className="text-slate-400 capitalize">{status}</span>
      </div>
      <div className="text-sm font-bold text-white">{title}</div>
    </div>
  );
};

export default InterventionCard;
