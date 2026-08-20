import React from 'react';
import { Lightbulb } from 'lucide-react';

export interface ResourceReasonProps {
  reason: string;
  sourceFeature?: string;
}

export const ResourceReason: React.FC<ResourceReasonProps> = ({ reason, sourceFeature }) => {
  return (
    <div className="flex items-start gap-1.5 text-xs text-slate-600 font-medium">
      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
      <div>
        <span>{reason}</span>
        {sourceFeature && (
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Via {sourceFeature}</span>
        )}
      </div>
    </div>
  );
};
