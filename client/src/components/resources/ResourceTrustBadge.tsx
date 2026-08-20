import React from 'react';
import { CheckCircle2, Shield, AlertCircle } from 'lucide-react';

export interface ResourceTrustBadgeProps {
  verified: boolean;
  official: boolean;
  trustScore?: number;
}

export const ResourceTrustBadge: React.FC<ResourceTrustBadgeProps> = ({ verified, official, trustScore }) => {
  if (official && verified) {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Official Source
      </span>
    );
  }

  if (verified) {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1">
        <Shield className="w-3 h-3 text-indigo-600" /> Verified Resource
      </span>
    );
  }

  return (
    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1">
      <AlertCircle className="w-3 h-3 text-slate-400" /> Source Not Verified
    </span>
  );
};
