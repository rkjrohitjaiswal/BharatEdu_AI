import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  reason: string;
}

export const ResourceReason: React.FC<Props> = ({ reason }) => {
  return (
    <div className="p-2.5 bg-purple-950/30 border border-purple-500/20 rounded-xl text-xs text-purple-200 flex items-start gap-2">
      <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
      <span className="leading-snug">{reason}</span>
    </div>
  );
};

export default ResourceReason;
