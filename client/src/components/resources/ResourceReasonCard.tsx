import React from 'react';
import { HelpCircle } from 'lucide-react';

export interface ResourceReasonCardProps {
  reason: string;
}

export const ResourceReasonCard: React.FC<ResourceReasonCardProps> = ({ reason }) => {
  if (!reason) return null;

  return (
    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-100 text-xs font-medium flex items-center gap-2">
      <HelpCircle className="w-4 h-4 text-indigo-300 shrink-0" />
      <span>💡 <strong className="font-bold text-white">Why study now?</strong> {reason}</span>
    </div>
  );
};
