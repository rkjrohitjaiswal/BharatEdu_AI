import React from 'react';
import { CheckCircle } from 'lucide-react';

export interface ResourceQualityBadgeProps {
  qualityScore: number;
  isVerified?: boolean;
}

export const ResourceQualityBadge: React.FC<ResourceQualityBadgeProps> = ({ qualityScore, isVerified }) => {
  return (
    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
      {isVerified && <CheckCircle className="w-3 h-3 text-emerald-600" />}
      <span>{qualityScore}% Quality</span>
    </div>
  );
};
