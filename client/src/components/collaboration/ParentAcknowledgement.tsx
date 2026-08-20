import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ParentAcknowledgement: React.FC = () => {
  return (
    <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4" />
      <span>Parent confirmed home review routine.</span>
    </div>
  );
};

export default ParentAcknowledgement;
