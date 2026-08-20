import React from 'react';
import { Info } from 'lucide-react';

export interface RevisionReasonProps {
  reason: string;
}

export const RevisionReason: React.FC<RevisionReasonProps> = ({ reason }) => {
  if (!reason) return null;

  return (
    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium flex items-center gap-2">
      <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
      <span>{reason}</span>
    </div>
  );
};
