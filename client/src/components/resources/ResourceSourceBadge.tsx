import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  provider: string;
  isVerified?: boolean;
}

export const ResourceSourceBadge: React.FC<Props> = ({ provider, isVerified = true }) => {
  return (
    <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-300">
      {isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
      <span>{provider}</span>
      {isVerified && <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">Verified</span>}
    </div>
  );
};

export default ResourceSourceBadge;
