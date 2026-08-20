import React from 'react';
import { Lightbulb } from 'lucide-react';

export interface RevisionReasonProps {
  reason: string;
}

export const RevisionReason: React.FC<RevisionReasonProps> = ({ reason }) => {
  return (
    <div className="flex items-start gap-1.5 text-xs text-slate-600 font-medium">
      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
      <span>{reason}</span>
    </div>
  );
};
